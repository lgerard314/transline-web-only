# Service-page shared template library — program design

- **Date:** 2026-06-02
- **App:** `apps/miller-web` only.
- **Status:** Design (autonomous — decisions made by the agent under the user's standing delegation), revised after a 3-reviewer Opus spec audit. Implementation proceeds per the sub-project specs/plans this document decomposes into.
- **Builds on:** the `components-v2` template system proven on the home page (`/template-testing`), and the service-page inventory at `docs/superpowers/2026-06-02-service-pages-template-inventory.md`.

## 1. Goal

Convert the **7 already-redesigned Miller pages** (home + the 6 service pages: customer-waste-collection, emergency-response, environmental-remediation-services, industrial-cleaning, industrial-waste-treatment, project-management) onto a single shared, config-driven section-template library under `components-v2`. Every page's bespoke `mw-svc-*` / `mw-*` section files become thin compositions of shared templates fed by a content prop, exactly as the home page already is at `/template-testing`.

Out of scope: every other route (they remain V0 and get full redesigns later). No design changes — this is a structural migration that must reproduce each existing page **pixel-for-pixel**.

## 2. Core principles (inherited from the home-page work, non-negotiable)

1. **Pixel-parity, not redesign.** Each template emits DOM byte-identical to the existing section(s) it replaces. Existing `mw-*` CSS in `app/styles/*` is reused **read-only**. No visual change is permitted; parity is the acceptance test.
2. **Content-agnostic.** All copy comes from a `content` prop. Source of truth stays the existing `lib/content/service-<page>.js` files (read-only during build).
3. **Config-driven, via composition — not inline DOM forks.** Every section template accepts `config` with the established knobs (`scheme`, `layout`, `tokens`) plus template-specific knobs. **Variant DOM is produced by composing a different sub-component, not by a `switch` tree of inline markup inside one file** — mirroring the existing ladder (`HoverCardGrid01` composes `HoverCard01`; `BentoGrid01` composes `FeatureCard01`). A template shares its outer section shell and swaps a card/body/media sub-component selected by config. If two source sections share neither shell nor sub-component cleanly, they become **sibling templates** (`*-01`/`*-02`), not one over-loaded file. Default config reproduces the existing render exactly.
4. **Config knobs map to whatever mechanism the source section already uses — they are not all uniform.** Some sections encode a variant as a literal BEM modifier class (e.g. `mw-svc-cta--dark`, `mw-svc-cta__grid--reverse`, `mw-svc-cov--serve`, `mw-svc-hero--photo-50`); others (home templates) use `data-scheme`/`data-layout` + token rebind. A template reproduces the **source's own mechanism**: a knob emits/omits the exact literal class the real page uses. Do **not** re-route a service section's dark/reverse/ratio through the home page's `[data-scheme]`/`data-layout`/`template-testing.css` token-rebind machinery — that produces different CSS and breaks parity.
5. **Two-column split ratio is configurable where the template owns its grid.** Templates whose two-column grid lives in their **own server markup** (`ServiceHero01` photo-bleed, `DispatchCta01`, `VideoPicker01`, `FacilityShowcase01`, home's `MediaSplit01`) accept a `split` knob setting the desktop `grid-template-columns` ratio (route-scoped CSS keyed on a data-attribute, desktop-only, default = the source's exact ratio). Templates whose grid lives **inside a reused client component** (`PickerGallery01` → `CoverageGallery`'s `.mw-svc-cov__grid`) must **not** inject an inline ratio (would require editing/prop-drilling the read-only component); instead they toggle the **existing** ratio modifier class (`mw-svc-cov--serve`: base `1.1fr 0.72fr` vs serve `1fr 0.92fr`) via config. Knobs are added per template as needed; templates can be extended later.
6. **Existing pages are never edited during build.** All new templates are exercised on **new sandbox routes** under `app/template-testing/<slug>/`. The real pages stay byte-for-byte untouched until the separately-approved cutover (sub-project D). The single permitted existing-file edit during A–C is one line in `lib/nav.js` (see §6.4).
7. **Reuse existing shared client components** — do not rebuild interactivity. `RelatedServices`, `CoverageGallery`, `FlowRoute`/`TimelineNotifyCycle`, `ResponseTimeline`, `ContactForm`, `ScheduleForm`, `LiteYouTube`, `WhyChooseStatCycle`/`SectorStatCycle`, `StopText`, `FilmGallery` already exist under `apps/miller-web/components/` and are already shared; templates wrap them, passing ids/props through unchanged.
8. **Warm clay palette only** (no blue/teal/turquoise); Barlow Condensed / IBM Plex Sans / IBM Plex Mono; clay-square stop, diamond eyebrow, 49° grain motifs; `tl-*` shared vs `mw-*` Miller-only. Per `docs/DESIGN-SYSTEM.md`.
9. **Preserve every behavioral attribute exactly:** `data-reveal`/`data-reveal-stagger` placement per element, `loading="lazy"`, `aria-live`, `aria-labelledby` ids, `prefers-reduced-motion` off-switches. These live where the source puts them; for server templates the implementer hand-places each on the identical element.

## 3. The template set

14 new section templates (+ a `MediaSplit01` extension) join the 9 home templates in the same `components-v2/06_sections/*` ladder. New subtype folders: `flows/` (route/timeline sections), `rails/` (the related carousel), `pickers/` (left-list-swaps-right-media). Each template lists the existing section(s) it reproduces and its config/sub-component surface.

### Recurring / consolidated

| Template | File (under `06_sections/`) | Reproduces | # | Config / sub-components |
|---|---|---|---|---|
| `ServiceHero01` | `heroes/service-hero-01.jsx` | `mw-svc-hero` on all 6 | 6 | `media`: `photo-bleed` \| `transparent-png` \| `video` (swaps the media sub-component: `__bleed-photo` div vs `__media` figure+`LiteYouTube`); `alert` bool (`--alert`); `photoHalf` bool (`--photo-50`); `cta`: solid-link always + **optional** ghost-phone block (CWC has solid only); `split` ratio; per-element `data-reveal` toggles (ER hero has none; CWC hero has them) |
| `RelatedRail01` | `rails/related-rail-01.jsx` | `mw-svc-related-sec` → `RelatedServices` on all 6 | 6 | thin wrapper; passes `currentSlug`, `titleId` through to existing `RelatedServices` |
| `DispatchCta01` | `callouts/dispatch-cta-01.jsx` | `mw-svc-cta--dark` on ER, REM, IC, IWT, PM | 5 | emits literal `mw-svc-cta mw-svc-cta--dark` + `mw-svc-cta__grid--reverse` classes (NOT token-rebind/`data-layout`); `formSlot` wraps `ContactForm`; hotline block (incl. its hardcoded note literal); `split` ratio |
| `PhotoCardGrid01` | `grids/photo-card-grid-01.jsx` | `mw-svc-inds` family: ER incidents (`--photo`), CWC industries (`--gallery`), REM what-we-do (`--gallery` hover), REM case-studies (link), IC capabilities (`--photo`) | 5 | shared `mw-svc-inds` section shell + `mw-svc-inds__head`/`__grid`; **composes a card sub-component** per source: `IndThumbCard01` (`mw-svc-ind`), `IndGalleryCard01` (`mw-ind-card`), `WwdCard01` (`mw-wwd-card`, hover-swap), `CaseCard01` (`mw-case-card`, `<Link>`); `head`: `split` \| `media-split` (head PNG); optional `trailingCta` cell (CWC) |
| `WhyBand01` | `grids/why-band-01.jsx` | `mw-why` family: REM why-choose, IC why, PM group (`--3up`) | 3 | dark band; `columns` (3/4); optional `statCycle` head (wraps `WhyChooseStatCycle`); `marker`: `number` \| `none`; `mw-section-tag-label--invert` toggle |
| `ProcessFlow01` | `flows/process-flow-01.jsx` | `mw-flow` → `FlowRoute` (CWC, REM) | 2 | wraps `FlowRoute`+`TimelineNotifyCycle`; `wide` bool (`mw-flow--wide`); thin wrapper |
| `ResponseTimeline01` | `flows/response-timeline-01.jsx` | `mw-svc-tl-sec` → `ResponseTimeline` (ER) | 1 | wraps `ResponseTimeline`; emits `mw-svc-tl-sec mw-svc-tl-sec--v1`; thin wrapper (kept separate from ProcessFlow — different component, DOM, prop shape, interval) |
| `PickerGallery01` | `pickers/picker-gallery-01.jsx` | `mw-svc-cov` → `CoverageGallery` (ER, REM) | 2 | wraps `CoverageGallery` (passes `titleId`, `phoneHref`/`phoneDisplay`, items incl. `default`/`thumbAnchor`/`bigAnchor` unchanged); ratio via `mw-svc-cov--serve` class toggle |

### Unique / per-page

| Template | File | Reproduces | Page |
|---|---|---|---|
| `NumberedCardGrid01` | `grids/numbered-card-grid-01.jsx` | `mw-pm` (light, `<ol>`) | PM |
| `CapabilityGrid01` | `grids/capability-grid-01.jsx` | `mw-cap` (feature anchor + bullet-list cards; bento family, reuses `03_cards/feature/*`) | IWT |
| `CapacityLadder01` | `grids/capacity-ladder-01.jsx` | `mw-vol` | CWC |
| `ScheduleCta01` | `callouts/schedule-cta-01.jsx` | `mw-sched` (wraps `ScheduleForm`) | CWC |
| `VideoPicker01` | `pickers/video-picker-01.jsx` | `mw-rem-vid` (wraps `FilmGallery`/`LiteYouTube`) | REM |
| `FacilityShowcase01` | `grids/facility-showcase-01.jsx` | `mw-vbec` (photo+text split + 4-up stat band + process chips) | IWT |

`mw-fleet` (IC) is reproduced as a **body-variant of the existing home `MediaSplit01`** (`body:"numbered-list"`, dark scheme, image-bleed media) — a sub-component swap, not a new template.

Card sub-components live under `03_cards/` (e.g. `03_cards/ind/ind-thumb-card-01.jsx`).

## 4. Per-template structure

Each template is a thin server component that: emits the section's outer DOM with the exact literal classes the source uses (§4 principle); pulls every string from `content`; threads ids/anchors/props into reused client components unchanged; composes the variant sub-component selected by config; and applies `sectionProps(config)` **only when a non-default knob is set** — for the default service render `sectionProps` must emit **nothing** (no stray `data-scheme`/`style`), because the source sections carry no such attributes. The authoritative DOM for each template/sub-component is the existing section file(s) it reproduces; implementers read those and replicate markup verbatim, parameterizing only strings.

## 5. Content prop & adapters

Templates consume the existing per-page content exports (`customerWasteCollection`, `emergencyResponse`, `REMEDIATION`, `industrialCleaning`, `IWT`, `projectManagement`), keyed by section — already plain strings/arrays. **Default contract: templates consume the existing export shape directly.** A per-sandbox-route adapter (`app/template-testing/<slug>/content.js`) is used **only** where a template's prop shape genuinely differs, and it must preserve verbatim: every string, every **id** (e.g. `titleId="er-cov-title"`), every cross-section value (e.g. `phoneHref`/`phoneDisplay` pulled from `c.hero`), every non-string flag consumed by a client component (`item.default`, `thumbAnchor`, `bigAnchor`), and any **in-markup literal not currently in the content file** (e.g. the dispatch hotline note string, the incidents head-media PNG path). Every adapter created is enumerated in the sub-project plan so sub-project D can reconcile it (fold the reshape into the real content file at cutover); adapters are a build-phase bridge, never shipped to production.

## 6. Verification strategy (Playwright, mandatory)

For each migrated page:

1. **Sandbox route** `app/template-testing/<slug>/page.jsx` composes the new templates with the existing content (direct or via §5 adapter) and carries noindex metadata.
2. **Parity spec** `tests/template-testing-<slug>.spec.js` screenshots the **real** page and the **sandbox** at desktop (1280) + mobile (390), under `prefers-reduced-motion: reduce` (reveals snap visible; cycling widgets freeze deterministically — verified: `FlowRoute`/`ResponseTimeline` freeze at step 0 under reduced-motion), lazy images forced loaded, full-page, asserting visual parity (byte-identical full-page PNG is the gold standard, as achieved for home).
3. **DOM-structural assertions** (because screenshots under reduced-motion cannot catch animation-attribute drift): assert section set + order, key landmark classes, **and the exact placement of every `data-reveal`/`data-reveal-stagger` attribute** plus preserved `aria-labelledby` ids. Assert the default sandbox emits no stray `data-scheme`/`data-layout`/`style` variant attributes.
4. **Chrome parity — corrected.** `lib/nav.js` `EMERGENCY_BANNER_ROUTES.prefix = ["/industrial-services"]`, so **all 6 real service pages DO render the `EmergencyBanner`**. The sandbox routes at `/template-testing/<slug>` match neither the `exact` set nor that prefix, so they would render **without** the banner — a guaranteed vertical-offset diff. **Fix:** add `"/template-testing"` to `EMERGENCY_BANNER_ROUTES.prefix` so `/template-testing/<slug>` inherits the same banner as `/industrial-services/<slug>`. The plan verifies the matcher treats it as a path-segment prefix (and confirms the intended effect on `/template-testing-variants`). The agent then **looks at the screenshots** and runs an Opus review of any diff; byte-identity (or a fully explained, resolved delta) is required.

## 7. Sub-project decomposition

Each sub-project produces working, independently-verifiable software (templates + sandbox routes + passing parity tests) and gets its own plan. Reviewed pages first, so templates harden against the quality bar before the unreviewed pages.

- **Sub-project A — foundation + the 2 reviewed pages (ER, CWC).** Templates (9): `ServiceHero01`, `DispatchCta01`, `RelatedRail01`, `PhotoCardGrid01` (+ `IndThumbCard01`, `IndGalleryCard01`), `ProcessFlow01`, `ResponseTimeline01`, `PickerGallery01`, `CapacityLadder01`, `ScheduleCta01`. Plus the `nav.js` banner-prefix fix (§6.4). Sandbox-recreate emergency-response and customer-waste-collection; verify pixel-parity. ER uses ServiceHero/ResponseTimeline/PhotoCardGrid(thumb)/PickerGallery/DispatchCta/RelatedRail; CWC uses ServiceHero/CapacityLadder/ProcessFlow/PhotoCardGrid(gallery+trailingCta)/ScheduleCta/RelatedRail.
- **Sub-project B — environmental-remediation (9 sections).** Adds `VideoPicker01`, `WhyBand01` (+statCycle head), `PhotoCardGrid01` sub-components `WwdCard01` (hover) + `CaseCard01` (link), and `ServiceHero01` `media:"video"` variant. Reuses PickerGallery01, ProcessFlow01, DispatchCta01, RelatedRail01. Sandbox-recreate; verify.
- **Sub-project C — industrial-cleaning, industrial-waste-treatment, project-management.** Adds `CapabilityGrid01` (IWT `mw-cap`), `FacilityShowcase01` (IWT), `NumberedCardGrid01` (PM `mw-pm`), `MediaSplit01` numbered-list/fleet variant (IC), and `WhyBand01` light/3up coverage (IC why, PM group). Sandbox-recreate all three; verify.
- **Sub-project D — cutover + home promotion (separate, explicitly-approved, partly destructive).** Swap each verified sandbox into its real route; promote home off `/template-testing`; reconcile every §5 adapter into the real content files; resolve home→elsewhere couplings (`components/WhyChooseStatCycle.jsx` → `app/(home)/sections/sector-stat-cycle`; `template-testing-home.js` → `app/(home)/home.js`); revert or generalize the `nav.js` banner-prefix entry once sandboxes are deleted; rework/retire parity tests; delete sandbox routes + old bespoke section files (only after parity is locked and nothing else imports them). **`components-v2` is NOT renamed** by this program (any rename is a separate future task — avoid churn tangled into the destructive cutover).

## 8. Risks & mitigations

- **Hidden per-section literals / behavioral drift** → pixel-parity screenshot gate + the §6.3 DOM attribute assertions (which catch reveal-attribute drift that screenshots miss).
- **Template over-generalization** → resolved by composition + sibling templates (§2.3); each sub-component maps to one concrete source and is verified individually. The audit-driven splits (ProcessFlow/ResponseTimeline; PhotoCardGrid card sub-components; WhyBand vs NumberedCardGrid; CapabilityGrid out of PhotoCardGrid) are baked into §3.
- **Variant-mechanism mismatch** (dark/reverse/ratio routed through the wrong CSS) → §2.4: reproduce the source's own literal modifier class; never substitute the home token-rebind path.
- **Chrome/banner offset** → §6.4 `nav.js` prefix fix; verified by full-page diff.
- **Shared-component coupling to the home route** → left intact during A–C (read-only); resolved in D before any deletion.
- **Adapter permanence** → §5: adapters minimized, enumerated, and reconciled into real content files in D; never shipped.
- **Scope creep into `app/styles/*` or real pages** → forbidden in A–C; any unavoidable override lives in a route-scoped CSS file (the `template-testing.css` pattern), never a base partial.

## 9. Success criteria

- Every in-scope page has a sandbox recreation pixel-identical (desktop + mobile, reduced-motion) to its real counterpart, confirmed by reviewed screenshots, passing visual + DOM-attribute parity specs.
- All copy flows through `content`; default config reproduces the existing render with zero visual diff and zero stray variant attributes.
- No edits to `app/styles/*`, the real page routes, or the real content files during A–C (sole exception: the one-line `nav.js` banner-prefix entry).
- The shared template set is DRY via composition: the 6 service pages + home compose from the shared library with no per-page section markup duplicated and no single template carrying divergent inline DOM forks.
