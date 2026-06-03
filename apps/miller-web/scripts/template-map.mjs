#!/usr/bin/env node
// template-map — map miller-web pages to the components-v2 templates they use,
// and (the point) the reverse: which pages a given template change would affect.
//
// Run before changing any template to see its blast radius:
//   npm run template-map            # human-readable, both directions
//   npm run template-map -- --json  # machine-readable
//
// How it works: walk every app/**/page.jsx, follow LOCAL imports transitively
// (into sections/, banners/, and the gallery registries) but stop at the
// components-v2 boundary — recording which components-v2 modules each route pulls
// in. No build step, no deps, nothing committed, so it can never go stale.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, resolve, sep } from "node:path";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = resolve(SCRIPT_DIR, ".."); // apps/miller-web
const APP_DIR = join(APP_ROOT, "app");
const JSON_OUT = process.argv.includes("--json");

// ── tiny module resolver ────────────────────────────────────────────────────
const EXTS = [".jsx", ".js", ".ts", ".tsx", ".mjs"];
function resolveSpecifier(spec, fromFile) {
  let base;
  if (spec.startsWith("@/")) base = join(APP_ROOT, spec.slice(2));
  else if (spec.startsWith("./") || spec.startsWith("../")) base = resolve(dirname(fromFile), spec);
  else return null; // bare package import — not ours
  const candidates = [base, ...EXTS.map((e) => base + e), ...EXTS.map((e) => join(base, "index" + e))];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) || null;
}

// ── import extraction (regex is fine for this codebase's import style) ───────
const IMPORT_RE = /import\s+(?:([\s\S]*?)\s+from\s+)?["']([^"']+)["']/g;
function readImports(file) {
  const src = readFileSync(file, "utf8");
  const out = [];
  let m;
  while ((m = IMPORT_RE.exec(src))) {
    const clause = (m[1] || "").trim();
    const spec = m[2];
    const names = [];
    const braced = clause.match(/\{([\s\S]*?)\}/);
    if (braced) {
      for (const part of braced[1].split(",")) {
        const name = part.trim().split(/\s+as\s+/)[0].trim();
        if (name) names.push(name);
      }
    } else if (clause && !clause.startsWith("*")) {
      names.push(clause); // default import
    }
    out.push({ spec, names });
  }
  return out;
}

const V2_RE = /components-v2[/\\]([^"']+?)(\.(?:jsx?|tsx?|mjs))?$/;
function v2Module(file) {
  const rel = relative(APP_ROOT, file).split(sep).join("/");
  const m = rel.match(/^components-v2\/(.+?)(?:\.(?:jsx?|tsx?|mjs))?$/);
  return m ? m[1] : null; // e.g. "06_sections/heroes/service-hero-01"
}

// Collect every components-v2 module reachable from a page, following local
// (non-components-v2) files transitively. Stops at the components-v2 boundary.
function collectTemplates(pageFile) {
  const found = new Map(); // v2 module path -> Set of imported names
  const seen = new Set();
  const walk = (file) => {
    if (seen.has(file)) return;
    seen.add(file);
    for (const { spec, names } of readImports(file)) {
      const resolved = resolveSpecifier(spec, file);
      const mod = resolved && v2Module(resolved);
      if (mod) {
        if (!found.has(mod)) found.set(mod, new Set());
        names.forEach((n) => found.get(mod).add(n));
        continue; // boundary — do not recurse into the template itself
      }
      // recurse into local files only (relative or @/ that resolved on disk)
      if (resolved && (spec.startsWith("./") || spec.startsWith("../") || spec.startsWith("@/"))) walk(resolved);
    }
  };
  walk(pageFile);
  return found;
}

// ── route + page discovery ───────────────────────────────────────────────────
function routeFromPageFile(file) {
  const rel = relative(APP_DIR, dirname(file)).split(sep);
  const segs = rel.filter((s) => s && !(s.startsWith("(") && s.endsWith(")"))); // drop route groups
  return "/" + segs.join("/");
}
function findPages(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...findPages(p));
    else if (entry === "page.jsx" || entry === "page.js" || entry === "page.tsx") out.push(p);
  }
  return out;
}
const isDemoRoute = (route) => route.startsWith("/template-gallery") || route.startsWith("/template-testing");
const SECTIONS_PREFIX = "06_sections/";

// ── build the maps ────────────────────────────────────────────────────────────
const pages = findPages(APP_DIR).sort();
const pageToMods = []; // { route, demo, mods: Map }
for (const file of pages) {
  const mods = collectTemplates(file);
  if (mods.size === 0) continue; // V0 / non-template pages
  pageToMods.push({ route: routeFromPageFile(file), demo: isDemoRoute(routeFromPageFile(file)), mods });
}
pageToMods.sort((a, b) => Number(a.demo) - Number(b.demo) || a.route.localeCompare(b.route));

// template -> product routes (blast radius). Demo routes tracked separately.
const tmplToProduct = new Map();
const tmplToDemo = new Map();
for (const { route, demo, mods } of pageToMods) {
  for (const mod of mods.keys()) {
    const target = demo ? tmplToDemo : tmplToProduct;
    if (!target.has(mod)) target.set(mod, new Set());
    target.get(mod).add(route);
  }
}

const shortName = (mod) => mod.replace(SECTIONS_PREFIX, "").replace(/^\d+_[a-z]+\//, "");

if (JSON_OUT) {
  const json = {
    pages: pageToMods.map((p) => ({ route: p.route, demo: p.demo, templates: [...p.mods.keys()].sort() })),
    blastRadius: Object.fromEntries([...tmplToProduct.entries()].map(([m, s]) => [m, [...s].sort()])),
    demoUsage: Object.fromEntries([...tmplToDemo.entries()].map(([m, s]) => [m, [...s].sort()])),
  };
  console.log(JSON.stringify(json, null, 2));
  process.exit(0);
}

const productPages = pageToMods.filter((p) => !p.demo);
const demoPages = pageToMods.filter((p) => p.demo);

console.log("\n=== PRODUCT PAGES → templates ===\n");
for (const { route, mods } of productPages) {
  const sections = [...mods.keys()].filter((m) => m.startsWith(SECTIONS_PREFIX)).map(shortName).sort();
  const other = [...mods.keys()].filter((m) => !m.startsWith(SECTIONS_PREFIX)).sort();
  console.log(`${route}`);
  console.log(`    sections: ${sections.join(", ") || "(none)"}`);
  if (other.length) console.log(`    other:    ${other.join(", ")}`);
}

console.log("\n=== TEMPLATE → product pages (blast radius: who you must re-verify) ===\n");
const sectionTmpls = [...tmplToProduct.keys()].filter((m) => m.startsWith(SECTIONS_PREFIX)).sort();
for (const mod of sectionTmpls) {
  const routes = [...tmplToProduct.get(mod)].sort();
  console.log(`${shortName(mod).padEnd(26)} ${routes.length}  ${routes.join(", ")}`);
}

console.log("\n=== DEMO / DEV ROUTES (also render templates — glance, not a product gate) ===\n");
for (const { route, mods } of demoPages) {
  console.log(`${route}  (${[...mods.keys()].filter((m) => m.startsWith(SECTIONS_PREFIX)).length} section templates)`);
}
console.log("");
