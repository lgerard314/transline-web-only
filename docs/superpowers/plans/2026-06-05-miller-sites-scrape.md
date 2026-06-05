# Miller / White Owl Sites — Content & Image Archive — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crawl five Miller-branded company websites and produce a complete local archive — per-page annotated verbatim content, raw rendered ("inspected") HTML, full-size deduped images, downloaded PDFs/docs, and a per-site master sitemap that maps every photo to the pages it appears on.

**Architecture:** A single reusable Node + Playwright crawler module driven by a parallel runner. Each site renders in its own browser context; **image/media/font bytes are blocked during page render for speed**, the DOM + all `srcset` candidates are extracted, the *largest* image URL is chosen by us, and assets are then downloaded out-of-band via Playwright's `APIRequestContext` with concurrency. The five sites (different registrable domains) run **simultaneously** — per-domain politeness is preserved because each site is its own crawl, so cross-domain parallelism is free speed. Within a site, pages are crawled with a small worker pool.

**Tech Stack:** Node 24 (ESM), Playwright 1.60 (already installed at repo root), Chromium. No test framework — verification is (a) fast self-tests on pure helper functions via a plain `node selftest.mjs`, and (b) running the real crawl and visually inspecting output per repo norms.

**On TDD:** Per user instruction (overrides the writing-plans TDD default via superpowers instruction-priority), we do NOT TDD the crawl itself — scraping live external sites is inherently integration/IO work and flaky to unit-test. We DO keep cheap deterministic self-tests for the two pure functions where bugs genuinely hide (URL normalization, srcset→largest picker). Everything else is build → run → look.

---

## File Structure

```
docs/research/_scraper/
  package.json          # local ESM package, type:module, depends on repo-root playwright
  lib/
    urls.mjs            # normalizeUrl, isInScope, urlToFolderPath  (pure)
    images.mjs          # parseSrcset, pickLargest  (pure)
    annotate.mjs        # in-browser DOM → annotated-markdown serializer (string of fn for evaluate)
    assets.mjs          # downloadAsset: hash, dedup, write to photos/ or documents/
    sitemap.mjs         # writeSitemap, writeCrawlLog
  crawl.mjs             # crawlSite(config): BFS crawler for one site
  run-all.mjs           # launches all 5 site crawls in parallel; holds SITE CONFIGS
  selftest.mjs          # node selftest.mjs — asserts pure helpers (urls.mjs, images.mjs)
```

Output (created by the crawl, not committed by these tasks): `docs/research/<site>/...` per the spec.

---

## Task 1: Scaffold the scraper package

**Files:**
- Create: `docs/research/_scraper/package.json`
- Create: `docs/research/_scraper/.gitignore`

- [ ] **Step 1: Create the package manifest**

`docs/research/_scraper/package.json`:
```json
{
  "name": "miller-sites-scraper",
  "private": true,
  "type": "module",
  "version": "1.0.0",
  "description": "One-off Playwright crawler that archives Miller/White Owl marketing sites.",
  "scripts": {
    "selftest": "node selftest.mjs",
    "crawl": "node run-all.mjs"
  }
}
```

- [ ] **Step 2: Ignore crawl output, keep code**

`docs/research/_scraper/.gitignore`:
```
node_modules/
```

- [ ] **Step 3: Verify Playwright + Chromium resolve from this folder**

Run (PowerShell, from repo root):
```
node -e "const{chromium}=require('playwright');console.log('playwright ok')"
```
Expected: `playwright ok`. If Chromium is missing, run `npx playwright install chromium` once.

- [ ] **Step 4: Commit**
```
git add docs/research/_scraper/package.json docs/research/_scraper/.gitignore
git commit -m "chore(scraper): scaffold miller-sites scraper package"
```

---

## Task 2: URL utilities (pure) + self-test

**Files:**
- Create: `docs/research/_scraper/lib/urls.mjs`
- Create: `docs/research/_scraper/selftest.mjs`

- [ ] **Step 1: Write the self-test FIRST (it will fail to import)**

`docs/research/_scraper/selftest.mjs`:
```js
import assert from 'node:assert/strict';
import { normalizeUrl, isInScope, urlToFolderPath } from './lib/urls.mjs';

// normalizeUrl: strip fragment, trailing slash, tracking params; lowercase host
assert.equal(normalizeUrl('https://millerwaste.ca/Services/?utm_source=x#top'), 'https://millerwaste.ca/Services');
assert.equal(normalizeUrl('https://MillerWaste.ca'), 'https://millerwaste.ca');
assert.equal(normalizeUrl('https://millerwaste.ca/a/b/'), 'https://millerwaste.ca/a/b');

// isInScope: same registrable domain, allow listed subdomains, reject off-domain + mailto/tel
const allowed = ['millerwaste.ca', 'residential-recycling-bins.millerwaste.ca'];
assert.equal(isInScope('https://millerwaste.ca/x', allowed), true);
assert.equal(isInScope('https://residential-recycling-bins.millerwaste.ca/y', allowed), true);
assert.equal(isInScope('https://facebook.com/millerwaste', allowed), false);
assert.equal(isInScope('mailto:info@millerwaste.ca', allowed), false);
assert.equal(isInScope('tel:+19055551234', allowed), false);

// urlToFolderPath: homepage -> index; nested path mirrored; subdomain prefixed
assert.equal(urlToFolderPath('https://millerwaste.ca/', 'millerwaste.ca', ['millerwaste.ca']), 'index');
assert.equal(urlToFolderPath('https://millerwaste.ca/services/organics', 'millerwaste.ca', ['millerwaste.ca']), 'services/organics');
assert.equal(urlToFolderPath('https://residential-recycling-bins.millerwaste.ca/bins', 'millerwaste.ca', ['millerwaste.ca']), 'residential-recycling-bins/bins');

console.log('urls.mjs selftest OK');
```

- [ ] **Step 2: Run it, verify it fails (module missing)**

Run: `cd docs/research/_scraper && node selftest.mjs`
Expected: FAIL — `Cannot find module './lib/urls.mjs'`.

- [ ] **Step 3: Implement urls.mjs**

`docs/research/_scraper/lib/urls.mjs`:
```js
const TRACKING_PREFIXES = ['utm_', 'fbclid', 'gclid', 'mc_', '_ga'];

export function normalizeUrl(raw) {
  const u = new URL(raw);
  u.hash = '';
  u.hostname = u.hostname.toLowerCase();
  for (const key of [...u.searchParams.keys()]) {
    if (TRACKING_PREFIXES.some((p) => key.toLowerCase().startsWith(p))) u.searchParams.delete(key);
  }
  let s = u.toString();
  // drop trailing slash on path (but keep root "/" -> origin)
  s = s.replace(/\/(\?|$)/, '$1');
  if (s.endsWith('/')) s = s.slice(0, -1);
  return s;
}

export function isInScope(raw, allowedHosts) {
  let u;
  try { u = new URL(raw); } catch { return false; }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
  return allowedHosts.includes(u.hostname.toLowerCase());
}

// primaryHost = the site's root host (e.g. millerwaste.ca). Subdomains in allowedHosts
// that differ from primaryHost get a leading folder segment of the subdomain label.
export function urlToFolderPath(raw, primaryHost, allowedHosts) {
  const u = new URL(raw);
  const host = u.hostname.toLowerCase();
  let path = u.pathname.replace(/^\/+|\/+$/g, '');
  let prefix = '';
  if (host !== primaryHost && host.endsWith('.' + primaryHost)) {
    prefix = host.slice(0, -('.' + primaryHost).length); // e.g. residential-recycling-bins
  }
  const segs = [prefix, ...path.split('/')].filter(Boolean).map(sanitizeSeg);
  if (segs.length === 0) return 'index';
  return segs.join('/');
}

function sanitizeSeg(s) {
  return decodeURIComponent(s).replace(/[<>:"/\\|?*]/g, '-').slice(0, 80) || 'index';
}
```

- [ ] **Step 4: Run the self-test, verify it passes**

Run: `cd docs/research/_scraper && node selftest.mjs`
Expected: `urls.mjs selftest OK`.

- [ ] **Step 5: Commit**
```
git add docs/research/_scraper/lib/urls.mjs docs/research/_scraper/selftest.mjs
git commit -m "feat(scraper): URL normalize/scope/path helpers + selftest"
```

---

## Task 3: Image source helpers (pure) — srcset → largest

**Files:**
- Create: `docs/research/_scraper/lib/images.mjs`
- Modify: `docs/research/_scraper/selftest.mjs` (append assertions)

- [ ] **Step 1: Append failing assertions to selftest.mjs**

Add ABOVE the final `console.log('urls.mjs selftest OK')` line a new import at top and a block at bottom. At top of file add:
```js
import { parseSrcset, pickLargest } from './lib/images.mjs';
```
At the bottom (before nothing — append after the urls log):
```js
// parseSrcset: returns candidates with width/density descriptors
assert.deepEqual(
  parseSrcset('a-300.jpg 300w, a-800.jpg 800w, a-1600.jpg 1600w'),
  [
    { url: 'a-300.jpg', w: 300, d: 1 },
    { url: 'a-800.jpg', w: 800, d: 1 },
    { url: 'a-1600.jpg', w: 1600, d: 1 },
  ],
);
// pickLargest: prefers highest width; falls back to density; falls back to src
assert.equal(pickLargest('a-300.jpg 1x, a-600.jpg 2x', 'a.jpg'), 'a-600.jpg');
assert.equal(pickLargest('a-300.jpg 300w, a-1600.jpg 1600w', 'a.jpg'), 'a-1600.jpg');
assert.equal(pickLargest('', 'only.jpg'), 'only.jpg');
console.log('images.mjs selftest OK');
```

- [ ] **Step 2: Run, verify it fails (images.mjs missing)**

Run: `cd docs/research/_scraper && node selftest.mjs`
Expected: FAIL — `Cannot find module './lib/images.mjs'`.

- [ ] **Step 3: Implement images.mjs**

`docs/research/_scraper/lib/images.mjs`:
```js
// Parse an HTML srcset attribute into candidates. Width descriptor "800w" -> w:800,
// density descriptor "2x" -> d:2. Missing descriptor defaults to d:1.
export function parseSrcset(srcset) {
  if (!srcset || !srcset.trim()) return [];
  return srcset.split(',').map((part) => {
    const [url, desc] = part.trim().split(/\s+/, 2);
    const out = { url, w: 0, d: 1 };
    if (desc && desc.endsWith('w')) out.w = parseInt(desc, 10) || 0;
    else if (desc && desc.endsWith('x')) out.d = parseFloat(desc) || 1;
    return out;
  }).filter((c) => c.url);
}

// Choose the largest candidate URL. Width wins over density; if neither srcset
// candidate beats it, fall back to the element's src/currentSrc.
export function pickLargest(srcset, fallbackSrc) {
  const cands = parseSrcset(srcset);
  if (cands.length === 0) return fallbackSrc;
  const byWidth = cands.filter((c) => c.w > 0).sort((a, b) => b.w - a.w);
  if (byWidth.length) return byWidth[0].url;
  const byDensity = cands.slice().sort((a, b) => b.d - a.d);
  return byDensity[0].url || fallbackSrc;
}
```

- [ ] **Step 4: Run, verify both selftests pass**

Run: `cd docs/research/_scraper && node selftest.mjs`
Expected: `urls.mjs selftest OK` then `images.mjs selftest OK`.

- [ ] **Step 5: Commit**
```
git add docs/research/_scraper/lib/images.mjs docs/research/_scraper/selftest.mjs
git commit -m "feat(scraper): srcset parser + largest-image picker + selftest"
```

---

## Task 4: Asset downloader (hash + dedup + save)

**Files:**
- Create: `docs/research/_scraper/lib/assets.mjs`

- [ ] **Step 1: Implement assets.mjs**

`docs/research/_scraper/lib/assets.mjs`:
```js
import { createHash } from 'node:crypto';
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const IMG_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif', '.bmp', '.ico'];
const DOC_EXT = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv', '.txt'];

export function classifyAsset(url) {
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  if (IMG_EXT.includes(ext)) return { kind: 'image', ext };
  if (DOC_EXT.includes(ext)) return { kind: 'document', ext };
  return { kind: 'image', ext: ext || '' }; // unknown image-ish (CDN without ext) -> treat as image, sniff later
}

function sanitizeName(url) {
  const base = path.basename(new URL(url).pathname) || 'asset';
  return base.replace(/[<>:"/\\|?*]/g, '-').slice(0, 60);
}

// Downloads `url` via the shared Playwright APIRequestContext `req`.
// Dedups by content hash across the whole site (cache Map keyed by url).
// Returns { localPath, kind } relative to siteDir, or null on failure.
export async function downloadAsset(req, url, siteDir, cache) {
  if (cache.has(url)) return cache.get(url);
  let result = null;
  try {
    const resp = await req.get(url, { timeout: 30000 });
    if (!resp.ok()) throw new Error('HTTP ' + resp.status());
    const buf = await resp.body();
    const ctype = (resp.headers()['content-type'] || '').toLowerCase();
    const { kind, ext } = resolveKind(url, ctype);
    const hash = createHash('sha1').update(buf).digest('hex').slice(0, 12);
    const folder = kind === 'document' ? 'documents' : 'photos';
    const fileName = `${hash}__${ensureExt(sanitizeName(url), ext)}`;
    const absDir = path.join(siteDir, folder);
    const absPath = path.join(absDir, fileName);
    const rel = `${folder}/${fileName}`;
    if (!(await exists(absPath))) {
      await mkdir(absDir, { recursive: true });
      await writeFile(absPath, buf);
    }
    result = { localPath: rel, kind, bytes: buf.length };
  } catch (e) {
    result = null;
    // caller logs the failure with the url
  }
  cache.set(url, result);
  return result;
}

function resolveKind(url, ctype) {
  const base = classifyAsset(url);
  if (ctype.includes('pdf')) return { kind: 'document', ext: '.pdf' };
  if (ctype.startsWith('image/')) {
    const ext = '.' + ctype.split('/')[1].split(';')[0].replace('jpeg', 'jpg').replace('svg+xml', 'svg');
    return { kind: 'image', ext: base.ext || ext };
  }
  return base;
}

function ensureExt(name, ext) {
  if (ext && !name.toLowerCase().endsWith(ext)) return name + ext;
  return name;
}

async function exists(p) { try { await access(p); return true; } catch { return false; } }
```

- [ ] **Step 2: Smoke-check it imports cleanly**

Run: `cd docs/research/_scraper && node -e "import('./lib/assets.mjs').then(m=>console.log(Object.keys(m)))"`
Expected: prints `[ 'classifyAsset', 'downloadAsset' ]`.

- [ ] **Step 3: Commit**
```
git add docs/research/_scraper/lib/assets.mjs
git commit -m "feat(scraper): hashing/dedup asset downloader (photos + documents)"
```

---

## Task 5: In-browser content annotator

**Files:**
- Create: `docs/research/_scraper/lib/annotate.mjs`

This exports a function that is **serialized and run inside the page** via `page.evaluate`. It walks the DOM in document order and returns an ordered array of blocks `{type, tag, text, href, src, srcset, alt, w, h, section}`. The crawler turns that array into `content.md`.

- [ ] **Step 1: Implement annotate.mjs**

`docs/research/_scraper/lib/annotate.mjs`:
```js
// Returns the function SOURCE to pass to page.evaluate. Kept as a factory so the
// browser context gets a self-contained function with no Node closures.
export function extractBlocksFn() {
  return () => {
    const blocks = [];
    const SECTION_TAGS = new Set(['SECTION', 'HEADER', 'FOOTER', 'MAIN', 'ASIDE', 'NAV']);
    function sectionHint(el) {
      const id = el.id ? '#' + el.id : '';
      const cls = (el.className && typeof el.className === 'string') ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
      const label = el.getAttribute('aria-label') || '';
      return [el.tagName.toLowerCase(), id, cls, label].filter(Boolean).join(' ').trim();
    }
    function visible(el) {
      const s = window.getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return false;
      return true;
    }
    let sectionStack = [];
    function walk(node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node;
        const tag = el.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'TEMPLATE') return;
        if (!visible(el)) return;
        if (SECTION_TAGS.has(tag)) {
          blocks.push({ type: 'section', tag: tag.toLowerCase(), section: sectionHint(el) });
        }
        if (/^H[1-6]$/.test(tag)) {
          blocks.push({ type: 'heading', tag, level: +tag[1], text: el.innerText.trim() });
          return;
        }
        if (tag === 'IMG') {
          const r = el.getBoundingClientRect();
          blocks.push({ type: 'img', tag: 'IMG', src: el.currentSrc || el.src || el.getAttribute('data-src') || '',
            srcset: el.getAttribute('srcset') || el.getAttribute('data-srcset') || '',
            alt: el.getAttribute('alt') || '', w: el.naturalWidth || Math.round(r.width), h: el.naturalHeight || Math.round(r.height) });
          return;
        }
        if (tag === 'A') {
          const txt = el.innerText.trim();
          if (txt) blocks.push({ type: 'link', tag: 'A', text: txt, href: el.href || '' });
          // still walk children for nested imgs
        }
        if (tag === 'BUTTON' || (tag === 'INPUT' && (el.type === 'button' || el.type === 'submit'))) {
          blocks.push({ type: 'button', tag, text: (el.innerText || el.value || '').trim() });
          return;
        }
        // background-image capture (best effort)
        const bg = window.getComputedStyle(el).backgroundImage;
        if (bg && bg.startsWith('url(')) {
          const m = bg.match(/url\(["']?(.*?)["']?\)/);
          if (m && m[1] && !m[1].startsWith('data:')) blocks.push({ type: 'bgimg', tag: tag.toLowerCase(), src: m[1] });
        }
        if (tag === 'P' || tag === 'LI' || tag === 'BLOCKQUOTE' || tag === 'FIGCAPTION' || tag === 'TD' || tag === 'TH') {
          const txt = el.innerText.trim();
          // only push if this element has no block-level element children carrying the same text
          const hasBlockChild = [...el.children].some((c) => /^(P|LI|UL|OL|DIV|SECTION|H[1-6]|TABLE)$/.test(c.tagName));
          if (txt && !hasBlockChild) { blocks.push({ type: 'text', tag, text: txt }); return; }
        }
        for (const child of el.childNodes) walk(child);
      }
    }
    walk(document.body);
    return { title: document.title, blocks };
  };
}

// Render the extracted blocks to annotated Markdown. `resolveImg(src,srcset)` returns
// the local photos/ path (or original url if not downloaded).
export function blocksToMarkdown(pageUrl, data, imgIndex) {
  const lines = [`<!-- ${pageUrl} -->`, `# [TITLE] ${data.title}`, ''];
  for (const b of data.blocks) {
    if (b.type === 'section') lines.push('', `[SECTION: ${b.section}]`);
    else if (b.type === 'heading') lines.push(`${'#'.repeat(b.level)} [${b.tag}] ${b.text}`);
    else if (b.type === 'text') lines.push(`[${b.tag === 'LI' ? 'LI' : 'P'}] ${b.text}`);
    else if (b.type === 'link') lines.push(`[LINK] ${b.text} → ${b.href}`);
    else if (b.type === 'button') lines.push(`[BUTTON] ${b.text}`);
    else if (b.type === 'img') {
      const local = imgIndex.get(b.__key) || b.src;
      lines.push(`[IMG] ${local}  (alt: "${b.alt}", natural ${b.w}×${b.h})`);
    } else if (b.type === 'bgimg') {
      const local = imgIndex.get(b.__key) || b.src;
      lines.push(`[BG-IMG] ${local}`);
    }
  }
  return lines.join('\n') + '\n';
}
```

- [ ] **Step 2: Smoke-check import**

Run: `cd docs/research/_scraper && node -e "import('./lib/annotate.mjs').then(m=>console.log(Object.keys(m)))"`
Expected: prints `[ 'extractBlocksFn', 'blocksToMarkdown' ]`.

- [ ] **Step 3: Commit**
```
git add docs/research/_scraper/lib/annotate.mjs
git commit -m "feat(scraper): in-browser DOM block extractor + markdown serializer"
```

---

## Task 6: Sitemap + crawl-log writers

**Files:**
- Create: `docs/research/_scraper/lib/sitemap.mjs`

- [ ] **Step 1: Implement sitemap.mjs**

`docs/research/_scraper/lib/sitemap.mjs`:
```js
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

// pages: [{ url, folderPath, title }]
// photoUsage: Map(localPath -> { bytes, w, h, pages:Set(folderPath) })
// docUsage:   Map(localPath -> Set(folderPath))
export async function writeSitemap(siteDir, siteName, pages, photoUsage, docUsage, skipped) {
  const lines = [`# ${siteName} — Site Map`, '', `Crawled ${pages.length} pages.`, '', '## Pages', ''];
  const sorted = [...pages].sort((a, b) => a.folderPath.localeCompare(b.folderPath));
  for (const p of sorted) {
    const depth = p.folderPath === 'index' ? 0 : p.folderPath.split('/').length - 1;
    lines.push(`${'  '.repeat(depth)}- [${p.title || p.folderPath}](${p.folderPath}/content.md) — ${p.url}`);
  }
  lines.push('', '## Photos (file → pages using it)', '', '| photo | natural size | bytes | used on pages |', '|---|---|---|---|');
  for (const [local, info] of [...photoUsage.entries()].sort()) {
    const usedOn = [...info.pages].sort().join(', ');
    lines.push(`| ${local} | ${info.w || '?'}×${info.h || '?'} | ${info.bytes ?? '?'} | ${usedOn} |`);
  }
  if (docUsage.size) {
    lines.push('', '## Documents (file → pages using it)', '', '| document | used on pages |', '|---|---|');
    for (const [local, pagesSet] of [...docUsage.entries()].sort()) {
      lines.push(`| ${local} | ${[...pagesSet].sort().join(', ')} |`);
    }
  }
  if (skipped.length) {
    lines.push('', '## Skipped / uncrawled (cap or error)', '');
    for (const s of skipped) lines.push(`- ${s.url} — ${s.reason}`);
  }
  await writeFile(path.join(siteDir, '_sitemap.md'), lines.join('\n') + '\n', 'utf8');
}

export async function writeCrawlLog(siteDir, log) {
  await writeFile(path.join(siteDir, '_crawl-log.json'), JSON.stringify(log, null, 2), 'utf8');
}
```

- [ ] **Step 2: Smoke-check import**

Run: `cd docs/research/_scraper && node -e "import('./lib/sitemap.mjs').then(m=>console.log(Object.keys(m)))"`
Expected: prints `[ 'writeSitemap', 'writeCrawlLog' ]`.

- [ ] **Step 3: Commit**
```
git add docs/research/_scraper/lib/sitemap.mjs
git commit -m "feat(scraper): sitemap + crawl-log writers"
```

---

## Task 7: Core single-site crawler

**Files:**
- Create: `docs/research/_scraper/crawl.mjs`

The heart of the system: BFS over one site with a small page-worker pool, image bytes blocked during render, lazy-load scroll, capture `content.md` + `inspected.html` per page, download chosen full-size images + documents out-of-band, track photo→page usage, enforce the 300 cap.

- [ ] **Step 1: Implement crawl.mjs**

`docs/research/_scraper/crawl.mjs`:
```js
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { normalizeUrl, isInScope, urlToFolderPath } from './lib/urls.mjs';
import { pickLargest } from './lib/images.mjs';
import { downloadAsset } from './lib/assets.mjs';
import { extractBlocksFn, blocksToMarkdown } from './lib/annotate.mjs';
import { writeSitemap, writeCrawlLog } from './lib/sitemap.mjs';

const MAX_PAGES = 300;
const PAGE_CONCURRENCY = 3;
const DELAY_MS = 600;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function crawlSite(config) {
  const { name, startUrl, primaryHost, allowedHosts, outRoot } = config;
  const siteDir = path.join(outRoot, name);
  await mkdir(siteDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 2200 },
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (research archival crawler; contact lgerard@gosolto.com)',
  });
  // Speed: block heavy bytes during render. We read srcset/currentSrc from DOM and
  // download chosen assets out-of-band via the API request context.
  await context.route('**/*', (route) => {
    const t = route.request().resourceType();
    if (t === 'image' || t === 'media' || t === 'font') return route.abort();
    return route.continue();
  });
  const req = context.request;

  const queue = [normalizeUrl(startUrl)];
  const seen = new Set(queue);
  const pages = [];
  const skipped = [];
  const externalLinks = new Set();
  const assetCache = new Map();           // url -> {localPath,kind,bytes} | null
  const photoUsage = new Map();           // localPath -> {bytes,w,h,pages:Set}
  const docUsage = new Map();             // localPath -> Set(pages)
  const log = { site: name, startUrl, started: new Date().toISOString(), errors: [] };

  async function processOne(url) {
    const folderPath = urlToFolderPath(url, primaryHost, allowedHosts);
    const pageDir = path.join(siteDir, folderPath);
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      // trigger lazy content
      await autoScroll(page);
      await page.waitForTimeout(500);

      const finalUrl = normalizeUrl(page.url());
      const data = await page.evaluate(extractBlocksFn());
      const inspected = await page.content();

      // collect links for the frontier
      const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.href));
      for (const h of hrefs) {
        if (isInScope(h, allowedHosts)) {
          const n = normalizeUrl(h);
          if (!seen.has(n)) {
            if (seen.size >= MAX_PAGES) { skipped.push({ url: n, reason: 'cap(300) reached' }); }
            else { seen.add(n); queue.push(n); }
          }
        } else if (/^https?:/.test(h)) {
          externalLinks.add(h);
        }
      }

      // download images + bg images + documents referenced by this page
      const imgIndex = new Map();
      let k = 0;
      for (const b of data.blocks) {
        if (b.type === 'img' || b.type === 'bgimg') {
          const chosen = b.type === 'img' ? pickLargest(b.srcset, b.src) : b.src;
          if (!chosen || chosen.startsWith('data:')) continue;
          const abs = absolutize(chosen, finalUrl);
          if (!abs) continue;
          const asset = await downloadAsset(req, abs, siteDir, assetCache);
          b.__key = 'k' + k++;
          if (asset) {
            imgIndex.set(b.__key, asset.localPath);
            const rec = photoUsage.get(asset.localPath) || { bytes: asset.bytes, w: b.w, h: b.h, pages: new Set() };
            rec.pages.add(folderPath);
            if ((b.w || 0) > (rec.w || 0)) { rec.w = b.w; rec.h = b.h; }
            photoUsage.set(asset.localPath, rec);
          } else {
            log.errors.push({ url: abs, on: folderPath, reason: 'asset download failed' });
          }
        }
      }
      // documents linked via <a>
      for (const h of hrefs) {
        if (!isInScope(h, allowedHosts)) continue;
        if (/\.(pdf|docx?|xlsx?|pptx?|csv|txt)(\?|$)/i.test(h)) {
          const asset = await downloadAsset(req, h, siteDir, assetCache);
          if (asset && asset.kind === 'document') {
            const set = docUsage.get(asset.localPath) || new Set();
            set.add(folderPath); docUsage.set(asset.localPath, set);
          }
        }
      }

      const md = blocksToMarkdown(finalUrl, data, imgIndex);
      await mkdir(pageDir, { recursive: true });
      await writeFile(path.join(pageDir, 'content.md'), md, 'utf8');
      await writeFile(path.join(pageDir, 'inspected.html'), inspected, 'utf8');
      pages.push({ url: finalUrl, folderPath, title: data.title });
      process.stdout.write(`[${name}] (${pages.length}) ${folderPath}\n`);
    } catch (e) {
      skipped.push({ url, reason: 'error: ' + e.message });
      log.errors.push({ url, reason: e.message });
    } finally {
      await page.close();
    }
  }

  // worker pool draining the queue
  async function worker() {
    while (queue.length) {
      if (pages.length >= MAX_PAGES) break;
      const url = queue.shift();
      if (url === undefined) { await sleep(DELAY_MS); continue; }
      await processOne(url);
      await sleep(DELAY_MS);
    }
  }
  await Promise.all(Array.from({ length: PAGE_CONCURRENCY }, () => worker()));

  // drain any remaining queued URLs into skipped (cap case)
  for (const u of queue) skipped.push({ url: u, reason: 'cap(300) — not crawled' });

  log.finished = new Date().toISOString();
  log.pagesCrawled = pages.length;
  log.skipped = skipped;
  log.externalLinks = [...externalLinks].sort();

  await writeSitemap(siteDir, name, pages, photoUsage, docUsage, skipped);
  await writeCrawlLog(siteDir, log);
  await browser.close();
  return { name, pages: pages.length, photos: photoUsage.size, docs: docUsage.size, skipped: skipped.length };
}

function absolutize(src, base) { try { return new URL(src, base).toString(); } catch { return null; } }

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0; const step = 800;
      const timer = setInterval(() => {
        window.scrollBy(0, step); total += step;
        if (total >= document.body.scrollHeight + 2000) { clearInterval(timer); window.scrollTo(0, 0); resolve(); }
      }, 100);
    });
  });
}
```

- [ ] **Step 2: Smoke-check import (no crawl yet)**

Run: `cd docs/research/_scraper && node -e "import('./crawl.mjs').then(m=>console.log(typeof m.crawlSite))"`
Expected: prints `function`.

- [ ] **Step 3: Commit**
```
git add docs/research/_scraper/crawl.mjs
git commit -m "feat(scraper): single-site BFS crawler (blocked-bytes render, out-of-band asset DL, 300 cap)"
```

---

## Task 8: Parallel runner + site configs

**Files:**
- Create: `docs/research/_scraper/run-all.mjs`

- [ ] **Step 1: Implement run-all.mjs**

`docs/research/_scraper/run-all.mjs`:
```js
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { crawlSite } from './crawl.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_ROOT = path.resolve(__dirname, '..'); // docs/research

const SITES = [
  { name: 'millerwaste', startUrl: 'https://millerwaste.ca/', primaryHost: 'millerwaste.ca',
    allowedHosts: ['millerwaste.ca', 'www.millerwaste.ca', 'residential-recycling-bins.millerwaste.ca'] },
  { name: 'millerenvironmental', startUrl: 'https://www.millerenvironmental.ca/', primaryHost: 'millerenvironmental.ca',
    allowedHosts: ['millerenvironmental.ca', 'www.millerenvironmental.ca'] },
  { name: 'millercompost', startUrl: 'https://millercompost.ca/', primaryHost: 'millercompost.ca',
    allowedHosts: ['millercompost.ca', 'www.millercompost.ca'] },
  { name: 'millertransit', startUrl: 'https://millertransit.ca/', primaryHost: 'millertransit.ca',
    allowedHosts: ['millertransit.ca', 'www.millertransit.ca'] },
  { name: 'transline49', startUrl: 'https://transline49.com/', primaryHost: 'transline49.com',
    allowedHosts: ['transline49.com', 'www.transline49.com'] },
];

// Allow running a subset: `node run-all.mjs millercompost transline49`
const only = process.argv.slice(2);
const targets = only.length ? SITES.filter((s) => only.includes(s.name)) : SITES;

const results = await Promise.allSettled(
  targets.map((s) => crawlSite({ ...s, outRoot: OUT_ROOT })),
);

console.log('\n=== CRAWL SUMMARY ===');
for (let i = 0; i < targets.length; i++) {
  const r = results[i];
  if (r.status === 'fulfilled') console.log(`${targets[i].name}: ${JSON.stringify(r.value)}`);
  else console.log(`${targets[i].name}: FAILED — ${r.reason?.message || r.reason}`);
}
```

Note: `primaryHost` is normalized to the bare apex for folder pathing, but `www.` is included in `allowedHosts` so the crawler treats `www` as in-scope. `urlToFolderPath` keys off the apex `primaryHost`; a `www.` host equals neither apex nor a `.apex` subdomain, so adjust `urls.mjs` `urlToFolderPath` to strip a leading `www.` before comparing. Make that one-line fix now:

In `lib/urls.mjs`, inside `urlToFolderPath`, change the host line to:
```js
const host = u.hostname.toLowerCase().replace(/^www\./, '');
const primary = primaryHost.replace(/^www\./, '');
```
and use `primary` in the `host !== primary && host.endsWith('.' + primary)` check. Re-run `node selftest.mjs` (Task 2 assertions still pass — they use apex hosts).

- [ ] **Step 2: Apply the www fix and re-run selftest**

Run: `cd docs/research/_scraper && node selftest.mjs`
Expected: both `urls.mjs selftest OK` and `images.mjs selftest OK`.

- [ ] **Step 3: Commit**
```
git add docs/research/_scraper/run-all.mjs docs/research/_scraper/lib/urls.mjs
git commit -m "feat(scraper): parallel 5-site runner + www-host normalization"
```

---

## Task 9: Single-site dry run (smallest site) + verify by looking

**Files:** none (produces output under `docs/research/transline49/`)

- [ ] **Step 1: Crawl one small site first**

Run: `cd docs/research/_scraper && node run-all.mjs transline49`
Expected: streaming `[transline49] (n) <path>` lines, then a summary line with non-zero `pages` and `photos`.

- [ ] **Step 2: Inspect the output structure**

Run: `cd docs/research && find transline49 -maxdepth 2 -type f | head -40` (or PowerShell `Get-ChildItem -Recurse transline49 | Select-Object FullName -First 40`)
Expected: `_sitemap.md`, `_crawl-log.json`, `photos/` with files, page folders each containing `content.md` + `inspected.html`.

- [ ] **Step 3: Actually LOOK (per repo norms — do not skip)**

- Open `docs/research/transline49/_sitemap.md` and read the page tree + photos table; confirm photo→page mapping is populated and reuse is visible.
- Open 2 `content.md` files; confirm verbatim text + `[H1]/[BUTTON]/[LINK]/[IMG]` annotations are present and sensible.
- Open 2–3 files in `docs/research/transline49/photos/` and confirm they are real, full-size images (check pixel dimensions are the large variant, not thumbnails).
- Open one `inspected.html` and confirm it is the rendered DOM.

If any check fails (e.g. thumbnails instead of full-size, empty content), fix the relevant lib (`images.mjs` picker or `crawl.mjs` asset resolution) and re-run this single site before proceeding.

- [ ] **Step 4: Commit the verified first-site output**
```
git add docs/research/transline49
git commit -m "data(research): transline49 site archive (content + full-size photos + sitemap)"
```

---

## Task 10: Full parallel run (all 5 sites simultaneously) + verify

**Files:** none (produces `docs/research/<site>/` for all five)

- [ ] **Step 1: Run all sites in parallel**

Run: `cd docs/research/_scraper && node run-all.mjs`
Expected: interleaved `[site] (n) path` progress from all five; final `=== CRAWL SUMMARY ===` with a line per site. Note any `FAILED` site.

- [ ] **Step 2: Re-run any failed/short site individually**

If a site failed or returned suspiciously few pages, re-run just it: `node run-all.mjs <name>` and diagnose (timeout, anti-bot, www redirect). Adjust `allowedHosts`/timeouts as needed.

- [ ] **Step 3: Verify each site by looking (per repo norms)**

For EACH of the 5 site folders: open `_sitemap.md`, spot-open one `content.md`, and open 1–2 `photos/` images to confirm full-size capture. Confirm `_crawl-log.json` `skipped`/`errors` are reasonable (cap hits logged, not silent).

- [ ] **Step 4: Commit the full archive**
```
git add docs/research/millerwaste docs/research/millerenvironmental docs/research/millercompost docs/research/millertransit docs/research/transline49
git commit -m "data(research): full Miller/White Owl sites archive — content, full-size photos, docs, per-site sitemaps"
```

---

## Self-Review (completed by plan author)

**Spec coverage:** ✅ 5 site folders + nested recycling subdomain (Task 8 configs + Task 2 path logic); annotated Markdown per page (Task 5); raw inspected HTML per page (Task 7); one photos pool per site, deduped, full-size via srcset-largest (Tasks 3,4,7); documents folder (Tasks 4,7); per-site `_sitemap.md` with photo→page map + skipped section (Task 6); `_crawl-log.json` (Task 6); 300-cap with logging (Task 7); same-domain-only, external links recorded not followed (Task 7); parallel sites (Task 8/10); polite throttle + blocked-bytes render optimization (Task 7); verify-by-looking (Tasks 9,10).

**Placeholder scan:** No TBD/TODO; every code step has full code; commands have expected output.

**Type consistency:** `crawlSite(config)` signature, `downloadAsset(req,url,siteDir,cache)`, `extractBlocksFn()`/`blocksToMarkdown(url,data,imgIndex)`, `writeSitemap(siteDir,name,pages,photoUsage,docUsage,skipped)`, `urlToFolderPath(raw,primaryHost,allowedHosts)` are used identically everywhere defined/called. `photoUsage` value shape `{bytes,w,h,pages:Set}` consistent between Task 7 (writer) and Task 6 (reader).

**Note on TDD:** Pure helpers (urls, images) are test-first per the cheap-and-valuable carve-out; IO/crawl tasks are build→run→look per user instruction overriding the skill default.
