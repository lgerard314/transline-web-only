# Service-page template inventory & gap analysis (2026-06-02)

Precursor artifact for migrating the 7 redesigned Miller pages onto the shared `components-v2` template library. Scope: home + the 6 service pages that have been converted to the new design (`customer-waste-collection`, `emergency-response`, `environmental-remediation-services`, `industrial-cleaning`, `industrial-waste-treatment`, `project-management`). All other routes remain V0 and are explicitly out of scope (they get full redos later).

Produced by reading every `sections/*.jsx` + `page.jsx` + content file across the 6 service pages (home's mapping is already known: the 9 existing `components-v2/06_sections/*` templates). The per-page extraction was fanned out to 6 read-only agents; the cross-page recurrence classification below is the synthesis.

## Headline findings

1. **None of the 6 service pages use `components-v2` yet.** They are bespoke `mw-svc-*` / `mw-*` section files with route-local content in `lib/content/service-*.js`. "Convert to template-library format" = extract each into a shared v2 section template + content prop, exactly as was done for the home page.
2. **The home library does not cover the service pages.** Home's `MonumentHero01` (rotating phrase + background image, two buttons) is a different component from the service hero (bleed photo / video + ghost *phone* CTA). Home's `MultiColumnCta01` (image | content | logo + socials) is a different component from the service dispatch CTA (cream form card + 24/7 hotline). The service pages need a **second wave of ~7 shared templates designed from the service pages themselves**, plus a set of one-offs.
3. **Substantial sharing already exists at the component level** and is the cheapest win: `RelatedServices` (used by all 6), `CoverageGallery` (2), `FlowRoute` (2), `WhyChooseStatCycle` (wraps home's `SectorStatCycle`), and the dark dispatch CTA markup is near-identical across 5 pages.

## Coverage matrix

37 section instances across the 6 service pages (6 + 6 + 9 + 6 + 5 + 5). Pages: CWC = customer-waste-collection, ER = emergency-response, REM = environmental-remediation-services, IC = industrial-cleaning, IWT = industrial-waste-treatment, PM = project-management.

| Proposed shared template | DOM root | CWC | ER | REM | IC | IWT | PM | # | Notes |
|---|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|---|
| ServiceHero | `mw-svc-hero` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 6 | Media variants: bleed-photo (`--photo-50`), transparent-png, video-embed. Eyebrow + StopText headline + lead + CTA row (ghost phone + solid link). Distinct from home `MonumentHero01`. |
| RelatedRail | `mw-svc-related-sec` → `RelatedServices` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 6 | Already a shared client component driven by `lib/services.js`, filtered by `currentSlug`. Infinite-scroll card carousel with prev/next. Just needs wrapping as a v2 section. Not the logo marquee (`RotatingBanner01`). |
| DispatchCta (dark) | `mw-svc-cta--dark` | – | ✓ | ✓ | ✓ | ✓ | ✓ | 5 | Reversed 2-col: cream `ContactForm` card + dark content with logomark + 24/7 hotline block. Near copy-paste across all 5. Distinct from home `MultiColumnCta01`. |
| PhotoCardGrid | `mw-svc-inds` | ✓ | ✓ | ✓✓ | ✓ | – | – | 5 | Sub-variants: `--gallery` (tall photo cards) vs `--photo` (thumb-left rows). Hover-swap optional (REM what-we-do), link optional (REM case-studies), tick decoration. Header is split or media-split. Cousin of home `HoverCardGrid01`. |
| WhyBand | `mw-why` | – | – | ✓ | ✓ | – | ✓ | 3 | Dark band, N numbered/stat cards. Optional stat-cycle head (`WhyChooseStatCycle`, REM). 3up / 4up. |
| ProcessFlow | `mw-flow`, `mw-svc-tl-sec` | ✓ | ✓ | ✓ | – | – | – | 3 | Cycling notification banner + numbered horizontal route/timeline, single clock. `FlowRoute` already shared (CWC + REM); ER's `ResponseTimeline` is a near-cousin (consolidate or keep as timeline variant). |
| PickerGallery | `mw-svc-cov` | – | ✓ | ✓ | – | – | – | 2 | `CoverageGallery` already shared. Hover/focus list on left swaps a large photo on the right; `aria-live` caption. |
| — one-off: capacity ladder | `mw-vol` (CWC) | ✓ | | | | | | 1 | Header panel + `<ol>` of capacity tiers, each with glyph + proportional CSS gauge fill bar. |
| — one-off: scheduling CTA | `mw-sched` (CWC) | ✓ | | | | | | 1 | Walnut "what happens next" panel + `ScheduleForm` over a truck bleed. Cousin of DispatchCta (CWC's closing section instead of the dark dispatch CTA). |
| — one-off: video picker | `mw-rem-vid` (REM) | | | ✓ | | | | 1 | `FilmGallery`: 3 film picker cards on the left select the active `LiteYouTube` player on the right. |
| — one-off: facility showcase | `mw-vbec` (IWT) | | | | | ✓ | | 1 | Photo+text split + 4-up stat band + process pill-chips. |
| — one-off: capability grid | `mw-cap` (IWT) | | | | | ✓ | | 1 | One full-width feature card (photo + bullets) + 3-up grid of photo-topped capability cards. Cousin of PhotoCardGrid / bento. |
| — one-off: fleet split | `mw-fleet` (IC) | | | | ✓ | | | 1 | Dark 2-col split: numbered 2-item list + silhouette PNG bleed. Cousin of a generic Split. |
| — one-off: numbered grid | `mw-pm` (PM) | | | | | | ✓ | 1 | Light-surface numbered `<ol>` card grid (6 equal cards) + split header. Cousin of WhyBand (light variant) → candidate `NumberedCardGrid`. |

**7 recurring templates cover 30 of 37 instances; 7 one-offs cover the remaining 7.** With aggressive config consolidation, several one-offs collapse into the recurring families (`mw-pm` + `mw-why` cards → a scheme-aware `NumberedCardGrid`; `mw-cap` → `PhotoCardGrid` + feature anchor; `mw-fleet` → a `Split` variant), leaving ~4 genuinely unique (capacity ladder, scheduling CTA, video picker, facility showcase).

## Existing shared client components (reuse, do not rebuild)

- `components/RelatedServices.jsx` — RelatedRail (6 pages). Already DRY.
- `CoverageGallery` — PickerGallery (ER, REM).
- `FlowRoute` + `TimelineNotifyCycle` — ProcessFlow (CWC, REM).
- `components/WhyChooseStatCycle.jsx` — wraps home's `app/(home)/sections/sector-stat-cycle` (WhyBand stat-cycle head, REM). This is one of the home→elsewhere couplings noted in the home-promotion analysis.
- `ContactForm` (`@/components/ContactForm`) — DispatchCta form slot (5 pages).
- `ScheduleForm` — CWC scheduling CTA.
- `LiteYouTube` — ServiceHero video variant (REM) + video picker (REM).

## Content shape (consistent and migration-friendly)

Every service page already stores its copy in `apps/miller-web/lib/content/service-<page>.js` as a single named export of plain strings/arrays (no JSX), keyed by section. This mirrors the `template-testing-home.js` pattern and means the content-prop migration is mechanical: the markup moves into shared templates, the existing content files stay (or are lightly reshaped) as the content source.

## Recommended sequencing (for the migration brainstorm)

1. **Build the 4 highest-confidence shared templates first** — ServiceHero (6), DispatchCta (5), RelatedRail (6, already shared), PhotoCardGrid (5). These cover ~22 of 37 instances and are the lowest-risk (high recurrence, near-identical existing markup).
2. **Harden them against the 2 reviewed pages** (emergency-response, customer-waste-collection) — the trusted quality bar — before touching the unreviewed pages.
3. **Add the medium-recurrence templates** — WhyBand, ProcessFlow, PickerGallery (+ decide one-off consolidation).
4. **Migrate page-by-page**, reviewing each unreviewed page (Opus reviews) as it lands.
5. **Fold the home promotion in** as its own migration (it shares the `RelatedRail`-style infra least; its 9 templates already exist) — sequence it whenever convenient since it is independent of the service-template wave.

## Open design decisions (resolve in the brainstorm)

- Consolidation aggressiveness: collapse one-off cousins into configurable templates, or keep them as distinct `*-01` templates?
- Naming/location: promote `components-v2` to a production name now, or after the service wave?
- ServiceHero media variants: one template with a `media` config (photo-bleed / png / video) vs separate templates.
- ProcessFlow: unify `FlowRoute` and ER's `ResponseTimeline`, or keep ER's as a timeline variant?
- DispatchCta vs CWC's `mw-sched`: one template with a form-slot config, or two.
