---
name: porting-design-references
description: Use when adapting or porting an external UI reference — a component, section, or motion from 21st.dev, shadcn, Aceternity, Magic UI, Tailwind, Framer Motion, CodePen, a screenshot or a video — into this monorepo's design system (miller-web or transline49). Triggers on "port this", "rebuild this in our style", "make this match our theme", "I found this on <design site>".
---

# Porting Design References

## Overview

An external reference is a **structure-and-motion donor, not a design.** You take its *layout idea* and *interaction*, and rebuild it natively in this repo's warm-clay system. You never keep its stack, its palette, its corners, or its generic identity. A correct port looks hand-built for Miller/TL49; a paste job looks like the site you copied it from — that mismatch is exactly what causes the 10-revision death spiral.

**Read first, every single time** — porting from memory is the #1 failure:
`CLAUDE.md` (repo + app) · the design canon in the website-design skill at `C:\Users\logan\.claude\skills\website-design\references\white-owl-design-system.md` (esp. §13 worked map, §14 TL49 — the old `docs/DESIGN-SYSTEM.md` path is a stub) · `apps/miller-web/app/styles/01-tokens.css` (the real token names) · and skim the two **reference pages** the doc names (Miller home + `/industrial-services/emergency-response`). The port must end up looking like it belongs beside those pages.

## Strip the foreign stack → use this repo's idioms

| Reference uses | This repo uses |
|---|---|
| Tailwind utility classes | plain **global CSS** in `app/styles/*.css`; `mw-*` (Miller) / `tl-*` (shared) class names. **Never add Tailwind/shadcn.** |
| `framer-motion` (`motion.*`, `whileHover`, springs) | **CSS-only** motion. There is **no framer-motion dependency — importing it breaks the build.** Translate to CSS transitions/keyframes. |
| `styled-jsx` (`<style jsx>`), CSS modules, inline `style={}` | one `mw-*`/`tl-*` block added to the correct `app/styles/*.css` partial. |
| raw colors (`zinc-900`, `violet-500`, `#7c3aed`) | **tokens only** — `var(--c-*)`. **Grep `01-tokens.css` to confirm each token exists before using it. Never invent names and never use `var(--x, #hex)` fallbacks** — a fallback means you're guessing. |
| `rounded-xl` / `rounded-full` / pills | **squared** rectangles (radius 0, or the 12px card radius). Pills are off-brand. |
| generic sans / gradient text | `--font-display` (Barlow Condensed, UPPERCASE) for display · `--font-sans` (IBM Plex Sans) body · `--font-mono` eyebrows/labels/numbers. |

## Re-brand, don't recolor

- **Palette is load-bearing — warm clay only.** No blue/teal/violet/slate survives. Token names are historical: `--c-navy` and `--c-blue` are *browns* (trust the hex). Signature accent is `--c-accent` (terracotta).
- **Add the motifs** where they fit: `mw-section-tag` (rotated-diamond eyebrow), `mw-stop` (clay square period on headings), the `→` action arrow, numbered "article" framing, the faint 49° paper-grain wash.
- **Generic copy is not content.** "Ship faster than ever / all-in-one platform for modern teams" must become real Miller/TL49 copy, or be flagged to the user — never shipped as SaaS filler. Copy lives in `lib/content/`, not inline.
- Every animation ships a `prefers-reduced-motion` off-switch; prefer the existing `data-reveal` / `data-reveal-stagger` for entrances rather than inventing keyframes.

## Land it the repo's way

- **miller-web is template-first** (read the template guide in the website-design skill: `C:\Users\logan\.claude\skills\website-design\references\white-owl-templates.md` — the old `components-v2/README.md` path is a stub). Don't drop a one-off component on a page — extend or add a `components-v2` template fed a `content` object, browse `/template-gallery` for an existing fit first, and run `npm run template-map` before editing any shared template. **transline49-web is still bespoke** — mirror the reference pages in its own `tl49-*` layer; do **not** import `@/components-v2` into TL49.
- **Verify before you call it done:** run Playwright and **open the screenshots** (desktop + mobile), and compare against the reference pages. Structural assertions don't prove brand fit — look at the pixels.

## Common mistakes (from real porting failures)

- Kept `framer-motion` / `motion.*` → build breaks. Rebuild the motion in CSS.
- Used `<style jsx>` / inline styles → wrong layer. Add a global `mw-*`/`tl-*` block.
- Guessed token names or used `var(--c-x, #hex)` fallbacks → grep `01-tokens.css` first; use the real names.
- Left rounded corners, pills, or a cool-toned accent/gradient → squared + clay.
- Built a standalone component instead of a template (miller) → compose, don't invent.
- Kept the reference's placeholder copy → replace with real content or flag it.
- Declared done without looking at a rendered screenshot.
