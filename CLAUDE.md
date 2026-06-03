# Repo guide

Monorepo with two brand sites (`apps/miller-web`, `apps/transline49-web`) sharing one design package (`apps/brand`, imported as `@white-owl/brand`).

## Design system — read before any UI work

**`docs/DESIGN-SYSTEM.md` is the locked design/style baseline for BOTH apps.** There are two finished reference pages: the **Miller home page** (+ header `TopNav` + footer `SiteFooter`) is canonical for the overall language and marketing sections, and the **Miller emergency-response service page** (`/industrial-services/emergency-response`) is canonical for interior & service pages (its `mw-svc-*` sections — alert hero, response timeline, photo-card grid, hover-swap gallery, dark dispatch CTA, related rail — are the worked map in §13). Every page built or converted to the new look must match them. Read that doc before redesigning or building any page, and update it in the same change if you intentionally evolve a pattern.

Non-negotiables (full detail in the doc):

- **Warm clay palette only.** Everything is clay / terracotta / walnut / cream. No blue, teal, or turquoise anywhere. Token *names* are historical — `--c-navy` (`#3B2418`) is deep walnut and `--c-blue` (`#6E3D1A`) is mid clay-brown; trust the hex, not the name. `--c-accent` (`#A85A2C`) is the signature terracotta.
- **Type:** Barlow Condensed (`--font-condensed`/`--font-display`) UPPERCASE for display; IBM Plex Sans (`--font-sans`) for body/leads; IBM Plex Mono (`--font-mono`) for labels, eyebrows, and numbers.
- **Motifs:** the clay square "stamp" period on headings (`mw-stop`), the rotated-diamond eyebrow mark (`mw-section-tag`), the faint 49° paper-grain wash, numbered "article" framing, the `→` action arrow. Squared rectangles, not pills.
- **Namespacing:** `tl-*` = shared brand (both apps); `mw-*` = Miller-only. Put Miller-specific styling under `html[data-brand="miller"]` or in a new `mw-*` class — never on a bare `tl-*` selector in the brand package.
- **Motion:** one scroll-reveal (`data-reveal` / `data-reveal-stagger`); every animation ships a `prefers-reduced-motion` off-switch.
- **A11y:** visible clay focus ring, semantic landmarks, labelled sections, AA-tuned text tokens, live regions for cycling text.

## Page route structure

**miller-web is template-first.** Pages are **composed from the shared `components-v2` template library**, not hand-built section by section. The home page and all 6 redesigned service pages are thin `page.jsx` files that order a few `06_sections` templates and feed each a `content` object from `lib/content/`. The authoritative build guide is **`apps/miller-web/components-v2/README.md` — read it before building or changing any miller page or template.** Browse every template rendered at `/template-gallery`.

```
app/<route>/
  page.jsx              # metadata (+ any hero preload) + thin composition only:
                        #   import templates from @/components-v2/06_sections/…,
                        #   order them in JSX, feed each a `content` object.
```

Rules for miller-web:

- **`page.jsx` orchestrates only** — no section markup inline. Find a `06_sections` template that fits (check `/template-gallery`) before inventing anything.
- **Copy** lives in `lib/content/<page>.js` (service pages) or the home content modules — never duplicated inside `page.jsx`.
- **Do not reintroduce per-route `sections/NN-*.jsx` / `banners/` files or monolithic `*Template.jsx`** for miller pages — the template cutover removed them. Build by composition.
- **Changing a template is a shared, multi-page change.** Prefer adding a **config knob that defaults to current behavior** (existing callers must render byte-identically) over editing default output; add a new `*-02.jsx` template when the DOM structurally diverges; a "hard change" to default output touches every consumer. **Before changing a template, run `npm run template-map`** (in `apps/miller-web`) to see which pages it affects, and Playwright-verify each affected page after. Full protocol in the components-v2 README.

**transline49-web is still bespoke** — it has not adopted the templates yet, and we are **not** refactoring the library into a shared package right now. Build/convert TL49 pages by mirroring the Miller reference pages per `docs/DESIGN-SYSTEM.md` §14 (its own `tl49-*` layer or promoting truly-shared pieces to `tl-*`); do not import `@/components-v2` (miller-namespaced) into TL49. When TL49 adopts the templates we will revisit sharing.

## Verifying UI

Per repo norms: when checking visual work with Playwright, actually run it and **look at the screenshots** (open them) — structural assertions don't prove design quality. Don't claim a UI is correct without seeing it rendered.
