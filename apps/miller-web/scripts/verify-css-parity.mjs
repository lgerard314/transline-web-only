// Proves the globals.css → app/styles split dropped/added/changed no declaration,
// and that no per-selector value sequence flipped. Tolerates block reordering.
//
//   before = git show HEAD:apps/miller-web/app/globals.css   (the monolith on HEAD)
//   after  = the 9 partials concatenated in barrel/import order
//
// Run from repo root BEFORE committing the move (so HEAD still holds the monolith):
//   node apps/miller-web/scripts/verify-css-parity.mjs
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import postcss from "postcss";

const PARTIALS = [
  "01-tokens", "02-primitives", "03-chrome",
  "home/facility", "home/history", "home/affiliates", "home/final-cta", "home/hero",
  "home/certs", "home/_shared", "home/sectors", "home/careers", "home/facility-pin",
  "home/services", "home/lifetime",
  "05-service-shared", "06-service-remediation",
  "07-service-industrial-cleaning", "08-service-waste-treatment",
  "09-service-project-management",
];

const before = execSync("git show HEAD:apps/miller-web/app/globals.css", { encoding: "utf8" });
const stylesDir = new URL("../app/styles/", import.meta.url);
const after = PARTIALS.map((p) =>
  readFileSync(new URL(`${p}.css`, stylesDir), "utf8")
).join("\n");

// Walk every declaration, keyed by its at-rule ancestry + selector + property.
function declMap(css) {
  const root = postcss.parse(css);
  const seq = new Map(); // "selector||prop" -> [value, value, ...] in source order
  const bag = new Map(); // "selector||prop||value" -> count (multiset)
  root.walkDecls((decl) => {
    const ctx = [];
    let p = decl.parent;
    while (p && p.type !== "root") {
      if (p.type === "atrule") ctx.unshift(`@${p.name} ${p.params}`.replace(/\s+/g, " ").trim());
      else if (p.type === "rule") ctx.unshift(p.selector.replace(/\s+/g, " ").trim());
      p = p.parent;
    }
    const sel = ctx.join(" >> ");
    const prop = decl.prop.toLowerCase();
    const val = decl.value.replace(/\s+/g, " ").trim() + (decl.important ? " !important" : "");
    const seqKey = `${sel}||${prop}`;
    if (!seq.has(seqKey)) seq.set(seqKey, []);
    seq.get(seqKey).push(val);
    const bagKey = `${seqKey}||${val}`;
    bag.set(bagKey, (bag.get(bagKey) || 0) + 1);
  });
  return { seq, bag };
}

const A = declMap(before);
const B = declMap(after);
const errors = [];

// Check 1: declaration multiset equality (no drop / add / mutation).
for (const k of new Set([...A.bag.keys(), ...B.bag.keys()])) {
  const a = A.bag.get(k) || 0;
  const b = B.bag.get(k) || 0;
  if (a !== b) errors.push(`DECL MISMATCH (${a}->${b}): ${k}`);
}

// Check 2: per-selector value sequence equality (no last-wins flip).
for (const k of new Set([...A.seq.keys(), ...B.seq.keys()])) {
  const a = (A.seq.get(k) || []).join(" | ");
  const b = (B.seq.get(k) || []).join(" | ");
  if (a !== b) errors.push(`SEQUENCE FLIP: ${k}\n    before: ${a}\n    after:  ${b}`);
}

if (errors.length) {
  console.error(`x CSS parity FAILED - ${errors.length} issue(s):\n` + errors.join("\n"));
  process.exit(1);
}
console.log("+ CSS parity OK - declaration multiset and per-selector sequences identical.");
