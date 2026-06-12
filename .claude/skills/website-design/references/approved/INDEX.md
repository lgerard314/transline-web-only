# Approved reference screenshots — index

These are the canonical rendered-pixel references for sections logan has rated as approved (currently the HOME page only, ~95% / the foundation). Agents consult the relevant shots here BEFORE building or modifying similar work — they show the real spacing, type scale, motion poses, and section handoffs that prose can't carry. They are evidence of the bar, not a substitute for the canon files.

**The refresh rule (process failure if skipped):** any change that alters the rendered appearance of an approved section MUST refresh that section's screenshots and its INDEX rows in the SAME commit as the change. A stale approved shot is worse than none — it teaches the wrong target. New pages/sections get rows here only when logan rates them done (the extraction pass in process.md).

## Capture protocol (used for every shot below; reuse it for refreshes)

- Shared dev server (miller-web on :3001), own fresh `chromium.launch()` per agent, closed after; desktop viewport 1440×900, no touch emulation.
- Walk to the section with REAL stepped scrolls (~400–600px, settle waits) so reveals/lazy images/pin choreography run honestly; never `scrollIntoView` through pinned runways.
- **Viewport screenshots only.** Element/locator screenshots are forbidden on this page — pinned sections corrupt them (the 07-history element shot stitched VBEC content + empty void; re-captured as viewport walk).
- Motion-defined sections get mid + settled poses, captured at probed frames (scrollY + rect + progress vars recorded below come from those probes).
- Every shot is Read (opened, looked at) by the coordinating agent before it lands here; rejects are re-captured, never kept.

Known artifact: the small dark "N" badge bottom-left in viewport shots is the Next.js dev-mode indicator, not page UI — ignore it.

## Home (route `/`, miller-web) — captured 2026-06-12, commit `c944d88`, viewport 1440×900

| # | Section (template) | Pose | File | Vocabulary device | Capture probe facts |
|---|---|---|---|---|---|
| 1 | Hero (`monument-hero-01`, `.mw-hero`) | rest, load-reveal settled | [01-hero-rest.png](home/01-hero-rest.png) | Monument hero entrance | title opacity 1.0 at capture; viewport at scroll 0 |
| 2 | Certs banner (`tall-static-banner-01`, `.mw-trust--tsb01`) | rest | [02-certs-rest.png](home/02-certs-rest.png) | ISO certs banner | band 176px tall, centered in frame; blue ISO seals are the sanctioned exception |
| 3 | Services roster (`roster-collage-02`, `.mw-roster2`) | rest, full section | [03-roster-rest.png](home/03-roster-rest.png) | Services roster + title-indent hover | full-height capture (section 1644px) |
| 3 | Services roster | hover on a list title | [03-roster-hover.png](home/03-roster-hover.png) | Services roster + title-indent hover (the micro-motion exemplar) | row name translates +10px X with letter-spacing 0.25px during hover |
| 4 | Sector diamonds (`sector-diamonds-04`, `.mw-secd`) | mid-assembly | [04-diamonds-mid.png](home/04-diamonds-mid.png) | Sector diamonds + spotlight | rect.top 320, pre-pin, diamonds in flight |
| 4 | Sector diamonds | settled (pinned) | [04-diamonds-settled.png](home/04-diamonds-settled.png) | Sector diamonds + spotlight (the utility-pin exemplar) | rect.top 0.0 pinned, `is-secd-pinned` set, all 4 diamonds + labels at rest |
| 5 | Lifetime band (`lifetime-reel-01`, `.mw-lr`) | mid-choreography | [05-lifetime-mid.png](home/05-lifetime-mid.png) | Lifetime band growth | pinned, center diamond mid-draw at 17%, chain assembly in progress |
| 5 | Lifetime band | settled | [05-lifetime-settled.png](home/05-lifetime-settled.png) | Lifetime band growth | `--lr-panel-w` 100%, `--lr-zoom` 1.4 (max), all three diamonds + captions complete |
| 6 | VBEC facility (`media-split-01`, `.mw-fac2`) | entrance (cream rising over walnut) | [06-vbec-entrance.png](home/06-vbec-entrance.png) | VBEC media split (pinned beats) | `--fac2-right-y` 65.4px, photo column mid-rise |
| 6 | VBEC facility | pinned mid (highlights grown, pre-swipe) | [06-vbec-pinned-mid.png](home/06-vbec-pinned-mid.png) | VBEC media split — THE medium-motion sweet-spot exemplar | pinned, `--fac2-fig-h` 164px (3 stats grown), media swipe not started |
| 6 | VBEC facility | settled (capability diamonds) | [06-vbec-settled.png](home/06-vbec-settled.png) | VBEC media split (pinned beats) | media swiped off (`--fac2-media-x` 1576px), truck + 8 diamonds at `--cap-sc`/`--cap-op` 1.0 |
| 7 | History (`timeline-split-01`, `.mw-ten3`) | rest — top (dark heading + timeline) | [07-history-rest.png](home/07-history-rest.png) | History timeline scrub | viewport walk shot 1/3, scrollY 8313 |
| 7 | History | rest — middle (mission + late entries + stats) | [07-history-rest-b.png](home/07-history-rest-b.png) | History timeline scrub | shot 2/3, scrollY 9163 |
| 7 | History | rest — end (stats + careers handoff) | [07-history-rest-c.png](home/07-history-rest-c.png) | History timeline scrub | shot 3/3, scrollY 9456 |
| 8 | Careers dive (`zoom-collage-01`, `.mw-czoom`) | pin engaged, pre-dive collage | [08-careers-enter.png](home/08-careers-enter.png) | Careers dive | rect.top −0.2, `--intro-out` 0.002 |
| 8 | Careers dive | mid-dive | [08-careers-dive-mid.png](home/08-careers-dive-mid.png) | Careers dive — the mechanism-pin exemplar | ~50% of dive distance, `--intro-out` 1.0, zoom converging |
| 8 | Careers dive | settled focal pose | [08-careers-settled.png](home/08-careers-settled.png) | Careers dive | `--reveal` 1.000, `--center-img-zoom` 1.0000 — landed AT the anchor |
| 9 | Affiliates banner (`rotating-banner-01`, `.mw-marquee`) | rest | [09-affiliates-rest.png](home/09-affiliates-rest.png) | Rotating affiliates banner | all 16 logos loaded; marquee animation reported idle in headless capture — it runs in real browsers |
| 10 | Final CTA (`multi-column-cta-01`, `.mw-final`) | rest (full visual unit + footer top) | [10-final-cta-rest.png](home/10-final-cta-rest.png) | Final CTA | headline + lead + CTAs + socials all probed in-frame |
