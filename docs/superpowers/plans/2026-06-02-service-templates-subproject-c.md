# Service Template Library — Sub-project C Implementation Plan (industrial-cleaning, industrial-waste-treatment, project-management)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Extend the library to cover the last three service pages and pixel-recreate each on a sandbox route, verified against the real pages — touching no existing page.

**Architecture:** Same as A/B. Reuse ServiceHero01, PhotoCardGrid01, DispatchCta01, RelatedRail01, WhyBand01 where they match; add the per-page unique templates (FleetSplit01, CapabilityGrid01, FacilityShowcase01, NumberedCardGrid01) and extend WhyBand01 with the numbered-card / 3up / centered-head variants.

**Tech Stack:** Next.js 16 RSC, Playwright, dev on 3001. Alias `@/*` → `apps/miller-web/`.

**Reference:** Design spec `docs/superpowers/specs/2026-06-02-service-template-library-design.md`; A+B templates under `components-v2/06_sections/`; A/B parity specs as the verification pattern.

**Hard constraints (same as A/B):** No edits to `app/styles/*`, real pages, `lib/content/service-*.js`, `components/**`, `apps/brand/**`. Reproduce each source section's literal classes. `sectionProps` emits nothing for default. Preserve all `data-reveal`/`aria-*`/`loading`. Server components (wrap client components). No per-template scratch routes/specs — verify at the page-level parity gate. Never hard-wrap. Warm clay only. Extensions to shared templates (WhyBand01, PhotoCardGrid01, ServiceHero01) MUST be additive — REM/ER/CWC parity specs must stay green (re-run them after any shared-template edit).

**Note on `mw-fleet`:** the design doc floated reproducing it as a `MediaSplit01` body-variant, but `mw-fleet` has its own `mw-fleet__*` class namespace (not `mw-fac2`/MediaSplit's classes), so byte-parity requires its own template `FleetSplit01` — same lesson the audit applied elsewhere. Build it as a dedicated template.

**Section → template map:**
| Page | Sections (composition order) | Templates |
|---|---|---|
| industrial-cleaning (6) | hero, capabilities, fleet, why, cta, related | ServiceHero01 (photo-bleed) · PhotoCardGrid01 `{cardStyle:"thumb",head:"split"}` · **FleetSplit01** · WhyBand01 `{marker:"number",columns:4}` · DispatchCta01 · RelatedRail01 |
| industrial-waste-treatment (5) | hero, facility, capabilities, cta, related | ServiceHero01 (photo-bleed) · **FacilityShowcase01** · **CapabilityGrid01** · DispatchCta01 · RelatedRail01 |
| project-management (5) | hero, group, projects, cta, related | ServiceHero01 (photo-bleed) · WhyBand01 `{variant:"mw-why--3up",marker:"number",columns:3}` · **NumberedCardGrid01** · DispatchCta01 · RelatedRail01 |

---

## Task C1: WhyBand01 — numbered-card / 3up / centered-head variants

**Files:** Modify `apps/miller-web/components-v2/06_sections/grids/why-band-01.jsx`. Sources: `…/industrial-cleaning/sections/04-why.jsx` (4 numbered cards, dark, header eyebrow+h2, label--invert, NO stat cycle) and `…/project-management/sections/02-group.jsx` (`mw-why--3up`, 3 numbered cards, CENTERED head with eyebrow+h2+lead, label--invert).

- [ ] **Step 1:** Read both sources + the current `why-band-01.jsx`. Note: IC `mw-why` head is left-aligned (eyebrow+h2, no lead in head); PM `mw-why--3up` head is centered with a lead; both cards have `mw-why__num` (the marker) + `mw-why__name` + `mw-why__body`; both use `mw-section-tag-label--invert`. REM (already built) has the stat-cycle intro and NO `__num`.
- [ ] **Step 2:** Extend `WhyBand01` additively: `marker:"number"` renders `mw-why__num` (from `item.mark`/`item.num` — confirm key); `statCycle:false` (default) renders a plain header instead of the intro split; add a head-layout knob if IC (left) vs PM (centered `--3up`) differ structurally (`headAlign` or rely on the `variant` class + CSS). `variant` appends `mw-why--3up`. `columns` is informational. Reproduce each source's head + card markup exactly per its branch. Do NOT alter the REM (statCycle:true, marker:"none") path.
- [ ] **Step 3:** Self-review: IC config `{marker:"number", columns:4}` ⇒ byte-identical to `04-why.jsx`; PM config `{variant:"mw-why--3up", marker:"number", columns:3}` ⇒ byte-identical to `02-group.jsx`; REM config `{statCycle:true, variant:"mw-why--rem"}` ⇒ UNCHANGED.
- [ ] **Step 4:** Commit: `git add apps/miller-web/components-v2/06_sections/grids/why-band-01.jsx && git commit -m "feat(miller-web): WhyBand01 numbered/3up variants (IC why, PM group)"`
- [ ] **Step 5:** Regression-check: `npx playwright test tests/template-testing-environmental-remediation-services.spec.js --reporter=line` → REM still passes.

---

## Task C2: FleetSplit01 (mw-fleet)

**Files:** Create `apps/miller-web/components-v2/06_sections/splits/fleet-split-01.jsx`. Source: `…/industrial-cleaning/sections/03-fleet.jsx`.

- [ ] **Step 1:** Read `03-fleet.jsx`. Section `mw-fleet` (dark); 2-col split (`mw-fleet__inner`): left `mw-fleet__text` (eyebrow + h2 + lead + `<ul className="mw-fleet__list">` of 2 numbered items: `mw-fleet__item` → `mw-fleet__num` + `mw-fleet__item-body`(`__item-name` + `__item-text`)); right `mw-fleet__media` (silhouette PNG, bleeds). Note `mw-section-tag-label--invert`, data-reveal placement.
- [ ] **Step 2:** Build `FleetSplit01({ content, config })` reproducing `mw-fleet` verbatim. Map content: eyebrow, title, lead, items[] {num, name, text}, mediaPhoto. `sectionProps` default-empty.
- [ ] **Step 3:** Self-review byte-identity vs `03-fleet.jsx`.
- [ ] **Step 4:** Commit: `git add apps/miller-web/components-v2/06_sections/splits/fleet-split-01.jsx && git commit -m "feat(miller-web): FleetSplit01 template (mw-fleet, IC)"`

---

## Task C3: CapabilityGrid01 (mw-cap)

**Files:** Create `apps/miller-web/components-v2/06_sections/grids/capability-grid-01.jsx`. Source: `…/industrial-waste-treatment/sections/03-capabilities.jsx`.

- [ ] **Step 1:** Read `03-capabilities.jsx`. Section `mw-cap`; header (`mw-cap__head` / `__head-left` / `__lead`); then a full-width feature card `<article className="mw-cap-card mw-cap-card--feature">` (2-col: photo + body+list); then `<div className="mw-cap__grid">` of standard `mw-cap-card` articles (photo-topped, `mw-cap-card__media` + `__body`: `__name` + `__text` + `mw-cap-card__list` (bullets, some `--cols`)). Content from `IWT.capabilities.groups` (index 0 = feature, 1..6 = grid). Note data-reveal.
- [ ] **Step 2:** Build `CapabilityGrid01({ content, config })` reproducing `mw-cap` verbatim: header + feature card (groups[0]) + grid (groups[1..]). Reuse `03_cards/feature/*` if the existing feature card matches; otherwise emit the `mw-cap-card` markup directly (it's a distinct class set — likely emit directly). Map content: eyebrow, title, lead, groups[] {name, text, list[], photo, listCols?}. `sectionProps` default-empty.
- [ ] **Step 3:** Self-review byte-identity vs `03-capabilities.jsx` (feature card + grid cards + bullet lists + `--cols`).
- [ ] **Step 4:** Commit: `git add apps/miller-web/components-v2/06_sections/grids/capability-grid-01.jsx && git commit -m "feat(miller-web): CapabilityGrid01 template (mw-cap, IWT)"`

---

## Task C4: FacilityShowcase01 (mw-vbec)

**Files:** Create `apps/miller-web/components-v2/06_sections/grids/facility-showcase-01.jsx`. Source: `…/industrial-waste-treatment/sections/02-facility.jsx`.

- [ ] **Step 1:** Read `02-facility.jsx`. Section `mw-vbec` (dark); `mw-vbec__top` (2-col text+figure: `mw-vbec__text` eyebrow+h2+lead, `mw-vbec__media` photo + `mw-vbec__cap`); then `<ul className="mw-vbec__stats">` 4-up (`mw-vbec__stat`: `__stat-val` + `__stat-unit` + `__stat-label`); then `mw-vbec__proc` (`__proc-eyebrow` + `<ul className="mw-vbec__proc-list">` of `mw-vbec__proc-chip` with `__proc-mark`). Note `mw-section-tag-label--invert`, data-reveal.
- [ ] **Step 2:** Build `FacilityShowcase01({ content, config })` reproducing `mw-vbec` verbatim. Map content: eyebrow, title, lead, photo, caption, stats[] {val, unit, label}, procEyebrow, processes[] {name}. `sectionProps` default-empty.
- [ ] **Step 3:** Self-review byte-identity vs `02-facility.jsx`.
- [ ] **Step 4:** Commit: `git add apps/miller-web/components-v2/06_sections/grids/facility-showcase-01.jsx && git commit -m "feat(miller-web): FacilityShowcase01 template (mw-vbec, IWT)"`

---

## Task C5: NumberedCardGrid01 (mw-pm)

**Files:** Create `apps/miller-web/components-v2/06_sections/grids/numbered-card-grid-01.jsx`. Source: `…/project-management/sections/03-projects.jsx`.

- [ ] **Step 1:** Read `03-projects.jsx`. Section `mw-pm` (light); header 2-col (`mw-pm__head`/`__head-left` eyebrow+h2, `__lead` right); then `<ol className="mw-pm__grid">` of 6 `<li className="mw-pm__card">` (`mw-pm__num` + `mw-pm__name` + `mw-pm__body`). Note `<ol>` (ordered), data-reveal.
- [ ] **Step 2:** Build `NumberedCardGrid01({ content, config })` reproducing `mw-pm` verbatim (note the `<ol>`). Map content: eyebrow, title, lead, items[] {num, name, body}. `sectionProps` default-empty.
- [ ] **Step 3:** Self-review byte-identity vs `03-projects.jsx`.
- [ ] **Step 4:** Commit: `git add apps/miller-web/components-v2/06_sections/grids/numbered-card-grid-01.jsx && git commit -m "feat(miller-web): NumberedCardGrid01 template (mw-pm, PM)"`

---

## Task C6: industrial-cleaning sandbox page + parity

**Files:** Create `app/template-testing/industrial-cleaning/page.jsx` + `content.js`; `tests/template-testing-industrial-cleaning.spec.js`. Reference real `…/industrial-cleaning/page.jsx` + `lib/content/service-industrial-cleaning.js` (`industrialCleaning`).

- [ ] **Step 1:** Read real page (order: hero, capabilities, fleet, why, cta, related; metadata) + each section for exact literals (titleIds, hero ghostPhone/reveal, the fleet silhouette PNG, hotlineNote, head media).
- [ ] **Step 2:** Build `content.js` adapter (preserve strings/ids verbatim, `// RECONCILE-IN-D:` for literals; phone cross-ref from hero for the dispatch CTA). NOTE: IC capabilities is PhotoCardGrid `{cardStyle:"thumb", head:"split"}` — verify this combo reproduces `02-capabilities.jsx` (thumb cards + split head, `mw-svc-inds--photo`); if the head:"split"+thumb path needs a tweak in PhotoCardGrid01, make it additively and re-run ER/CWC/REM specs.
- [ ] **Step 3:** Build `page.jsx`: `<ServiceHero01 config={{alert:true,photoHalf:true,ghostPhone:<per source>,reveal:<per source>}}/>`, `<PhotoCardGrid01 config={{cardStyle:"thumb",head:"split"}}/>`, `<FleetSplit01/>`, `<WhyBand01 config={{marker:"number",columns:4}}/>`, `<DispatchCta01/>`, `<RelatedRail01/>`. noindex metadata.
- [ ] **Step 4:** Write parity spec (mirror REM's: section/order, reveal-attr, no-stray, section box parity, mobile + desktop-body byte parity; mask `.mw-lyt`/`.mw-rel__track` only if IC actually has those embeds — IC has no video, so likely only `.mw-rel__track` for the related carousel; include the mask defensively).
- [ ] **Step 5:** Run it; if a visual test fails, capture + LOOK + localize + fix until the template DOM is byte-identical (distinguish real defects from masked-embed/nav-chrome artifacts). Commit page+adapter then spec.

---

## Task C7: industrial-waste-treatment sandbox page + parity

**Files:** `app/template-testing/industrial-waste-treatment/{page.jsx,content.js}`; `tests/template-testing-industrial-waste-treatment.spec.js`. Reference real page + `lib/content/service-industrial-waste-treatment.js` (`IWT`).

- [ ] **Step 1:** Read real page (order: hero, facility, capabilities, cta, related) + sections for literals.
- [ ] **Step 2:** Adapter (verbatim strings/ids, RECONCILE-IN-D, phone cross-ref for CTA). FacilityShowcase content (stats/processes), CapabilityGrid content (groups[0]=feature).
- [ ] **Step 3:** `page.jsx`: `<ServiceHero01 config={{alert:true,photoHalf:true,...}}/>`, `<FacilityShowcase01/>`, `<CapabilityGrid01/>`, `<DispatchCta01/>`, `<RelatedRail01/>`. noindex metadata.
- [ ] **Step 4:** Parity spec (mirror; mask `.mw-rel__track`; sections selectors `.mw-svc-hero,.mw-vbec,.mw-cap,.mw-svc-cta,.mw-svc-related-sec`).
- [ ] **Step 5:** Run, LOOK, fix, commit.

---

## Task C8: project-management sandbox page + parity

**Files:** `app/template-testing/project-management/{page.jsx,content.js}`; `tests/template-testing-project-management.spec.js`. Reference real page + `lib/content/service-project-management.js` (`projectManagement`).

- [ ] **Step 1:** Read real page (order: hero, group, projects, cta, related) + sections for literals.
- [ ] **Step 2:** Adapter (verbatim, RECONCILE-IN-D, phone cross-ref for CTA).
- [ ] **Step 3:** `page.jsx`: `<ServiceHero01 config={{alert:true,photoHalf:true,...}}/>`, `<WhyBand01 config={{variant:"mw-why--3up",marker:"number",columns:3}}/>`, `<NumberedCardGrid01/>`, `<DispatchCta01/>`, `<RelatedRail01/>`. noindex metadata.
- [ ] **Step 4:** Parity spec (mirror; mask `.mw-rel__track`; sections `.mw-svc-hero,.mw-why,.mw-pm,.mw-svc-cta,.mw-svc-related-sec`).
- [ ] **Step 5:** Run, LOOK, fix, commit.

---

## Final (Sub-project C)
- [ ] Run ALL `tests/template-testing*` specs → all pass (A+B+C; the WhyBand01/PhotoCardGrid01 extensions must not regress ER/CWC/REM).
- [ ] Confirm `git diff` shows no protected-path edits.
- [ ] Final Opus review across the C diff.
- [ ] STOP and report: all 6 service pages + home recreated and verified on sandbox routes. Await explicit approval before Sub-project D (the destructive cutover into real routes + home promotion).
