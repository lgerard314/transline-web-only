# components-v2 — the miller-web template library

**Read this before building or changing any miller-web page or template.** This is the authoritative build guide; root `CLAUDE.md` points here and `docs/DESIGN-SYSTEM.md` is the visual baseline it implements. The warm-clay non-negotiables in those docs still apply to everything here.

miller-web pages are **composed from this shared, config-driven template library** — they are not hand-built section-by-section anymore. The home page and all 6 redesigned service pages are thin `page.jsx` files that order a handful of `06_sections` templates and feed each a `content` object. TransLine49 will eventually use these same templates, but it is **not** refactored into a shared package yet — for now this library is miller-only.

## The ladder

Components are layered; higher layers compose lower ones. You almost always build pages from `06_sections`; the lower layers exist for building/extending templates.

```
01_marks     eyebrow, stop-period, stop-text, action-arrow, nobr, num-token
02_buttons   solid-cta, ghost-phone-cta
03_cards     feature/industry/note/download/icon-link cards (grid cells)
04_blocks    figure/plate/cap stats, milestone item, head-intro, mission block
05_widgets   phrase-cycle, stat-cycle, thumb-gallery, hover-card, vertical-timeline, marquee  (interactive, "use client")
06_sections  heroes · banners · grids · splits · callouts · flows · pickers · rails · statements · …  ← compose pages from these
```

The lists above drift as templates are added — the live sources of truth are the folders themselves, the `/template-gallery` catalog, and `npm run template-map`. Don't trust a hardcoded list over those.

## See every template rendered: `/template-gallery`

The live catalog. `/template-gallery` shows all `06_sections` templates at true site width with placeholder content and **interactive config toggles**; the sub-pages `/template-gallery/{marks,buttons,cards,blocks,widgets}` show the lower layers. Each entry shows the component name and its file path on hover. **Open the gallery first** to find a template that fits before inventing anything. (The gallery, `/template-testing-variants`, and `/home-lab` are noindex dev tools, not product pages.)

**Home section iteration:** `/home-lab` renders each live home section in isolation with production content — use it when editing pinned scroll sections. Home CSS is split per section under `app/styles/home/` (see `app/styles/home/README.md`).

## Building or redesigning a miller page (the default workflow)

1. `page.jsx` is **thin composition only**: metadata, any hero `<link rel="preload">`, and the section templates ordered in JSX. No section markup inline, no per-route `sections/`/`banners/` files. (The old bespoke per-route structure was removed in the template cutover — don't reintroduce it for miller pages.)
2. Copy lives in `lib/content/<page>.js` (service pages) or the home content modules; each template gets a `content` object shaped to its props.
3. Every section template takes `({ content, config = {} })`. Pick templates from `06_sections`, feed content, set `config` knobs as needed.
4. Reuse the shared interactive components by going **through** the templates that wrap them (`ResponseTimeline`, `CoverageGallery`, `RelatedServices`, `ContactForm`, `LiteYouTube`, …) — don't fork them.
5. Verify in a browser with Playwright and **look at the screenshots** (desktop + mobile) before calling it done.

## Config conventions

- `section-config.js` `sectionProps(config)` emits DOM **only for non-default values** — `data-scheme` when `config.scheme` is set, inline `style` when `config.tokens` is non-empty, and nothing otherwise. **Preserve this byte-parity property:** default `config` must leave the DOM identical.
- Two variant mechanisms, per source: **home** templates rebind palette tokens via `config.scheme` / `config.tokens` (the dark/cream/reverse CSS lives in `app/template-testing/template-testing.css`); **service** templates encode variants as literal BEM modifier classes selected by config (e.g. `ServiceHero01`'s `media`/`alert`/`photoHalf`, `DispatchCta01`'s `reverse`). When you extend a template, reproduce **its own** mechanism.
- Config drives variation by **composition** — swap a sub-component or toggle a modifier class — not by forking the whole template inline.

## Changing a template — decide which kind of change, then protect the other pages

A template is shared. Before touching one, decide:

- **New config (preferred).** Add a knob that **defaults to current behavior**, so every existing caller renders **byte-identically**. Vary by composition (select a different sub-component / add a modifier class), and keep `sectionProps` emitting nothing for default config. This is how most "make the template do X too" requests should be handled.
- **New template.** When the DOM structurally diverges from what the template produces, add a sibling `*-02.jsx` in the same type-folder instead of bending one template to cover two shapes.
- **Hard change.** Only when the *default* output itself must change. This affects every consumer — treat it as a multi-page change.

### Mandatory blast-radius gate

Templates are shared across pages, so **a change to one can silently break others.** Before and after any template change:

1. **Run `npm run template-map`** to list which pages use the template (the "TEMPLATE → product pages" section is the blast radius). Add `-- --json` for machine-readable output.
2. **Playwright-verify every affected page** — load it, look at the screenshots, desktop + mobile. A default-preserving config addition should leave existing pages **pixel-identical**; confirm that. A hard change must be re-verified on **every** page in the blast radius.
3. If you added a config knob, add it to the `/template-gallery` registry so the catalog stays complete.

> The library was cut over to byte-identical parity with the original hand-built pages. Keep that bar: the safe default is "existing pages don't change."

## Pointers

- Visual baseline (palette, type, motifs, section rhythm, interior rules): `docs/DESIGN-SYSTEM.md`.
- Always-loaded non-negotiables + the page-route rule: root `CLAUDE.md`.
- Blast-radius map: `npm run template-map`.
