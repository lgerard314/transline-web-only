# Service Template Library — Sub-project B Implementation Plan (environmental-remediation)

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Extend the shared template library to cover the environmental-remediation-services page (9 sections) and pixel-recreate it on a sandbox route, verified against the real page — touching no existing page.

**Architecture:** Same approach proven in Sub-project A. Reuse the existing templates where the section matches (PickerGallery01, ProcessFlow01, DispatchCta01, RelatedRail01, PhotoCardGrid01); add what REM needs that A didn't: a `video` media variant on ServiceHero01, two new PhotoCardGrid card sub-components (hover-swap + link), WhyBand01, and VideoPicker01.

**Tech Stack:** Next.js 16 RSC, React 19, Turbopack dev on 3001, Playwright. Alias `@/*` → `apps/miller-web/`.

**Reference:** Design spec `docs/superpowers/specs/2026-06-02-service-template-library-design.md`; Sub-project A plan + its templates under `apps/miller-web/components-v2/06_sections/`. The REM real page is `app/industrial-services/environmental-remediation-services/` (9 sections, composition order: hero, what-we-do, industries, process, videos, case-studies, why-choose, cta, related).

**Hard constraints (same as A):** No edits to `app/styles/*`, real pages, `lib/content/service-*.js`, `components/**`, `apps/brand/**`. Reproduce each source section's literal classes/mechanism. `sectionProps` emits nothing for default. Preserve all `data-reveal`/`aria-*`/`loading`/`prefers-reduced-motion`. Server components only (wrap client components, don't add `"use client"`). Never hard-wrap. Warm clay only. No per-template scratch routes/specs — verification is the page-level parity gate (Task B7). Banner already inherited via the Task 0 nav prefix.

**REM section → template map:**
| # | Source section | Template | New? |
|---|---|---|---|
| 1 | 01-hero.jsx (media = LiteYouTube figure) | ServiceHero01 `media:"video"` | extend |
| 2 | 02-what-we-do.jsx (`mw-svc-inds--gallery mw-rem-wwd`, `mw-wwd-card` hover) | PhotoCardGrid01 + WwdCard01 | new card |
| 3 | 03-industries.jsx (`mw-svc-cov mw-svc-cov--serve`) | PickerGallery01 `serve:true` | reuse |
| 4 | 04-process.jsx (`mw-flow mw-flow--wide`) | ProcessFlow01 `wide:true` | reuse |
| 5 | 05-videos.jsx (`mw-rem-vid`, FilmGallery) | VideoPicker01 | new |
| 6 | 06-case-studies.jsx (`mw-svc-inds--gallery mw-rem-case`, `mw-case-card` link) | PhotoCardGrid01 + CaseCard01 | new card |
| 7 | 07-why-choose.jsx (`mw-why mw-why--rem`, WhyChooseStatCycle) | WhyBand01 | new |
| 8 | 08-cta.jsx (`mw-svc-cta--dark`) | DispatchCta01 | reuse |
| 9 | 09-related.jsx | RelatedRail01 | reuse |

---

## Task B1: ServiceHero01 — `media:"video"` variant

**Files:** Modify `apps/miller-web/components-v2/06_sections/heroes/service-hero-01.jsx`. Source: `app/industrial-services/environmental-remediation-services/sections/01-hero.jsx` + `components/LiteYouTube.jsx`.

- [ ] **Step 1:** Read REM `01-hero.jsx`. Note the media column is a `<figure className="mw-svc-hero__media">` containing `mw-svc-hero__videoframe` + `<LiteYouTube …>` (`mw-svc-hero__video`) + a `<figcaption className="mw-svc-hero__cap">` (with `mw-svc-hero__cap-mark`). Confirm `LiteYouTube`'s exact props. Note REM hero is NOT `--alert`/`--photo-50` and check its CTA set (it has dual CTAs — confirm whether a ghost-phone is present).
- [ ] **Step 2:** Extend `ServiceHero01`'s media slot: when `config.media === "video"`, render the `mw-svc-hero__media` figure (LiteYouTube + caption) sourced from `content` (e.g. `content.video = { id/url, caption }`). The existing `photo-bleed`/`transparent-png` branches are unchanged. Keep the factored-mediaSlot structure. Add a doc note.
- [ ] **Step 3:** Self-review: `<ServiceHero01 content={REM.hero(+video)} config={{ media:"video" }}>` must emit byte-identical DOM to REM `01-hero.jsx` (figure/videoframe/video/figcaption classes, the dual CTAs, eyebrow/title/lead, any `data-reveal`). The A configs (ER/CWC) must still emit identically — re-confirm the photo-bleed branch is untouched.
- [ ] **Step 4:** Commit: `git add apps/miller-web/components-v2/06_sections/heroes/service-hero-01.jsx && git commit -m "feat(miller-web): ServiceHero01 video-media variant (REM hero)"`

---

## Task B2: PhotoCardGrid01 extra-modifier + WwdCard01 (hover-swap)

**Files:** Create `apps/miller-web/components-v2/03_cards/ind/wwd-card-01.jsx`; modify `apps/miller-web/components-v2/06_sections/grids/photo-card-grid-01.jsx`. Source: `…/environmental-remediation-services/sections/02-what-we-do.jsx`.

- [ ] **Step 1:** Read `02-what-we-do.jsx`. Section is `mw-svc-inds mw-svc-inds--gallery mw-rem-wwd`; cards are `<li className="mw-wwd-card" tabIndex={0}>` with `mw-wwd-card__photo` + `mw-wwd-card__overlay` (name + blurb + detail — three copy fields, CSS hover-swap, no JS). Head is the plain split. Note `data-reveal` placement.
- [ ] **Step 2:** Build `WwdCard01({ item })` reproducing the `mw-wwd-card` `<li>` verbatim (incl. `tabIndex={0}`, the overlay, the three fields name/blurb/detail). Use the exact content keys REM's content uses.
- [ ] **Step 3:** Extend `PhotoCardGrid01`: (a) add `"wwd"` to the CARD map → `WwdCard01`; (b) add a config knob for the extra section modifier class (e.g. `variant` → appends `mw-rem-wwd`), so the section root can be `mw-svc-inds mw-svc-inds--gallery mw-rem-wwd`. Keep existing behavior unchanged for A's configs.
- [ ] **Step 4:** Self-review: `config={{ cardStyle:"wwd", head:"split", variant:"mw-rem-wwd" }}` (or equivalent) emits byte-identical DOM to `02-what-we-do.jsx`; A's ER/CWC PhotoCardGrid configs still byte-identical.
- [ ] **Step 5:** Commit: `git add apps/miller-web/components-v2/06_sections/grids/photo-card-grid-01.jsx apps/miller-web/components-v2/03_cards/ind/wwd-card-01.jsx && git commit -m "feat(miller-web): PhotoCardGrid01 wwd hover-card variant (REM what-we-do)"`

---

## Task B3: CaseCard01 (link card)

**Files:** Create `apps/miller-web/components-v2/03_cards/ind/case-card-01.jsx`; modify `photo-card-grid-01.jsx`. Source: `…/environmental-remediation-services/sections/06-case-studies.jsx`.

- [ ] **Step 1:** Read `06-case-studies.jsx`. Section `mw-svc-inds mw-svc-inds--gallery mw-rem-case`; cards are `<li>` containing `<Link className="mw-case-card__link">` wrapping `mw-ind-card mw-case-card` markup with `mw-ind-card__media` + `mw-ind-card__body` (`mw-case-card__loc` + `mw-ind-card__name` + `mw-case-card__desc` + `mw-case-card__cta` with `mw-case-card__arrow`). Note head (split) + `data-reveal`.
- [ ] **Step 2:** Build `CaseCard01({ item })` reproducing the linked-card `<li>` verbatim (the `<Link>` wrapper, loc/name/desc/cta/arrow). Content keys: href, title, location, photo, desc (use REM's exact keys).
- [ ] **Step 3:** Extend `PhotoCardGrid01`: add `"case"` to the CARD map → `CaseCard01`; support the `mw-rem-case` extra modifier via the same `variant` knob from B2.
- [ ] **Step 4:** Self-review byte-identity vs `06-case-studies.jsx`; A + B2 configs still identical.
- [ ] **Step 5:** Commit: `git add apps/miller-web/components-v2/06_sections/grids/photo-card-grid-01.jsx apps/miller-web/components-v2/03_cards/ind/case-card-01.jsx && git commit -m "feat(miller-web): PhotoCardGrid01 case link-card variant (REM case-studies)"`

---

## Task B4: WhyBand01

**Files:** Create `apps/miller-web/components-v2/06_sections/grids/why-band-01.jsx`. Source: `…/environmental-remediation-services/sections/07-why-choose.jsx` + `components/WhyChooseStatCycle.jsx`.

- [ ] **Step 1:** Read `07-why-choose.jsx`. Section `mw-why mw-why--rem`; an intro row (`mw-why__intro`): copy left (`mw-why__copy`: eyebrow + h2 + lead) + `mw-why__highlight` containing `<WhyChooseStatCycle …>` (the cycling stat); then `<ul className="mw-why__grid">` of 4 `mw-why__card` (name + body, no images, no `__num` here). Confirm `WhyChooseStatCycle`'s props.
- [ ] **Step 2:** Build `WhyBand01({ content, config })`: config `{ statCycle = false, columns, marker, variant }`. For REM: `statCycle:true` (renders the intro split with `WhyChooseStatCycle` in `mw-why__highlight`), `variant:"mw-why--rem"`, 4-card grid, `marker:"none"`. Reproduce the `mw-why` markup verbatim. `sectionProps` emits nothing default. (IC/PM variants — numbered cards, no stat cycle, `--3up` — are added in Sub-project C; build the knobs but only the REM path is exercised here.)
- [ ] **Step 3:** Self-review byte-identity vs `07-why-choose.jsx`.
- [ ] **Step 4:** Commit: `git add apps/miller-web/components-v2/06_sections/grids/why-band-01.jsx && git commit -m "feat(miller-web): WhyBand01 template (mw-why, REM stat-cycle variant)"`

---

## Task B5: VideoPicker01

**Files:** Create `apps/miller-web/components-v2/06_sections/pickers/video-picker-01.jsx`. Source: `…/environmental-remediation-services/sections/05-videos.jsx` + `components/FilmGallery.jsx` (+ `LiteYouTube`).

- [ ] **Step 1:** Read `05-videos.jsx`. Section `mw-rem-vid`; stacked head (`mw-rem-vid__head` / `__head-left` / `__lead`) above `<FilmGallery …>` (the 3 picker cards → active LiteYouTube player). Confirm `FilmGallery`'s exact props (films array shape `{ id, accent, title, desc }`, titleId, etc.).
- [ ] **Step 2:** Build `VideoPicker01({ content, config })` reproducing the `mw-rem-vid` shell verbatim (head + FilmGallery wrapper), passing `content`'s films + head copy + titleId to `FilmGallery` unchanged. `sectionProps` default-empty.
- [ ] **Step 3:** Self-review byte-identity vs `05-videos.jsx`.
- [ ] **Step 4:** Commit: `git add apps/miller-web/components-v2/06_sections/pickers/video-picker-01.jsx && git commit -m "feat(miller-web): VideoPicker01 template (mw-rem-vid, wraps FilmGallery)"`

---

## Task B6: REM sandbox page + adapter

**Files:** Create `apps/miller-web/app/template-testing/environmental-remediation-services/page.jsx` + `content.js`. Reference real `page.jsx` (order/metadata), `lib/content/service-environmental-remediation.js` (`REMEDIATION`).

- [ ] **Step 1:** Read real `page.jsx` (order: hero, what-we-do, industries, process, videos, case-studies, why-choose, cta, related; metadata; any preload). Read each real section to capture EXACT literals (titleIds, the hero video id/caption, the head-media/PNG paths, the `mw-rem-*` modifiers, the dispatch hotlineNote, phone cross-refs from hero).
- [ ] **Step 2:** Build `content.js` adapter: map `REMEDIATION` → per-section content props, preserving every string/id/anchor verbatim, marking non-content-file literals `// RECONCILE-IN-D:`. Cross-reference phone fields from `REMEDIATION.hero` for the dispatch CTA. Remap `whoWeServe → items` for PickerGallery (as ER did `provides → items`).
- [ ] **Step 3:** Build `page.jsx` composing in the real order with noindex metadata:
  - `<ServiceHero01 content={hero} config={{ media:"video" }} />` (confirm alert/ghostPhone from source — likely no alert; ghostPhone per source CTA set)
  - `<PhotoCardGrid01 content={whatWeDo} config={{ cardStyle:"wwd", head:"split", variant:"mw-rem-wwd" }} />`
  - `<PickerGallery01 content={whoWeServe} config={{ serve:true }} />`
  - `<ProcessFlow01 content={process} config={{ wide:true }} />`
  - `<VideoPicker01 content={videos} />`
  - `<PhotoCardGrid01 content={caseStudies} config={{ cardStyle:"case", head:"split", variant:"mw-rem-case" }} />`
  - `<WhyBand01 content={whyChoose} config={{ statCycle:true, variant:"mw-why--rem" }} />`
  - `<DispatchCta01 content={cta} />`
  - `<RelatedRail01 content={{ currentSlug:"environmental-remediation-services", titleId:"<verify>" }} />`
- [ ] **Step 4:** Verify: load `http://localhost:3001/template-testing/environmental-remediation-services` → HTTP 200, all 9 sections render, banner present, no console errors. Confirm no edits to protected paths.
- [ ] **Step 5:** Commit: `git add "apps/miller-web/app/template-testing/environmental-remediation-services/" && git commit -m "feat(miller-web): environmental-remediation sandbox page (components-v2)"`

---

## Task B7: REM parity gate

**Files:** Create `apps/miller-web/tests/template-testing-environmental-remediation-services.spec.js` (mirror the A parity specs).

- [ ] **Step 1:** Write the spec: REAL = `/industrial-services/environmental-remediation-services`, TT = `/template-testing/environmental-remediation-services`. Same 5 checks: section set+order parity (selectors: `.mw-svc-hero, .mw-svc-inds, .mw-svc-cov, .mw-flow, .mw-rem-vid, .mw-why, .mw-svc-cta, .mw-svc-related-sec`), reveal-attr placement parity, no stray variant attributes, mobile full-page byte parity, desktop page-body byte parity (clip from `.mw-svc-hero` top down).
- [ ] **Step 2:** Run it. Structural + no-stray must pass.
- [ ] **Step 3:** If a visual byte test fails, capture both full pages, LOOK at them, localize the diff (band/region), root-cause, fix the responsible template until byte-identical (or, if it is a sandbox-URL chrome artifact like the nav underline, confirm the page-body byte test still passes and document it). The controller runs Playwright and reviews the pixels directly.
- [ ] **Step 4:** Opus review of the diff + the new templates' DOM vs source.
- [ ] **Step 5:** Commit: `git add apps/miller-web/tests/template-testing-environmental-remediation-services.spec.js && git commit -m "test(miller-web): environmental-remediation sandbox parity spec"`

---

## Final (Sub-project B)
- [ ] Run all `tests/template-testing*` specs → all pass (A's specs must remain green — the ServiceHero01 and PhotoCardGrid01 extensions must not regress ER/CWC).
- [ ] Confirm `git diff` shows no protected-path edits (only new components-v2 files, new sandbox route, new spec).
- [ ] Final Opus review across the B diff. Then proceed to Sub-project C.
