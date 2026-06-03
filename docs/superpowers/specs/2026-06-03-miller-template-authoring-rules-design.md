# Miller-web template-authoring rules — design

Date: 2026-06-03. Status: approved, executing.

## Problem

The 7 redesigned miller-web pages (home + 6 service pages) were cut over to compose a shared, config-driven `components-v2` section-template library fed by a `content` object — `page.jsx` is now thin composition only, and the old bespoke per-route `sections/NN-*.jsx` files were deleted. But the agent-facing rules still describe the *pre-template* world, so an agent told to "build a miller page" or "tweak a section" would follow stale guidance and either hand-build a bespoke section or edit a template without realizing other pages share it.

We need the rules to (a) make template composition the default for miller-web, (b) give a clear decision protocol for *changing* a template (new config vs new template vs hard change) with a hard backwards-compatibility gate, and (c) give agents a fast mechanical way to see which pages a template change would affect. TransLine49 will eventually use the same templates but is **not** being refactored into a shared package yet — for now miller-web is template-first and TL49 stays bespoke/mirrors per DESIGN-SYSTEM §14.

## Conflicts found in current agent-facing material

- **Root `CLAUDE.md` → "Page route structure (both apps)"** mandates per-route `sections/NN-*.jsx` + `banners/` and says "Do not add monolithic `*Template.jsx` files." This describes the deleted pre-template structure as the way to build pages.
- **`docs/DESIGN-SYSTEM.md` §6** names retired home components (`HeroPhraseCycle`, `SectorStatCycle` as a one-off, `FacilityGallery`, `HistoryTimeline`) instead of the `components-v2` ladder (`PhraseCycle01`, `StatCycle01`, `ThumbGallery01`, `VerticalTimeline01`, …) and the `/template-gallery` catalog.
- **`docs/DESIGN-SYSTEM.md` §7 / §11** tell agents to "build/convert sections" by hand rather than compose templates first.
- **`docs/DESIGN-SYSTEM.md` §13** documents the emergency-response page as six hand-built `01-hero.jsx`…`06-related.jsx` section files. Those files no longer exist; the page now composes `ServiceHero01`, `ResponseTimeline01`, `PhotoCardGrid01`, `PickerGallery01`, `DispatchCta01`, `RelatedRail01`.
- **Memory `reference_design_system.md`** says "compose the existing interactive components rather than forking them" — true but pre-dates the template library and doesn't point at it.
- **`apps/miller-web/README.md`** says "Phase 01 scaffold — placeholder home page only" (badly stale; low priority).

## Decisions (all delegated to the agent — optimized for agent compliance)

**Placement is layered so the rule is reachable from every path an agent reads:** root `CLAUDE.md` (always in context) is the enforcer + pointer; `apps/miller-web/components-v2/README.md` (next to the code an agent edits) is the authoritative detailed guide; `DESIGN-SYSTEM.md` stays the visual baseline and cross-links; memory points at both.

### 1. Authoritative guide — `apps/miller-web/components-v2/README.md`
- The ladder `01_marks → 02_buttons → 03_cards → 04_blocks → 05_widgets → 06_sections`, and the live visual catalog at `/template-gallery` (+ marks/buttons/cards/blocks/widgets sub-pages).
- **Template-first workflow:** build/redesign a miller page by composing `06_sections` templates in a thin `page.jsx`, fed by a `content` object in `lib/content/<page>.js`. Real metadata + any hero preload stays in `page.jsx`.
- **Change-decision protocol** (when asked to adjust a template):
  - **New config (preferred).** Add a knob that **defaults to current behavior** so every existing caller renders **byte-identically**. Vary by composition (swap a sub-component / add a modifier class), not by forking the whole template inline. `sectionProps(config)` already emits nothing for default config — keep that property.
  - **New template.** When the DOM structurally diverges, add a sibling `*-02.jsx` in the same type-folder; don't bend one template to cover two shapes.
  - **Hard change.** Only when the *default* itself must change. Then every consumer must be updated and verified.
- **Mandatory blast-radius gate.** Before changing a template, run `npm run template-map` to list consumers; after, Playwright-verify each affected page (load it, look at the screenshots) — the same parity discipline used in the cutover. Default-preserving config changes should leave existing pages pixel-identical; confirm that.

### 2. Blast-radius script — `apps/miller-web/scripts/template-map.mjs`, `npm run template-map`
- Walks `app/**/page.jsx`, follows local imports transitively (into `sections/`, `banners/`, and the gallery registries) but stops at the `components-v2` boundary, recording which `06_sections` templates (and other layers) each route uses.
- Prints **both** directions: route → templates, and **template → routes** (the blast radius), separating product pages from demo/dev routes (`/template-gallery*`, `/template-testing*`). `--json` for machine use. Nothing committed, so it can't go stale.

### 3. Change gate — strict
Backwards-compatible config defaults (existing callers byte-identical) + run-the-map + Playwright-verify-affected-pages; hard changes touch and verify all consumers. New template when DOM structurally diverges.

### 4. Edits to existing material
- **Root `CLAUDE.md`:** rewrite "Page route structure" → template-first for miller-web, the safety rule + `npm run template-map`, pointer to the README; state the miller (template) vs TL49 (bespoke-for-now, no shared refactor yet) split.
- **`DESIGN-SYSTEM.md`:** §6 → ladder + gallery; §7/§11 → compose-first; §13 → map each ER pattern to its template and note it's composition now; §14 → reaffirm TL49 mirrors but isn't shared yet. Keep it the *visual* baseline; delegate build mechanics to the README.
- **Memory `reference_design_system.md`:** point at the template library, the gallery, and the README; keep "compose don't fork" (still true, now via templates).
- **`apps/miller-web/README.md`:** replace the stale phase line with the current template-first reality + pointers.

## Out of scope
- Refactoring templates into the shared `@white-owl/brand` package (explicitly deferred).
- Converting the remaining V0 miller pages or any TL49 page (separate future work).
- Changing any template's code or any product page (rules/docs/tooling only).

## Verification
- `npm run template-map` runs and its output matches the known import graph (7 product pages + the variants demo + the gallery).
- Re-read every edited rule file for internal consistency; grep for residual stale guidance; no contradictions remain between CLAUDE.md, DESIGN-SYSTEM.md, the README, and memory.
