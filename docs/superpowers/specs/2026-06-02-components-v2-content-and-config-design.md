# Design spec — content-agnostic, config-driven v2 templates

- **Date:** 2026-06-02
- **Status:** Approved (design); implementation plan to follow.
- **App:** `apps/miller-web` · route `/template-testing` only.
- **Builds on:** the type-folder refactor (`docs/superpowers/specs/2026-06-02-components-v2-type-folders-refactor-design.md`).

## 1. Goal

Make every `components-v2` **section template** content-agnostic and config-driven, so it is a genuinely reusable template rather than a Miller-home-specific component. Two capabilities:

1. **Content out of the templates.** No human-readable string or content datum is baked into a template's JSX. Each template renders from a `content` prop. The page's config file (`lib/content/template-testing-home.js`) becomes the single content source.
2. **Config-driven presentation.** Each template accepts a `config` prop with presentation knobs — `scheme` (surface tone), `layout` (e.g. reverse columns), per-section palette-token overrides, plus the existing `id`/`reveal`. **With default config, `/template-testing` renders byte-identical to `/` and the existing 5 parity tests still pass.**

## 2. Template signature

```jsx
function SomeSection01({ content, config = {} }) { … }
```

- **`content`** — all text/data/images for the section (shape defined per §6).
- **`config`** — `{ scheme?, layout?, tokens?, id?, reveal? }`, all optional; defaults reproduce the current home page.
- Templates import **zero** specific content — no `HOME`, `SERVICES`, `CERTS`, `brand`. They import only sibling components.

The `MarqueeBand01` widget (the one widget with baked content — the "Proud affiliates" label + the `AFFILIATES` import) also becomes prop-driven: `MarqueeBand01({ label, items })`. All other widgets/blocks already take their content via props and are unchanged.

## 3. Content source

`lib/content/template-testing-home.js` is the single content source. It already holds the copied arrays; it gains one **content object per section** and is the **only** module that imports `HOME` (`@/app/(home)/home`), `SERVICES` (`@/lib/services`), `CERTS` (`@/lib/certs`), and `brand` (`@/lib/content/brand`) — read-only — to assemble those objects. `page.jsx` imports the content objects and passes `content={…} config={…}` to each section.

Exported content objects: `HERO`, `CERTS_BANNER`, `SERVICES_GRID`, `SECTORS`, `FACILITY`, `HISTORY`, `CAREERS`, `AFFILIATES_BANNER`, `FINAL_CTA`. (The existing raw arrays `SECTOR_STATS`, `MILESTONES`, etc. stay, now consumed by these objects.)

## 4. Titles: words in content, motif in template

The clay stop (`mw-stop`), the `…__title-em` emphasis span, `mw-nobr`, and `<br>` are **motif** owned by the template. Content holds only the **words**, in the fields each title needs; the template hardcodes where the motif goes (applying the stop to the designated last word via the existing `StopText01`/`StopPeriod01` items). No motif markup ever appears in the config. Per-title content shapes are in §6.

## 5. Config knobs

| Knob | Type | Applies to | Default (parity) | Mechanism |
|---|---|---|---|---|
| `scheme` | `"dark" \| "cream" \| "warm"` | all sections | each section's current native tone | template emits `data-scheme="…"` **only when non-default**; new CSS maps scheme → surface + on-surface text tokens (existing palette tokens) |
| `layout` | `"reverse"` | split sections only: `media-split` (facility), `hover-card-grid` head (sectors), `multi-column-cta` (final) | natural order | template emits `data-layout="reverse"` only when set; new CSS flips column order **inside the same min-width breakpoint at which that section becomes multi-column** — so stacked/narrow layouts keep natural DOM order |
| `tokens` | `{ "--c-…": string }` | all sections | none | template merges into the section's inline `style` as CSS custom properties (cascade-based override of any palette token); omitted → no `style` attr |
| `id` | string | sections with a labelled heading | the current id (e.g. `mw-hero-title`) | used for `aria-labelledby` + heading `id` |
| `reveal` | bool | where applicable | current value | toggles `data-reveal` (already supported by items) |

**Parity rule:** a template emits `data-scheme` / `data-layout` / inline `style` **only when the corresponding config differs from the default**. With default config the DOM carries no new attributes → byte-identical to `/`. Variant CSS targets only the explicit attribute values, so it can never affect the default render.

**Brand caveat:** `tokens` can override to any value, including off-palette. Staying within the clay family is the caller's responsibility; `scheme` presets are always on-brand.

## 6. Per-section content shapes

Values are taken **verbatim** from the current section JSX / `HOME` / the config arrays — output is unchanged. Shapes:

- **`HERO`** — `mark: { logoSrc, name: "Miller Environmental", corpLong: "Corporation", corpShort: "Corp.", since: "Since 1996" }`, `photoSrc`, `title: { line1: "leaders in", cyclePhrases: [{text},{text,tone:"accent"},…], line3: "waste disposal" }` (template nobr+hero-stops the last word of `line3`), `lead`, `primaryCta: { label: "Talk to Miller", href }`, `ghostPhone: { sup: "24/7 emergency", num, href }`, `article: { strong: "VBEC", rest: " · 64 ha, …" }`, `titleId: "mw-hero-title"`.
- **`CERTS_BANNER`** — `ariaLabel: "Certifications"`, `certs: CERTS`.
- **`SERVICES_GRID`** — `eyebrow: "Services"`, `title: { lead: "whatever your waste needs,", em: "we've got you covered" }`, `intro`, `services: homeServiceOrder()`, `externalTile: { href, photo, titleLines: ["Cross-Border","Services"], summary }`, `headingId: "mw-services-heading"`.
- **`SECTORS`** — `eyebrow: "Who we serve"`, `title: "From refineries to households — and everything between"` (template stops the last word), `lead`, `stats: SECTOR_STATS`, `cards: SECTOR_CARDS`, `headingId: "mw-sectors-heading-copy"`.
- **`FACILITY`** — `eyebrow: "Vaughn Bullough Environmental Centre"`, `title: { top: "VBEC", em: "A facility built for the work" }` (template stops `top` and the last word of `em`), `lead: HOME.vbec.body`, `figures: [{label:"Footprint",num:"64",unit:"hectares"}, {label:"Location",num:"70",unit:"km S of Winnipeg"}, {label:"Operating",num:"1996",unit:"to today"}]`, `capsTitle: "7 powerful capabilities"`, `capabilities: HOME.vbec.capabilities`, `primaryCta: { longLabel: HOME.vbec.cta.label, shortLabel: "Visit Facility", href }`, `aboutLink: { longLabel: HOME.vbec.aboutLinkLabel, shortLabel: "Read the story", href }`, `headingId: "mw-facility-heading-copy"`.
- **`HISTORY`** — `eyebrow: "Our history"`, `title: { lead: "Three decades in", em: "hazardous waste" }`, `lead`, `timelineNote: "*hover for more info"`, `milestones: MILESTONES`, `plate: { imgSrc, stats: [{num:"25",unit:"+yrs",label:"Relationships"}, {num:"96",unit:"%",label:"In-house"}, {num:"4.5",unit:"ML/yr",label:"Solvent reclaimed"}] }`, `mission: { heading: "Mission", paragraphs: [3 strings], cta: HOME.mission.cta }`, `headingId: "mw-tenure-heading-copy-b"`.
- **`CAREERS`** — `bleedPhotoSrc`, `eyebrow: "Careers"`, `title: { lead: "Join the", em: "Miller team" }`, `lead: HOME.joinFamily.intro`, `cards: [{ tag:"Culture", title, text, cta }, { tag:"Hiring now", title, text, cta }]`, `headingId: "mw-careers-bleed-heading"`.
- **`AFFILIATES_BANNER`** — `ariaLabel: "Affiliates"`, `label: "Proud affiliates"`, `items: AFFILIATES`.
- **`FINAL_CTA`** — `truckImgSrc`, `logoImgSrc`, `eyebrow: HOME.finalCta.eyebrow`, `title: HOME.finalCta.title` (template applies `StopText01`, stripping the trailing period as today), `body`, `primaryCta: { label: "Contact Miller", href }`, `ghostPhone: { sup: "24/7 emergency", num, href }`, `socials: SOCIALS`, `headingId: "mw-final-heading"`.

## 7. CSS strategy

- **Content extraction → zero new CSS** (byte-identical; same classes, same DOM).
- **Variants → one new file**, `apps/miller-web/app/template-testing/template-testing.css`, imported by `app/template-testing/page.jsx` (App Router permits route-level global CSS). It contains only `[data-scheme="…"]` and `[data-layout="reverse"]` rules, scoped under the relevant `mw-*` section classes, built from **existing palette tokens**, with reverse rules wrapped in the section's multi-column `@media (min-width: …)` query. Existing `app/styles/*` partials are never touched.
- `tokens` overrides need **no CSS** — they are inline custom properties that re-bind existing token variables for that section's subtree.

## 8. Parity & verification

- Default config: `/template-testing` byte-identical to `/`; existing `tests/template-testing.spec.js` (5 tests) still pass.
- New variant tests (added to the same spec, exercised on `/template-testing` by rendering a section with non-default config in a scratch harness OR by asserting the attribute+computed-style): `data-layout="reverse"` flips column order above the breakpoint and **not** when stacked; `data-scheme="dark"` applies the walnut surface; a `tokens` override changes a CSS variable.
- `git status` shows only `components-v2/**`, the new `template-testing.css`, `page.jsx`, `lib/content/template-testing-home.js`, and the test file changed.

## 9. Scope / phasing (one design, phased build)

- **Phase 1 — content extraction.** Sections become `({ content, config })` reading content only; `MarqueeBand01` gains `label`/`items` props; `template-testing-home.js` gains the 9 content objects; `page.jsx` passes content. **Parity-safe, zero new CSS.** (The bulk of the work and the part that delivers "reusable templates.")
- **Phase 2 — config knobs.** Add `scheme`, `layout`, `tokens` handling to the templates (data-attributes + inline style, emitted only when non-default), the one new `template-testing.css`, and variant tests.

Phase 1 is independently shippable and leaves a working, parity-identical page; Phase 2 layers capability on top.

## 10. Risks

- **A baked string slips through** → not fully content-agnostic. Mitigation: after Phase 1, grep each section file for quoted string literals; only class names, hrefs-as-defaults-removed, and structural text should remain (ideally none but motif/aria wiring).
- **Default config accidentally emits a data-attribute / style** → would risk parity. Mitigation: emit only on non-default; the existing 5 parity tests + a DOM diff guard this.
- **Reverse-without-breakpoint** would reorder stacked content. Mitigation: reverse CSS lives inside the section's multi-column media query (per §5).
- **`tokens` off-palette** → brand drift. Accepted, documented; presets stay on-brand.
- **Title shape mis-modeled** (emphasis/stop in the wrong spot) → visual drift. Mitigation: §6 shapes mirror the current JSX exactly; Phase-1 parity screenshots confirm.
