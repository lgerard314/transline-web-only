# Miller / White Owl sites — full content & image archive

**Date:** 2026-06-05
**Status:** Approved design, pending spec review

## Goal

Produce a complete, verbatim, locally-archived copy of the content and full-size imagery of five Miller-branded company websites, structured so a human can navigate every page, see exactly what content and which images live on each page, and reuse the raw material for downstream work. This is a read-only archival scrape of live external marketing sites — no modification of the source sites.

## Sites (5 site folders)

The recycling subdomain nests inside Miller Waste (per decision); everything else is its own site folder.

1. `millerwaste/` — https://millerwaste.ca/ (includes `residential-recycling-bins.millerwaste.ca` as a nested subsection)
2. `millerenvironmental/` — https://www.millerenvironmental.ca/
3. `millercompost/` — https://millercompost.ca/
4. `millertransit/` — https://millertransit.ca/
5. `transline49/` — https://transline49.com/

Output root: `C:\Users\logan\Desktop\projects\apps\transline49-web\docs\research\<site>/`

## Engine

A reusable Node + Playwright crawler at `docs/research/_scraper/crawl.mjs`, run once per site (parameterized by start URL + output folder). Playwright is already set up in this repo and is required to get: rendered DOM, lazy-load triggering (scroll to bottom), `srcset`/`currentSrc` resolution to the largest image candidate, and computed/"inspected" HTML equivalent to dev-tools.

### Crawl rules

- **Same-registrable-domain internal links only.** For `millerwaste`, the `residential-recycling-bins.millerwaste.ca` subdomain is treated as in-scope and nested. External/social links (facebook, linkedin, mailto, tel, off-domain) are recorded in content but NOT followed.
- **Full recursive crawl**, breadth-first, deduping by normalized URL (strip fragments, trailing slashes, tracking query params).
- **Hard cap: 300 pages per site.** On hitting the cap, stop discovering new pages and log every un-crawled queued URL to `_crawl-log.json`.
- **Politeness:** small delay (~500–1000ms) between page loads; single browser context; realistic viewport; wait for network idle + lazy-load scroll before capture.
- Capture redirects (record final URL); skip non-HTML responses from the page queue (route them to image/document download instead).

## Per-site output structure

Folder nesting mirrors the URL path. Each page gets its own folder containing two files.

```
docs/research/<site>/
  _sitemap.md            # master sitemap: full page tree + photo→pages map (flags reuse)
  _crawl-log.json        # pages visited, skipped (cap/errors), redirects, external links seen
  photos/                # ALL images for the site, full-size, deduped by content hash
  documents/             # downloaded PDFs / brochures / spec sheets, deduped
  <url-path>/            # one folder per page, mirroring the URL path
    content.md           # annotated verbatim content (see format below)
    inspected.html       # raw rendered ("dev-tools") DOM, full outerHTML after JS + lazy-load
```

The homepage lives at `<site>/index/`. The recycling subdomain lives at `millerwaste/residential-recycling-bins/<url-path>/`.

### `content.md` — annotated Markdown

Verbatim text in document order, each block prefixed with its semantic role/tag so headers, buttons, nav, links, and section boundaries are all legible. Text is captured verbatim (no paraphrasing). Example:

```
[NAV] Home · Services · About · Contact
# [H1] Waste Management That Works
[SECTION: hero]
[P] (verbatim paragraph text)
[BUTTON] Request a Quote → /contact
[IMG] photos/a1b2c3__hero-truck.jpg  (alt: "Miller truck", natural 2400×1600)
## [H2] Our Services
[LINK] Learn more → /services/organics
[FOOTER] © 2026 Miller Waste Systems
```

Tag vocabulary (best-effort, derived from tag name + role/ARIA + heading level): `NAV`, `H1`–`H6`, `P`, `LI`, `BUTTON`, `LINK`, `IMG`, `FOOTER`, `FORM`, `INPUT`, and `[SECTION: <hint>]` markers at `<section>`/`<header>`/`<main>`/`<footer>` boundaries (hint from id/class/aria-label when available). Section type is best-effort and lower priority than getting all text + the header/button/link distinctions right.

### `inspected.html`

The full `document.documentElement.outerHTML` after JS execution and lazy-load — the "inspect element / save inspected code" artifact. One per page.

## Images

- Every `<img>`: resolve to the largest available source via `currentSrc` after layout, then parse `srcset` and pick the highest-resolution descriptor if larger. Also capture detectable CSS `background-image` URLs from computed styles (best-effort).
- Download at full/original size into the single per-site `photos/` pool.
- **Dedup by content hash.** Filename = `<short-contenthash>__<sanitized-original-name>.<ext>`. A reused image is stored once; every page that references it points at the same file.
- `content.md` references the local `photos/...` path plus `alt` text and natural pixel dimensions.

## Documents

Linked PDFs and downloadable documents (`.pdf`, `.doc(x)`, `.xls(x)`, etc.) are downloaded into the per-site `documents/` folder, deduped by content hash, and referenced from both `content.md` and the sitemap.

## `_sitemap.md` (master, per site)

- **Page tree:** every crawled page as a nested list mirroring URL structure, each linking to its `content.md`, with page `<title>` and final URL.
- **Photos table:** `photo file | natural size | used on pages[]` — so reuse across pages is obvious at a glance.
- **Documents table:** `document file | used on pages[]`.
- **Skipped/uncrawled section:** anything dropped by the 300-cap or errored, so nothing is silently missing.

## Execution order

Crawl sites sequentially (or in small parallel batches), one site fully archived before moving on, to keep memory/disk and politeness manageable. After each site: verify by opening 1–2 `inspected.html` / a screenshot and spot-checking `photos/` count + that the largest sizes were captured (not structural assertion only — actually look).

## Verification / done criteria

- Each site folder has `_sitemap.md`, `_crawl-log.json`, `photos/`, and a page folder per crawled URL with both `content.md` and `inspected.html`.
- `_sitemap.md` lists every crawled page and maps every photo to the pages it appears on.
- Spot-checked screenshots/inspected HTML confirm content + image fidelity for at least one page per site.
- Skipped/capped/errored URLs are logged, not silently dropped.

## Caveats (inherent)

- The 300-page cap may clip a large news/blog archive; clipped URLs are logged.
- CSS background images are best-effort (only those resolvable from computed styles).
- Live external sites: crawl is polite/throttled; transient network errors are logged and the page retried once.
- Scope is read-only archival of these specific company sites for the user's own research; no source-site modification.

## Out of scope (YAGNI)

- No re-hosting, no rendering/rebuild of the sites, no diffing against prior snapshots.
- No following external/off-domain links.
- No video/binary-asset download beyond images and documents.
