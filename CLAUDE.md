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

## Page route structure (both apps)

Every marketing page in `apps/miller-web` and `apps/transline49-web` follows the same App Router layout. Reference implementation: `apps/miller-web/app/industrial-services/emergency-response/`.

```
app/<route>/
  page.jsx              # metadata + thin composition only (imports sections/banners)
  home.js               # optional: route-local copy (strings/arrays). Prefer lib/content/ for shared or large pages.
  sections/
    01-hero.jsx         # numbered in scroll order; export named *Section (e.g. HeroSection)
    02-….jsx
    …
  banners/              # optional: full-width strips that are not “article” sections (certs, logo marquees, trust strips)
    certs.jsx           # export named *Banner (e.g. CertsBanner)
```

Rules:

- **`page.jsx` orchestrates only** — no section markup inline. Order sections and banners explicitly in JSX.
- **One primary section per file** under `sections/`, prefixed `NN-kebab-case.jsx` matching DOM order.
- **Banner strips live in `banners/`**, not mixed into numbered sections (e.g. certification row under hero, affiliate marquee between careers and final CTA).
- **Client-only helpers** (cycles, galleries, timelines) sit beside their section under `sections/` as unnumbered `kebab-case.jsx` files; keep `"use client"` scoped to the smallest file.
- **Copy** lives in `lib/content/<page>.js` (service pages) or route-local `home.js` / equivalent — never duplicated inside section files except trivial constants.
- **Do not add monolithic `*Template.jsx` files** at the route root; split new work into sections (and banners) from the start.

When adding a page to `apps/transline49-web`, mirror this structure even if the page is still a single section — create `sections/01-hero.jsx` (etc.) and a thin `page.jsx`.

## Verifying UI

Per repo norms: when checking visual work with Playwright, actually run it and **look at the screenshots** (open them) — structural assertions don't prove design quality. Don't claim a UI is correct without seeing it rendered.
