# components-v2 Type-Folder Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize `apps/miller-web/components-v2/` into numbered `0N_level/<type>/` folders with type-named files and matching renamed exports, changing only file locations + import wiring — zero render-logic changes, output byte-identical.

**Architecture:** This is an atomic rename/move refactor. Because every file moves and several exports are renamed, **the app will not compile between Task 1 and Task 3** — there is no partial-green state, so the whole refactor lands in a single commit (Task 4). Verification is the existing build + the 5 Playwright parity tests + a git-rename check; no new tests are written (behavior is unchanged).

**Tech Stack:** Next.js 16 App Router, React 19, path alias `@/*` → `apps/miller-web/`. Dev server runs on http://localhost:3001 (`npm run dev:miller` from repo root).

**Reference spec:** `docs/superpowers/specs/2026-06-02-components-v2-type-folders-refactor-design.md`

---

## Scope / do-not-touch

- **Only `apps/miller-web/components-v2/**` files move/rename, and `apps/miller-web/app/template-testing/page.jsx` updates its imports.** No other existing file changes — not `lib/**`, `app/(home)/**`, `components/**`, `app/styles/**`, or `apps/brand/**`.
- **No edits to any component's render body.** Only three things change in a file: its location, its exported function *name* (where the map renames it), and its `import` lines + the JSX tag identifiers that reference a renamed import.
- Content/brand imports stay verbatim: `@/lib/services`, `@/lib/certs`, `@/lib/content/brand`, `@/lib/content/template-testing-home`, `@/app/(home)/home`, `@white-owl/brand/components`, `next/link`, `react`.

## New-path + export reference (used throughout)

| Export name (new) | New import path |
|---|---|
| `Eyebrow01` | `@/components-v2/01_marks/eyebrows/eyebrow-01` |
| `StopPeriod01` | `@/components-v2/01_marks/stops/stop-period-01` |
| `StopText01` | `@/components-v2/01_marks/stops/stop-text-01` |
| `ActionArrow01` | `@/components-v2/01_marks/arrows/action-arrow-01` |
| `Nobr01` | `@/components-v2/01_marks/text/nobr-01` |
| `NumToken01` | `@/components-v2/01_marks/text/num-token-01` |
| `SolidCta01` (was CtaSolid01) | `@/components-v2/02_buttons/solid/solid-cta-01` |
| `GhostPhoneCta01` (was CtaGhostPhone01) | `@/components-v2/02_buttons/ghost/ghost-phone-cta-01` |
| `FeatureAnchor01` (was ServiceAnchor01) | `@/components-v2/03_cards/feature/feature-anchor-01` |
| `FeatureCard01` (was ServiceCard01) | `@/components-v2/03_cards/feature/feature-card-01` |
| `FeatureTile01` (was ServiceTile01) | `@/components-v2/03_cards/feature/feature-tile-01` |
| `DownloadCard01` (was CertCard01) | `@/components-v2/03_cards/download/download-card-01` |
| `NoteCard01` (was CareersCard01) | `@/components-v2/03_cards/note/note-card-01` |
| `IconLink01` (was SocialLink01) | `@/components-v2/03_cards/icon-link/icon-link-01` |
| `HeadIntro01` | `@/components-v2/04_blocks/heads/head-intro-01` |
| `FigureStat01` | `@/components-v2/04_blocks/stats/figure-stat-01` |
| `PlateStat01` | `@/components-v2/04_blocks/stats/plate-stat-01` |
| `CapItem01` | `@/components-v2/04_blocks/stats/cap-item-01` |
| `MilestoneItem01` | `@/components-v2/04_blocks/list-items/milestone-item-01` |
| `MissionBlock01` | `@/components-v2/04_blocks/prose/mission-block-01` |
| `PhraseCycle01` | `@/components-v2/05_widgets/cycles/phrase-cycle-01` |
| `StatCycle01` | `@/components-v2/05_widgets/cycles/stat-cycle-01` |
| `ThumbGallery01` (was GalleryThumb01) | `@/components-v2/05_widgets/galleries/thumb-gallery-01` |
| `HoverCard01` (was SectorCard01) | `@/components-v2/05_widgets/galleries/hover-card-01` |
| `VerticalTimeline01` (was TimelineVertical01) | `@/components-v2/05_widgets/timelines/vertical-timeline-01` |
| `MarqueeBand01` | `@/components-v2/05_widgets/marquees/marquee-band-01` |
| `TallStaticBanner01` (was CertsBanner01) | `@/components-v2/06_sections/banners/tall-static-banner-01` |
| `RotatingBanner01` (was AffiliatesBanner01) | `@/components-v2/06_sections/banners/rotating-banner-01` |
| `MonumentHero01` (was Hero01) | `@/components-v2/06_sections/heroes/monument-hero-01` |
| `BentoGrid01` (was Services01) | `@/components-v2/06_sections/grids/bento-grid-01` |
| `HoverCardGrid01` (was Sectors01) | `@/components-v2/06_sections/grids/hover-card-grid-01` |
| `MediaSplit01` (was Facility01) | `@/components-v2/06_sections/splits/media-split-01` |
| `TimelineSplit01` (was History01) | `@/components-v2/06_sections/splits/timeline-split-01` |
| `PhotoBleedCards01` (was Careers01) | `@/components-v2/06_sections/callouts/photo-bleed-cards-01` |
| `MultiColumnCta01` (was FinalCta01) | `@/components-v2/06_sections/callouts/multi-column-cta-01` |
| `splitTitle`, `homeServiceOrder` (helper) | `@/components-v2/06_sections/grids/bento-grid-order` |

---

## Task 1: Create folder tree + `git mv` all 36 files

**Files:** moves only; no content edits in this task. Work from `apps/miller-web/`.

- [ ] **Step 1: Create the new directory tree**

```bash
cd apps/miller-web
mkdir -p \
  components-v2/01_marks/eyebrows components-v2/01_marks/stops components-v2/01_marks/arrows components-v2/01_marks/text \
  components-v2/02_buttons/solid components-v2/02_buttons/ghost \
  components-v2/03_cards/feature components-v2/03_cards/download components-v2/03_cards/note components-v2/03_cards/icon-link \
  components-v2/04_blocks/heads components-v2/04_blocks/stats components-v2/04_blocks/list-items components-v2/04_blocks/prose \
  components-v2/05_widgets/cycles components-v2/05_widgets/galleries components-v2/05_widgets/timelines components-v2/05_widgets/marquees \
  components-v2/06_sections/banners components-v2/06_sections/heroes components-v2/06_sections/grids components-v2/06_sections/splits components-v2/06_sections/callouts
```

- [ ] **Step 2: `git mv` every file to its new path/name**

```bash
git mv components-v2/items/eyebrow-01.jsx          components-v2/01_marks/eyebrows/eyebrow-01.jsx
git mv components-v2/items/stop-period-01.jsx      components-v2/01_marks/stops/stop-period-01.jsx
git mv components-v2/items/stop-text-01.jsx        components-v2/01_marks/stops/stop-text-01.jsx
git mv components-v2/items/action-arrow-01.jsx     components-v2/01_marks/arrows/action-arrow-01.jsx
git mv components-v2/items/nobr-01.jsx             components-v2/01_marks/text/nobr-01.jsx
git mv components-v2/items/num-token-01.jsx        components-v2/01_marks/text/num-token-01.jsx
git mv components-v2/items/cta-solid-01.jsx        components-v2/02_buttons/solid/solid-cta-01.jsx
git mv components-v2/items/cta-ghost-phone-01.jsx  components-v2/02_buttons/ghost/ghost-phone-cta-01.jsx
git mv components-v2/blocks/service-anchor-01.jsx  components-v2/03_cards/feature/feature-anchor-01.jsx
git mv components-v2/blocks/service-card-01.jsx    components-v2/03_cards/feature/feature-card-01.jsx
git mv components-v2/blocks/service-tile-01.jsx    components-v2/03_cards/feature/feature-tile-01.jsx
git mv components-v2/blocks/cert-card-01.jsx       components-v2/03_cards/download/download-card-01.jsx
git mv components-v2/blocks/careers-card-01.jsx    components-v2/03_cards/note/note-card-01.jsx
git mv components-v2/blocks/social-link-01.jsx     components-v2/03_cards/icon-link/icon-link-01.jsx
git mv components-v2/blocks/head-intro-01.jsx      components-v2/04_blocks/heads/head-intro-01.jsx
git mv components-v2/blocks/figure-stat-01.jsx     components-v2/04_blocks/stats/figure-stat-01.jsx
git mv components-v2/blocks/plate-stat-01.jsx      components-v2/04_blocks/stats/plate-stat-01.jsx
git mv components-v2/blocks/cap-item-01.jsx        components-v2/04_blocks/stats/cap-item-01.jsx
git mv components-v2/blocks/milestone-item-01.jsx  components-v2/04_blocks/list-items/milestone-item-01.jsx
git mv components-v2/blocks/mission-block-01.jsx   components-v2/04_blocks/prose/mission-block-01.jsx
git mv components-v2/widgets/phrase-cycle-01/index.jsx     components-v2/05_widgets/cycles/phrase-cycle-01.jsx
git mv components-v2/widgets/stat-cycle-01/index.jsx       components-v2/05_widgets/cycles/stat-cycle-01.jsx
git mv components-v2/widgets/gallery-thumb-01/index.jsx    components-v2/05_widgets/galleries/thumb-gallery-01.jsx
git mv components-v2/widgets/sector-card-01/index.jsx      components-v2/05_widgets/galleries/hover-card-01.jsx
git mv components-v2/widgets/timeline-vertical-01/index.jsx components-v2/05_widgets/timelines/vertical-timeline-01.jsx
git mv components-v2/widgets/marquee-band-01/index.jsx     components-v2/05_widgets/marquees/marquee-band-01.jsx
git mv components-v2/sections/certs-banner-01/index.jsx       components-v2/06_sections/banners/tall-static-banner-01.jsx
git mv components-v2/sections/affiliates-banner-01/index.jsx  components-v2/06_sections/banners/rotating-banner-01.jsx
git mv components-v2/sections/hero-01/index.jsx               components-v2/06_sections/heroes/monument-hero-01.jsx
git mv components-v2/sections/services-01/index.jsx           components-v2/06_sections/grids/bento-grid-01.jsx
git mv components-v2/sections/services-01/service-order.js    components-v2/06_sections/grids/bento-grid-order.js
git mv components-v2/sections/sectors-01/index.jsx            components-v2/06_sections/grids/hover-card-grid-01.jsx
git mv components-v2/sections/facility-01/index.jsx           components-v2/06_sections/splits/media-split-01.jsx
git mv components-v2/sections/history-01/index.jsx            components-v2/06_sections/splits/timeline-split-01.jsx
git mv components-v2/sections/careers-01/index.jsx            components-v2/06_sections/callouts/photo-bleed-cards-01.jsx
git mv components-v2/sections/final-cta-01/index.jsx          components-v2/06_sections/callouts/multi-column-cta-01.jsx
```

- [ ] **Step 3: Remove the now-empty old directories**

```bash
rmdir components-v2/widgets/phrase-cycle-01 components-v2/widgets/stat-cycle-01 components-v2/widgets/gallery-thumb-01 components-v2/widgets/sector-card-01 components-v2/widgets/timeline-vertical-01 components-v2/widgets/marquee-band-01 components-v2/widgets 2>/dev/null
rmdir components-v2/sections/certs-banner-01 components-v2/sections/affiliates-banner-01 components-v2/sections/hero-01 components-v2/sections/services-01 components-v2/sections/sectors-01 components-v2/sections/facility-01 components-v2/sections/history-01 components-v2/sections/careers-01 components-v2/sections/final-cta-01 components-v2/sections 2>/dev/null
rmdir components-v2/items components-v2/blocks 2>/dev/null
echo "remaining old dirs (should be empty output):"; ls -d components-v2/items components-v2/blocks components-v2/widgets components-v2/sections 2>/dev/null
```

- [ ] **Step 4: Confirm 36 files landed (no commit yet — build is intentionally broken until Task 4)**

```bash
find components-v2 -type f | sort | wc -l   # expect 36
```

---

## Task 2: Rename exports + repoint imports (component files)

**Files:** the moved files under `components-v2/`. Edit each as listed. **Do not touch render bodies** — only the `export function` name, the `import` lines, and JSX tags that reference a renamed import.

### 2a. No-edit files (moved cleanly in Task 1 — verify, do nothing)

These have no internal-component imports and no export rename: `eyebrow-01`, `stop-period-01`, `stop-text-01`, `action-arrow-01`, `nobr-01`, `num-token-01`, `figure-stat-01`, `plate-stat-01`, `milestone-item-01`, `phrase-cycle-01`, `stat-cycle-01`, `marquee-band-01`, `bento-grid-order.js`.

- [ ] **Step 1: Confirm no edits needed** — open each, confirm its only imports are `react` / `next/link` / `@white-owl/brand/*` / `@/lib/*` / `@/app/(home)/home`, and its export name is unchanged per the reference table. Leave as-is.

### 2b. Export-rename-only files (rename the function, fix nothing else)

- [ ] **Step 2: Rename these six exports** (no import or JSX changes inside these files):

| File | Change |
|---|---|
| `02_buttons/solid/solid-cta-01.jsx` | `export function CtaSolid01` → `export function SolidCta01` |
| `02_buttons/ghost/ghost-phone-cta-01.jsx` | `export function CtaGhostPhone01` → `export function GhostPhoneCta01` |
| `03_cards/download/download-card-01.jsx` | `export function CertCard01` → `export function DownloadCard01` |
| `03_cards/icon-link/icon-link-01.jsx` | `export function SocialLink01` → `export function IconLink01` |
| `05_widgets/galleries/thumb-gallery-01.jsx` | `export function GalleryThumb01` → `export function ThumbGallery01` |
| `05_widgets/galleries/hover-card-01.jsx` | `export function SectorCard01` → `export function HoverCard01` |

### 2c. Import-path-only files (repoint imports; names unchanged)

- [ ] **Step 3: Repoint these imports** (export names here are unchanged; imported identifiers are unchanged — only the path string changes):

- `04_blocks/heads/head-intro-01.jsx`: change `from "@/components-v2/items/eyebrow-01"` → `from "@/components-v2/01_marks/eyebrows/eyebrow-01"`.
- `04_blocks/stats/cap-item-01.jsx`: change `from "@/components-v2/items/num-token-01"` → `from "@/components-v2/01_marks/text/num-token-01"`.
- `04_blocks/prose/mission-block-01.jsx`: change `from "@/components-v2/items/action-arrow-01"` → `from "@/components-v2/01_marks/arrows/action-arrow-01"`.

### 2d. Export-rename + import-path files (rename export, repoint imports; no renamed-import JSX swaps)

- [ ] **Step 4: `feature-anchor-01.jsx`** — `export function ServiceAnchor01` → `FeatureAnchor01`; repoint `NumToken01` import to `@/components-v2/01_marks/text/num-token-01`. (JSX uses `NumToken01`, unchanged.)

- [ ] **Step 5: `feature-card-01.jsx`** — `export function ServiceCard01` → `FeatureCard01`; repoint `NumToken01` → `@/components-v2/01_marks/text/num-token-01`; repoint `splitTitle` import from `@/components-v2/sections/services-01/service-order` → `@/components-v2/06_sections/grids/bento-grid-order`.

- [ ] **Step 6: `feature-tile-01.jsx`** — `export function ServiceTile01` → `FeatureTile01`; repoint `NumToken01` → `@/components-v2/01_marks/text/num-token-01`; repoint `splitTitle` → `@/components-v2/06_sections/grids/bento-grid-order`.

- [ ] **Step 7: `03_cards/note/note-card-01.jsx`** — `export function CareersCard01` → `NoteCard01`; repoint `ActionArrow01` → `@/components-v2/01_marks/arrows/action-arrow-01`. (`next/link` unchanged; JSX `ActionArrow01` unchanged.)

- [ ] **Step 8: `05_widgets/timelines/vertical-timeline-01.jsx`** — `export function TimelineVertical01` → `VerticalTimeline01`; repoint `MilestoneItem01` import → `@/components-v2/04_blocks/list-items/milestone-item-01`. (JSX `MilestoneItem01` unchanged.)

### 2e. Section files — export rename + import block rewrite + JSX identifier swaps

For each, replace the existing `@/components-v2/...` import lines with the block shown, rename the export, and apply the JSX tag swaps. All non-`components-v2` imports (HOME, CERTS, SECTOR_*, FACILITY_PHOTOS, MILESTONES, SOCIALS, EMERGENCY_PHONE, Link, etc.) stay exactly as they are.

> **JSX swaps = rename EVERY occurrence of the old identifier in the file — the import line, opening tags (`<Old ...>`), AND closing tags (`</Old>`).** A whole-file identifier replace (e.g. all `CtaSolid01` → `SolidCta01`) is the safe way; the occurrence hints below are minimums. `CtaSolid01` in particular appears as `<CtaSolid01 …></CtaSolid01>` (open + close) in hero, media-split, and multi-column-cta — missing the closing tag breaks the build.

- [ ] **Step 9: `06_sections/banners/tall-static-banner-01.jsx`**
  - Export: `CertsBanner01` → `TallStaticBanner01`.
  - Import: `import { DownloadCard01 } from "@/components-v2/03_cards/download/download-card-01";` (was `CertCard01` from blocks/cert-card-01).
  - JSX: `<CertCard01` → `<DownloadCard01` (1 occurrence).

- [ ] **Step 10: `06_sections/banners/rotating-banner-01.jsx`**
  - Export: `AffiliatesBanner01` → `RotatingBanner01`.
  - Import: `import { MarqueeBand01 } from "@/components-v2/05_widgets/marquees/marquee-band-01";`.
  - JSX: `MarqueeBand01` unchanged.

- [ ] **Step 11: `06_sections/heroes/monument-hero-01.jsx`**
  - Export: `Hero01` → `MonumentHero01`.
  - Imports (replace the 5 component import lines with):
    ```jsx
    import { PhraseCycle01 } from "@/components-v2/05_widgets/cycles/phrase-cycle-01";
    import { StopPeriod01 } from "@/components-v2/01_marks/stops/stop-period-01";
    import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
    import { GhostPhoneCta01 } from "@/components-v2/02_buttons/ghost/ghost-phone-cta-01";
    import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
    ```
    (Keep `import { EMERGENCY_PHONE } from "@/lib/content/brand";`.)
  - Identifier renames — replace EVERY occurrence in the file: `CtaSolid01` → `SolidCta01` (import + `<CtaSolid01 …>` open + `</CtaSolid01>` close), `CtaGhostPhone01` → `GhostPhoneCta01` (self-closed, single tag).

- [ ] **Step 12: `06_sections/grids/bento-grid-01.jsx`**
  - Export: `Services01` → `BentoGrid01`.
  - Imports:
    ```jsx
    import { homeServiceOrder } from "./bento-grid-order";
    import { HeadIntro01 } from "@/components-v2/04_blocks/heads/head-intro-01";
    import { FeatureAnchor01 } from "@/components-v2/03_cards/feature/feature-anchor-01";
    import { FeatureCard01 } from "@/components-v2/03_cards/feature/feature-card-01";
    import { FeatureTile01 } from "@/components-v2/03_cards/feature/feature-tile-01";
    ```
  - JSX: `<ServiceAnchor01` → `<FeatureAnchor01` (1), `<ServiceCard01` → `<FeatureCard01` (1), `<ServiceTile01` → `<FeatureTile01` (3 — two internal map calls + the external tile).

- [ ] **Step 13: `06_sections/grids/hover-card-grid-01.jsx`**
  - Export: `Sectors01` → `HoverCardGrid01`.
  - Imports (component lines):
    ```jsx
    import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
    import { StatCycle01 } from "@/components-v2/05_widgets/cycles/stat-cycle-01";
    import { HoverCard01 } from "@/components-v2/05_widgets/galleries/hover-card-01";
    ```
    (Keep `SECTOR_STATS`, `SECTOR_CARDS` import from `@/lib/content/template-testing-home`.)
  - JSX: `<SectorCard01` → `<HoverCard01` (1).

- [ ] **Step 14: `06_sections/splits/media-split-01.jsx`**
  - Export: `Facility01` → `MediaSplit01`.
  - Imports (component lines):
    ```jsx
    import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
    import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
    import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
    import { FigureStat01 } from "@/components-v2/04_blocks/stats/figure-stat-01";
    import { CapItem01 } from "@/components-v2/04_blocks/stats/cap-item-01";
    import { ThumbGallery01 } from "@/components-v2/05_widgets/galleries/thumb-gallery-01";
    ```
    (Keep `HOME` from `@/app/(home)/home`, `FACILITY_PHOTOS` from `@/lib/content/template-testing-home`, and `import Link from "next/link";`.)
  - Identifier renames — replace EVERY occurrence in the file: `CtaSolid01` → `SolidCta01` (import + `<CtaSolid01 …>` open + `</CtaSolid01>` close), `GalleryThumb01` → `ThumbGallery01` (self-closed, single tag).

- [ ] **Step 15: `06_sections/splits/timeline-split-01.jsx`**
  - Export: `History01` → `TimelineSplit01`.
  - Imports (component lines):
    ```jsx
    import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
    import { VerticalTimeline01 } from "@/components-v2/05_widgets/timelines/vertical-timeline-01";
    import { PlateStat01 } from "@/components-v2/04_blocks/stats/plate-stat-01";
    import { MissionBlock01 } from "@/components-v2/04_blocks/prose/mission-block-01";
    ```
    (Keep `HOME`, `MILESTONES`, and the local `MISSION_PARAGRAPHS` const.)
  - JSX: `<TimelineVertical01` → `<VerticalTimeline01` (1).

- [ ] **Step 16: `06_sections/callouts/photo-bleed-cards-01.jsx`**
  - Export: `Careers01` → `PhotoBleedCards01`.
  - Imports (component lines):
    ```jsx
    import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
    import { NoteCard01 } from "@/components-v2/03_cards/note/note-card-01";
    ```
    (Keep `HOME` from `@/app/(home)/home`.)
  - JSX: `<CareersCard01` → `<NoteCard01` (2 occurrences — Culture + Hiring cards).

- [ ] **Step 17: `06_sections/callouts/multi-column-cta-01.jsx`**
  - Export: `FinalCta01` → `MultiColumnCta01`.
  - Replace the component import lines with this exact block (**`GhostPhoneCta01` IS used here** — the 24/7 ghost phone in the CTA row — and was the missing line):
    ```jsx
    import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
    import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
    import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
    import { GhostPhoneCta01 } from "@/components-v2/02_buttons/ghost/ghost-phone-cta-01";
    import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
    import { IconLink01 } from "@/components-v2/03_cards/icon-link/icon-link-01";
    ```
    (Keep `import { HOME as c } from "@/app/(home)/home";` and `import { SOCIALS } from "@/lib/content/template-testing-home";`.)
  - Identifier renames — replace EVERY occurrence in the file: `CtaSolid01` → `SolidCta01` (import + `<CtaSolid01 …>` open + `</CtaSolid01>` close, all on line ~25), `CtaGhostPhone01` → `GhostPhoneCta01` (self-closed), `SocialLink01` → `IconLink01` (self-closed, inside the `SOCIALS.map`).
  - **`Eyebrow01` is imported but UNUSED** here — this section inlines its eyebrow as `<p className="mw-section-tag mw-final__tag">…</p>`, so there is no `<Eyebrow01>` tag to swap. Repoint its import path as shown above and leave it (faithful to the original's pre-existing dead import); optionally delete that one import line as harmless cleanup.

---

## Task 3: Update the page orchestrator

**Files:** Modify `apps/miller-web/app/template-testing/page.jsx`.

- [ ] **Step 1: Replace the 9 section imports** with:

```jsx
import { MonumentHero01 } from "@/components-v2/06_sections/heroes/monument-hero-01";
import { TallStaticBanner01 } from "@/components-v2/06_sections/banners/tall-static-banner-01";
import { BentoGrid01 } from "@/components-v2/06_sections/grids/bento-grid-01";
import { HoverCardGrid01 } from "@/components-v2/06_sections/grids/hover-card-grid-01";
import { MediaSplit01 } from "@/components-v2/06_sections/splits/media-split-01";
import { TimelineSplit01 } from "@/components-v2/06_sections/splits/timeline-split-01";
import { PhotoBleedCards01 } from "@/components-v2/06_sections/callouts/photo-bleed-cards-01";
import { RotatingBanner01 } from "@/components-v2/06_sections/banners/rotating-banner-01";
import { MultiColumnCta01 } from "@/components-v2/06_sections/callouts/multi-column-cta-01";
```

- [ ] **Step 2: Swap the JSX tags** (keep the same order + the preload `<link>` + metadata):

```jsx
<MonumentHero01 />
<TallStaticBanner01 />
<BentoGrid01 />
<HoverCardGrid01 />
<MediaSplit01 />
<TimelineSplit01 />
<PhotoBleedCards01 />
<RotatingBanner01 />
<MultiColumnCta01 />
```

---

## Task 4: Verify + commit (single atomic commit)

**Files:** none (verification + commit).

- [ ] **Step 1: Static check — no stale old paths or old export names remain**

```bash
cd apps/miller-web
echo "stale OLD paths (expect none):"
grep -rn "components-v2/items\|components-v2/blocks\|components-v2/widgets/\|components-v2/sections/\|sections/services-01/service-order" app components-v2 || echo "  none ✓"
echo "stale OLD export identifiers (expect none):"
grep -rn "\bCtaSolid01\|\bCtaGhostPhone01\|\bServiceAnchor01\|\bServiceCard01\|\bServiceTile01\|\bCertCard01\|\bCareersCard01\|\bSocialLink01\|\bGalleryThumb01\|\bSectorCard01\|\bTimelineVertical01\|\bCertsBanner01\|\bAffiliatesBanner01\|\bHero01\|\bServices01\|\bSectors01\|\bFacility01\|\bHistory01\|\bCareers01\|\bFinalCta01" app components-v2 || echo "  none ✓"
```
Expected: both print "none ✓". Any hit is an unconverted reference — fix it before continuing.

- [ ] **Step 2: Production build passes**

```bash
cd apps/miller-web && npx next build 2>&1 | tail -25
```
Expected: build completes, `/template-testing` listed, **no "Module not found" / unresolved-import errors**. (If the dev server holds a lock on `.next`, stop it first or run the build; a successful compile is the gate.)

- [ ] **Step 3: Parity tests pass** (dev server must be running on 3001; start with `npm run dev:miller` from repo root if needed)

```bash
cd apps/miller-web && npx playwright test tests/template-testing.spec.js --workers=1
```
Expected: **5 passed**.

- [ ] **Step 4: Route still serves + git shows renames, not rewrites**

```bash
curl -s -o /dev/null -w "route=%{http_code}\n" http://localhost:3001/template-testing   # expect 200
cd "$(git rev-parse --show-toplevel)"
git add -A
git status                       # only components-v2 renames + app/template-testing/page.jsx
git diff --cached -M --stat | tail -40   # moved files show as renames (Rxx%), small import-only deltas
```
Expected: HTTP 200; `git status` shows renamed files under `components-v2/` plus a modified `page.jsx`; no other existing file changed.

- [ ] **Step 5: Commit (one atomic commit)**

```bash
git commit -m "$(cat <<'EOF'
refactor(miller-web): reorganize components-v2 into numbered type folders

Move every components-v2 component into 0N_level/<type>/ folders named by
reusable template type, rename exports to match filenames, and repoint all
imports. Pure move/rename — render output is byte-identical and the 5
/template-testing parity tests still pass.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Self-Review (run against the spec)

**1. Spec coverage** — spec §2 tree → Task 1 creates it; §3 rename map → Tasks 1 (paths) + 2 (exports); §4 import graph → Task 2 (internal) + Task 3 (page.jsx consumer); §5 constraints → enforced by Task 4 Steps 1 & 4 (stale-reference grep + git status); §6 verification → Task 4 Steps 2–4; §7 risks → Task 4 Step 1 grep catches the named failure class. No gaps.

**2. Placeholder scan** — no "TBD"/"similar to"/"handle edge cases". Every edit names the exact file, exact export change, exact import block, and exact JSX swap with occurrence counts.

**3. Identifier consistency** — every old→new export pair in Task 2 matches the reference table and the spec §3 map; every new import path in Tasks 2–3 matches the reference table. The one trap (multi-column-cta importing an unused `Eyebrow01`) is called out in Step 17's note with instructions to verify-and-omit.

## Notes / known traps for the implementer

- **Atomic, not incremental:** the app does not compile between Task 1 Step 2 and Task 4 — that's expected. Do not try to build/test mid-way; do not commit until Task 4.
- **`bento-grid-order` import styles differ:** `bento-grid-01.jsx` imports it **relative** (`./bento-grid-order`, same folder); `feature-card-01.jsx`/`feature-tile-01.jsx` import it **absolute** (`@/components-v2/06_sections/grids/bento-grid-order`, cross-folder). Both are correct.
- **JSX swaps only where the import was renamed.** Components whose names didn't change (Eyebrow01, StopPeriod01, ActionArrow01, NumToken01, HeadIntro01, FigureStat01, PlateStat01, CapItem01, MilestoneItem01, MissionBlock01, PhraseCycle01, StatCycle01, MarqueeBand01) need only their import *path* updated — no JSX edits.
- **Windows line endings:** `git mv` may emit LF→CRLF warnings; harmless.
