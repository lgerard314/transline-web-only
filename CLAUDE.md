# Repo guide

Monorepo with two brand sites (`apps/miller-web`, `apps/transline49-web`) sharing one design package (`apps/brand`, imported as `@white-owl/brand`).

## Design system — read before any UI work

**`docs/DESIGN-SYSTEM.md` is the locked design/style baseline for BOTH apps.** The Miller home page, header (TopNav), and footer (SiteFooter) are the finished reference; every page built or converted to the new look must match them. Read that doc before redesigning or building any page, and update it in the same change if you intentionally evolve a pattern.

Non-negotiables (full detail in the doc):

- **Warm clay palette only.** Everything is clay / terracotta / walnut / cream. No blue, teal, or turquoise anywhere. Token *names* are historical — `--c-navy` (`#3B2418`) is deep walnut and `--c-blue` (`#6E3D1A`) is mid clay-brown; trust the hex, not the name. `--c-accent` (`#A85A2C`) is the signature terracotta.
- **Type:** Barlow Condensed (`--font-condensed`/`--font-display`) UPPERCASE for display; IBM Plex Sans (`--font-sans`) for body/leads; IBM Plex Mono (`--font-mono`) for labels, eyebrows, and numbers.
- **Motifs:** the clay square "stamp" period on headings (`mw-stop`), the rotated-diamond eyebrow mark (`mw-section-tag`), the faint 49° paper-grain wash, numbered "article" framing, the `→` action arrow. Squared rectangles, not pills.
- **Namespacing:** `tl-*` = shared brand (both apps); `mw-*` = Miller-only. Put Miller-specific styling under `html[data-brand="miller"]` or in a new `mw-*` class — never on a bare `tl-*` selector in the brand package.
- **Motion:** one scroll-reveal (`data-reveal` / `data-reveal-stagger`); every animation ships a `prefers-reduced-motion` off-switch.
- **A11y:** visible clay focus ring, semantic landmarks, labelled sections, AA-tuned text tokens, live regions for cycling text.

## Verifying UI

Per repo norms: when checking visual work with Playwright, actually run it and **look at the screenshots** (open them) — structural assertions don't prove design quality. Don't claim a UI is correct without seeing it rendered.
