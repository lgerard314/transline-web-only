# Design spec — components-v2 type-folder refactor

- **Date:** 2026-06-02
- **Status:** Approved (design); implementation plan to follow.
- **App:** `apps/miller-web`
- **Type:** Pure structural refactor — move/rename files + rename exports + rewrite imports. **Zero render-logic changes.**

## 1. Goal

Reorganize `apps/miller-web/components-v2/` from abstraction-tier folders (`items/`, `blocks/`, `widgets/`, `sections/`) into **numbered level folders, each containing type-subfolders**, with files named by reusable template *type* (not by the page/content they currently happen to serve). Exported component function names are renamed to match their new filenames. The rendered output is byte-identical — `/template-testing` looks and behaves exactly as it does now, and all parity tests still pass.

The intent is a reusable, Elementor-style library where you find a component by what it *is* (`banners/rotating-banner-01`) rather than by where it was first used (`affiliates-banner`).

## 2. Structure

`components-v2/<NN_level>/<type>/<name>-<NN>.jsx`

- The numeric **level prefix** preserves the small→large ladder (marks → buttons → cards → blocks → widgets → sections) that the old tier names encoded.
- Each level contains **type-subfolders**; single-file type folders are intentional expansion slots (a future second eyebrow drops into `01_marks/eyebrows/` with no further refactor).
- Flat files inside type folders — **no more `index.jsx` per-component folders.**
- Every file keeps its `-NN` version suffix so variants (`rotating-banner-02`, …) can join later.

```
components-v2/
  01_marks/
    eyebrows/     eyebrow-01.jsx
    stops/        stop-period-01.jsx · stop-text-01.jsx
    arrows/       action-arrow-01.jsx
    text/         nobr-01.jsx · num-token-01.jsx
  02_buttons/
    solid/        solid-cta-01.jsx
    ghost/        ghost-phone-cta-01.jsx
  03_cards/
    feature/      feature-anchor-01.jsx · feature-card-01.jsx · feature-tile-01.jsx
    download/     download-card-01.jsx
    note/         note-card-01.jsx
    icon-link/    icon-link-01.jsx
  04_blocks/
    heads/        head-intro-01.jsx
    stats/        figure-stat-01.jsx · plate-stat-01.jsx · cap-item-01.jsx
    list-items/   milestone-item-01.jsx
    prose/        mission-block-01.jsx
  05_widgets/
    cycles/       phrase-cycle-01.jsx · stat-cycle-01.jsx
    galleries/    thumb-gallery-01.jsx · hover-card-01.jsx
    timelines/    vertical-timeline-01.jsx
    marquees/     marquee-band-01.jsx
  06_sections/
    banners/      tall-static-banner-01.jsx · rotating-banner-01.jsx
    heroes/       monument-hero-01.jsx
    grids/        bento-grid-01.jsx · bento-grid-order.js · hover-card-grid-01.jsx
    splits/       media-split-01.jsx · timeline-split-01.jsx
    callouts/     photo-bleed-cards-01.jsx · multi-column-cta-01.jsx
```

Decisions captured during brainstorming: granularity is **uniform** (type-subfolders everywhere, single-file folders welcome); `timelines/` is its own folder (a future `step-processes/` becomes a sibling, not created now); `galleries/` holds both image-swappers (`thumb-gallery`, `hover-card`); section-types are subfolders of `06_sections/` because "a banner is a type of section."

## 3. Full rename map (old → new path + export)

| Old path | New path | Old export → New export |
|---|---|---|
| items/eyebrow-01.jsx | 01_marks/eyebrows/eyebrow-01.jsx | Eyebrow01 → Eyebrow01 |
| items/stop-period-01.jsx | 01_marks/stops/stop-period-01.jsx | StopPeriod01 → StopPeriod01 |
| items/stop-text-01.jsx | 01_marks/stops/stop-text-01.jsx | StopText01 → StopText01 |
| items/action-arrow-01.jsx | 01_marks/arrows/action-arrow-01.jsx | ActionArrow01 → ActionArrow01 |
| items/nobr-01.jsx | 01_marks/text/nobr-01.jsx | Nobr01 → Nobr01 |
| items/num-token-01.jsx | 01_marks/text/num-token-01.jsx | NumToken01 → NumToken01 |
| items/cta-solid-01.jsx | 02_buttons/solid/solid-cta-01.jsx | CtaSolid01 → SolidCta01 |
| items/cta-ghost-phone-01.jsx | 02_buttons/ghost/ghost-phone-cta-01.jsx | CtaGhostPhone01 → GhostPhoneCta01 |
| blocks/service-anchor-01.jsx | 03_cards/feature/feature-anchor-01.jsx | ServiceAnchor01 → FeatureAnchor01 |
| blocks/service-card-01.jsx | 03_cards/feature/feature-card-01.jsx | ServiceCard01 → FeatureCard01 |
| blocks/service-tile-01.jsx | 03_cards/feature/feature-tile-01.jsx | ServiceTile01 → FeatureTile01 |
| blocks/cert-card-01.jsx | 03_cards/download/download-card-01.jsx | CertCard01 → DownloadCard01 |
| blocks/careers-card-01.jsx | 03_cards/note/note-card-01.jsx | CareersCard01 → NoteCard01 |
| blocks/social-link-01.jsx | 03_cards/icon-link/icon-link-01.jsx | SocialLink01 → IconLink01 |
| blocks/head-intro-01.jsx | 04_blocks/heads/head-intro-01.jsx | HeadIntro01 → HeadIntro01 |
| blocks/figure-stat-01.jsx | 04_blocks/stats/figure-stat-01.jsx | FigureStat01 → FigureStat01 |
| blocks/plate-stat-01.jsx | 04_blocks/stats/plate-stat-01.jsx | PlateStat01 → PlateStat01 |
| blocks/cap-item-01.jsx | 04_blocks/stats/cap-item-01.jsx | CapItem01 → CapItem01 |
| blocks/milestone-item-01.jsx | 04_blocks/list-items/milestone-item-01.jsx | MilestoneItem01 → MilestoneItem01 |
| blocks/mission-block-01.jsx | 04_blocks/prose/mission-block-01.jsx | MissionBlock01 → MissionBlock01 |
| widgets/phrase-cycle-01/index.jsx | 05_widgets/cycles/phrase-cycle-01.jsx | PhraseCycle01 → PhraseCycle01 |
| widgets/stat-cycle-01/index.jsx | 05_widgets/cycles/stat-cycle-01.jsx | StatCycle01 → StatCycle01 |
| widgets/gallery-thumb-01/index.jsx | 05_widgets/galleries/thumb-gallery-01.jsx | GalleryThumb01 → ThumbGallery01 |
| widgets/sector-card-01/index.jsx | 05_widgets/galleries/hover-card-01.jsx | SectorCard01 → HoverCard01 |
| widgets/timeline-vertical-01/index.jsx | 05_widgets/timelines/vertical-timeline-01.jsx | TimelineVertical01 → VerticalTimeline01 |
| widgets/marquee-band-01/index.jsx | 05_widgets/marquees/marquee-band-01.jsx | MarqueeBand01 → MarqueeBand01 |
| sections/certs-banner-01/index.jsx | 06_sections/banners/tall-static-banner-01.jsx | CertsBanner01 → TallStaticBanner01 |
| sections/affiliates-banner-01/index.jsx | 06_sections/banners/rotating-banner-01.jsx | AffiliatesBanner01 → RotatingBanner01 |
| sections/hero-01/index.jsx | 06_sections/heroes/monument-hero-01.jsx | Hero01 → MonumentHero01 |
| sections/services-01/index.jsx | 06_sections/grids/bento-grid-01.jsx | Services01 → BentoGrid01 |
| sections/services-01/service-order.js | 06_sections/grids/bento-grid-order.js | splitTitle, homeServiceOrder (unchanged) |
| sections/sectors-01/index.jsx | 06_sections/grids/hover-card-grid-01.jsx | Sectors01 → HoverCardGrid01 |
| sections/facility-01/index.jsx | 06_sections/splits/media-split-01.jsx | Facility01 → MediaSplit01 |
| sections/history-01/index.jsx | 06_sections/splits/timeline-split-01.jsx | History01 → TimelineSplit01 |
| sections/careers-01/index.jsx | 06_sections/callouts/photo-bleed-cards-01.jsx | Careers01 → PhotoBleedCards01 |
| sections/final-cta-01/index.jsx | 06_sections/callouts/multi-column-cta-01.jsx | FinalCta01 → MultiColumnCta01 |

## 4. Import rewrites (dependency graph)

Every `@/components-v2/...` import path changes, and where the imported export was renamed, the imported identifier changes too. The internal dependencies that must be rewritten:

- **monument-hero** ← PhraseCycle01, StopPeriod01, SolidCta01, GhostPhoneCta01, ActionArrow01
- **tall-static-banner** ← DownloadCard01
- **bento-grid** ← bento-grid-order (homeServiceOrder), HeadIntro01, FeatureAnchor01, FeatureCard01, FeatureTile01
- **bento-grid-order** ← (no components; imports `@/lib/services`, `@/lib/content/template-testing-home`)
- **head-intro** ← Eyebrow01
- **feature-anchor** ← NumToken01
- **feature-card** ← NumToken01, bento-grid-order (splitTitle)
- **feature-tile** ← NumToken01, bento-grid-order (splitTitle)
- **hover-card-grid** ← Eyebrow01, StatCycle01, HoverCard01
- **media-split** ← Eyebrow01, SolidCta01, ActionArrow01, FigureStat01, CapItem01, ThumbGallery01
- **cap-item** ← NumToken01
- **timeline-split** ← Eyebrow01, VerticalTimeline01, PlateStat01, MissionBlock01
- **vertical-timeline** ← MilestoneItem01
- **mission-block** ← ActionArrow01
- **photo-bleed-cards** ← Eyebrow01, NoteCard01
- **note-card** ← ActionArrow01
- **rotating-banner** ← MarqueeBand01
- **multi-column-cta** ← StopText01, SolidCta01, GhostPhoneCta01, ActionArrow01, IconLink01 (also imports `Eyebrow01` but does not use it — the eyebrow is inlined)
- **leaf files** (eyebrow, stop-period, stop-text, action-arrow, nobr, num-token, solid-cta, ghost-phone-cta, download-card, icon-link, figure-stat, plate-stat, milestone-item, phrase-cycle, stat-cycle, thumb-gallery, hover-card): no components imported (some import `next/link` or `@white-owl/brand/components`, which are unchanged).

**External consumer (the only file outside `components-v2/` that changes):** `apps/miller-web/app/template-testing/page.jsx` imports all 9 section components — every path + identifier updates (e.g. `import { Hero01 } from "@/components-v2/sections/hero-01"` → `import { MonumentHero01 } from "@/components-v2/sections/heroes/monument-hero-01"`).

Content imports (`@/lib/services`, `@/lib/certs`, `@/lib/content/brand`, `@/lib/content/template-testing-home`, `@/app/(home)/home`) and brand imports are **unchanged**.

## 5. Constraints

- **Only `components-v2/**` files move/rename, and `app/template-testing/page.jsx` updates its imports.** No other existing file changes — not `lib/`, not `app/(home)/`, not `components/`, not styles.
- **No render-logic edits.** The body of every component (JSX, hooks, class strings, `data-reveal` placement, intervals) is identical before and after; only the function *name*, the `import` lines, and the file location change.
- Use `git mv` so history follows each file.
- `"use client"` directives stay on the same (now-moved) widget files.

## 6. Verification

- `npm run build` (or dev-server compile) succeeds with no unresolved imports.
- All 5 tests in `apps/miller-web/tests/template-testing.spec.js` still pass.
- `/template-testing` returns 200 and is visually unchanged (the parity already established holds — this refactor changes no output).
- `git status` shows only renames under `components-v2/` + the one `page.jsx` edit; `git diff -M` shows the moved files as renames with import-only content changes.

## 7. Risks

- **Broken import path/identifier** → build failure. Mitigation: the dependency graph in §4 is the checklist; verify with a build + the parity tests before commit.
- **Stale reference to an old export name** (e.g. an importer still says `Hero01`) → build failure caught by the build step.
- **`git mv` into not-yet-created dirs** → create the folder tree first (or rely on `git mv` creating parents).
- Low blast radius overall: the route is a noindex sandbox, output is unchanged, and the build step catches the only realistic failure class (import wiring).
