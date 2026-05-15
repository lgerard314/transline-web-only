# Miller Environmental web rebuild — phase plan overview

Companion to [`2026-05-15-miller-web-design.md`](2026-05-15-miller-web-design.md) §9.

## Phase index

| # | File | Theme | Tasks | Parallelism |
| - | ---- | ----- | ----- | ----------- |
| 01 | [`miller-web-phase-01.md`](miller-web-phase-01.md) | Foundation: shared package + workspace rewire + Miller scaffold | 5 | Sequential — each task gates the next |
| 02 | [`miller-web-phase-02.md`](miller-web-phase-02.md) | Miller components + page templates | 5 | **Fully parallel** — five independent clusters |
| 03 | [`miller-web-phase-03.md`](miller-web-phase-03.md) | Thin pages (20 routes) | 5 | **Fully parallel** — page-per-task |
| 04 | [`miller-web-phase-04.md`](miller-web-phase-04.md) | Rich pages (Home, Treatment, Remediation, QA, Careers) | 5 | **Fully parallel** — page-per-task |
| 05 | [`miller-web-phase-05.md`](miller-web-phase-05.md) | Polish: SEO, a11y, perf, lint, commit | 5 | Sequential — verification gates |

Total: **5 phases × 5 tasks = 25 tasks.**

## Why this order

The user asked: "structure it so any phase-plans that can be executed in parallel (no dependencies) are put in the earlier phase-plans."

- **Phase 01** must be first regardless — every later phase depends on the shared package existing and Miller's app scaffold compiling.
- **Phases 02, 03, 04** are each internally parallel — no inter-task dependencies once phase 01 lands. They are the bulk of the work, positioned as early as possible (immediately after 01).
- **Phase 05** is necessarily last — it's verification + polish, requires everything else to exist.

If a fleet of agents is available, the optimal execution is:
1. One agent runs phase 01.
2. Five agents run phase 02 in parallel (one per task cluster).
3. Five agents run phase 03 in parallel.
4. Five agents run phase 04 in parallel.
5. One agent runs phase 05.

Phases 02 + 03 + 04 cannot easily collapse into one mega-phase: phase 02
must finish before phase 03 (pages need templates), and phase 03 must mostly
finish before phase 04 (the rich pages reuse some thin-page content modules
and the `brand.js` refrains are first defined in 04.1).

Within each parallel phase, the five tasks are sized to take roughly equal
time so the fleet doesn't bottleneck on one slow task.

## Dependencies summary

```
01.1 → 01.2 → 01.3 → 01.4 → 01.5
                              ↓
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
       02.1                  02.2                  02.3, 02.4, 02.5
        └─────────┬───────────┘──────────────────────┘
                  ↓
        ┌─────────┼─────────┬─────────┐
        ↓         ↓         ↓         ↓
       03.1     03.2     03.3      03.4, 03.5
        └────────┬──────────┘─────────┘
                 ↓
        ┌────────┼─────────┬─────────┐
        ↓        ↓         ↓         ↓
       04.1    04.2      04.3      04.4, 04.5
        └─────────┬─────────┘─────────┘
                  ↓
        05.1 → 05.2 → 05.3 → 05.4 → 05.5
```

Phase 04.1 (`lib/content/brand.js`) must run before the other phase-04 tasks
since they import from it.

## Non-goals (carried from the spec)

- No push to `origin/main`. We are on `origin/dev`; pushes to dev are fine.
- No new CSS class renames (`tl-*` stays).
- No invented stat counter values.
- No backend/CMS integration.

## What was resolved between spec drafts and this overview

- **WordPress media migration is done.** 83 images downloaded on 2026-05-15
  and live under `apps/miller-web/public/miller/`. Spec §4.4 + Non-goals
  updated. Phase 02 onward references local paths via `lib/photos.js` and
  uses `next/image`.
- **All 32 published routes are real content.** The second scrape pass
  captured the 4 case-study detail pages and 2 job postings the first pass
  treated as stubs. No `generateStaticParams` is used; each route ships its
  own content module. Phase 03 picks up the additional routes.
