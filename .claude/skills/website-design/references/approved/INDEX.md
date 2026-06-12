# Approved reference screenshots — index

These are the canonical rendered-pixel references for sections logan has rated as approved (currently the HOME page only, ~95% / the foundation). Agents consult the relevant shots here BEFORE building or modifying similar work — they show the real spacing, type scale, motion poses, and section handoffs that prose can't carry. They are evidence of the bar, not a substitute for the canon files.

**Approval is per surface × viewport class** (classes defined in responsive.md: desktop / phone / tablet-portrait / tablet-landscape). Shots live under `<page>/<class>/` and exist ONLY for classes logan has rated — an unapproved class's screenshot here teaches the wrong target. Each page's heading states its approval scope.

**The refresh rule (process failure if skipped):** any change that alters the rendered appearance of an approved section MUST refresh that section's screenshots — in EVERY class that has shots of it — and its INDEX rows in the SAME commit as the change. A stale approved shot is worse than none. New pages/sections/classes get rows here only when logan rates them done (the extraction pass in process.md).

## Capture protocol (used for every shot below; reuse it for refreshes)

- Shared dev server (miller-web on :3001), own fresh `chromium.launch()` per agent, closed after; capture at the class's canonical dimensions (responsive.md): desktop 1440×900 fine-pointer; phone 390×844 DPR 3, tablet-portrait 834×1194, tablet-landscape 1194×834 — coarse classes with `isMobile: true, hasTouch: true`.
- Walk to the section with REAL stepped scrolls (~400–600px, settle waits) so reveals/lazy images/pin choreography run honestly; never `scrollIntoView` through pinned runways.
- **Viewport screenshots only.** Element/locator screenshots are forbidden on this page — pinned sections corrupt them (the 07-history element shot stitched VBEC content + empty void; re-captured as viewport walk).
- Motion-defined sections get mid + settled poses, captured at probed frames (scrollY + rect + progress vars recorded below come from those probes).
- Every shot is Read (opened, looked at) by the coordinating agent before it lands here; rejects are re-captured, never kept.

Known artifact: the small dark "N" badge bottom-left in viewport shots is the Next.js dev-mode indicator, not page UI — ignore it.

## Home (route `/`, miller-web) — **Approved: ALL viewport classes** (logan, 2026-06-12, "fully optimized at all views")

### desktop (1440×900) — captured 2026-06-12, commit `c944d88`

| # | Section (template) | Pose | File | Vocabulary device | Capture probe facts |
|---|---|---|---|---|---|
| 1 | Hero (`monument-hero-01`, `.mw-hero`) | rest, load-reveal settled | [01-hero-rest.png](home/desktop/01-hero-rest.png) | Monument hero entrance | title opacity 1.0 at capture; viewport at scroll 0 |
| 2 | Certs banner (`tall-static-banner-01`, `.mw-trust--tsb01`) | rest | [02-certs-rest.png](home/desktop/02-certs-rest.png) | ISO certs banner | band 176px tall, centered in frame; blue ISO seals are the sanctioned exception |
| 3 | Services roster (`roster-collage-02`, `.mw-roster2`) | rest, full section | [03-roster-rest.png](home/desktop/03-roster-rest.png) | Services roster + title-indent hover | full-height capture (section 1644px) |
| 3 | Services roster | hover on a list title | [03-roster-hover.png](home/desktop/03-roster-hover.png) | Services roster + title-indent hover (the micro-motion exemplar) | row name translates +10px X with letter-spacing 0.25px during hover |
| 4 | Sector diamonds (`sector-diamonds-04`, `.mw-secd`) | mid-assembly | [04-diamonds-mid.png](home/desktop/04-diamonds-mid.png) | Sector diamonds + spotlight | rect.top 320, pre-pin, diamonds in flight |
| 4 | Sector diamonds | settled (pinned) | [04-diamonds-settled.png](home/desktop/04-diamonds-settled.png) | Sector diamonds + spotlight (the utility-pin exemplar) | rect.top 0.0 pinned, `is-secd-pinned` set, all 4 diamonds + labels at rest |
| 5 | Lifetime band (`lifetime-reel-01`, `.mw-lr`) | mid-choreography | [05-lifetime-mid.png](home/desktop/05-lifetime-mid.png) | Lifetime band growth | pinned, center diamond mid-draw at 17%, chain assembly in progress |
| 5 | Lifetime band | settled | [05-lifetime-settled.png](home/desktop/05-lifetime-settled.png) | Lifetime band growth | `--lr-panel-w` 100%, `--lr-zoom` 1.4 (max), all three diamonds + captions complete |
| 6 | VBEC facility (`media-split-01`, `.mw-fac2`) | entrance (cream rising over walnut) | [06-vbec-entrance.png](home/desktop/06-vbec-entrance.png) | VBEC media split (pinned beats) | `--fac2-right-y` 60.3px, photo column mid-rise (refreshed 2026-06-12, capalt numeral-marker removal — lattice class, no visual delta) |
| 6 | VBEC facility | pinned mid (highlights grown, pre-swipe) | [06-vbec-pinned-mid.png](home/desktop/06-vbec-pinned-mid.png) | VBEC media split — THE medium-motion sweet-spot exemplar | pinned at P 0.130, `--fac2-fig-h` 164px (3 stats grown), `--fac2-media-x` 0 — swipe not started (refreshed 2026-06-12, capalt numeral-marker removal — lattice class, no visual delta) |
| 6 | VBEC facility | settled (capability diamonds) | [06-vbec-settled.png](home/desktop/06-vbec-settled.png) | VBEC media split (pinned beats) | still pinned at P 0.930, media swiped off (`--fac2-media-x` 1576px), truck + 8 diamonds at `--cap-sc`/`--cap-op` 1.000 (refreshed 2026-06-12, capalt numeral-marker removal — lattice class, no visual delta) |
| 7 | History (`timeline-split-01`, `.mw-ten3`) | rest — top (dark heading + timeline) | [07-history-rest.png](home/desktop/07-history-rest.png) | History timeline scrub | viewport walk shot 1/3, scrollY 8313 |
| 7 | History | rest — middle (mission + late entries + stats) | [07-history-rest-b.png](home/desktop/07-history-rest-b.png) | History timeline scrub | shot 2/3, scrollY 9163 |
| 7 | History | rest — end (stats + careers handoff) | [07-history-rest-c.png](home/desktop/07-history-rest-c.png) | History timeline scrub | shot 3/3, scrollY 9456 |
| 8 | Careers dive (`zoom-collage-01`, `.mw-czoom`) | pin engaged, pre-dive collage | [08-careers-enter.png](home/desktop/08-careers-enter.png) | Careers dive | rect.top −0.2, `--intro-out` 0.002 |
| 8 | Careers dive | mid-dive | [08-careers-dive-mid.png](home/desktop/08-careers-dive-mid.png) | Careers dive — the mechanism-pin exemplar | ~50% of dive distance, `--intro-out` 1.0, zoom converging |
| 8 | Careers dive | settled focal pose | [08-careers-settled.png](home/desktop/08-careers-settled.png) | Careers dive | `--reveal` 1.000, `--center-img-zoom` 1.0000 — landed AT the anchor |
| 9 | Affiliates banner (`rotating-banner-01`, `.mw-marquee`) | rest | [09-affiliates-rest.png](home/desktop/09-affiliates-rest.png) | Rotating affiliates banner | all 16 logos loaded; marquee animation reported idle in headless capture — it runs in real browsers |
| 10 | Final CTA (`multi-column-cta-01`, `.mw-final`) | rest (full visual unit + footer top) | [10-final-cta-rest.png](home/desktop/10-final-cta-rest.png) | Final CTA | headline + lead + CTAs + socials all probed in-frame |

### phone (390×844, DPR 3, touch) — captured 2026-06-12, commit `15bb981`

Pin behavior at this class: lifetime + VBEC FLOW (their pins are landscape-gated); careers PINS (mechanism pin, every surface); sector-diamonds pin is desktop-only. Hover poses don't exist on coarse classes. Captured with the dev portal hidden via client-side CSS.

| File | Pose / facts |
|---|---|
| [01-hero-rest.png](home/phone/01-hero-rest.png) | load-reveal settled, scroll 0 |
| [02-certs-rest.png](home/phone/02-certs-rest.png) | certs as a peek-scroll strip (edge-cut seals are the design); band centered |
| [03-roster-rest.png](home/phone/03-roster-rest.png) / [-b](home/phone/03-roster-rest-b.png) | stacked service cards, section top + one step deeper |
| [04-diamonds-settled.png](home/phone/04-diamonds-settled.png) | two-row diamond strip + labels, flowing |
| [05-lifetime-settled.png](home/phone/05-lifetime-settled.png) | one-row diamonds + caption, flow mode |
| [06-vbec-settled.png](home/phone/06-vbec-settled.png) | copy + stats + capabilities entering, flow mode — photo-card bottom 76.6px, `--capalt-p` 0.770; capability plates are MARKLESS (refreshed 2026-06-12, capalt numeral-marker removal — quiet plates, typography carries the row) |
| [07-history-rest.png](home/phone/07-history-rest.png) / [-b](home/phone/07-history-rest-b.png) / [-c](home/phone/07-history-rest-c.png) | 3-stop walk (~750px apart), -c shows the careers handoff |
| [08-careers-enter.png](home/phone/08-careers-enter.png) / [dive-mid](home/phone/08-careers-dive-mid.png) / [settled](home/phone/08-careers-settled.png) | pin engaged at rect.top 0 → mid-dive at ~50% runway → focal settled |
| [09-affiliates-rest.png](home/phone/09-affiliates-rest.png) | logo strip centered (peek-scroll) |
| [10-final-cta-rest.png](home/phone/10-final-cta-rest.png) | headline rect.top 99, socials in-frame |

### tablet-portrait (834×1194, DPR 2, touch) — captured 2026-06-12, commit `15bb981`

Pin behavior: same as phone (lifetime/VBEC flow, careers pins, diamonds no pin). Same file set as phone (15 shots) under [home/tablet-portrait/](home/tablet-portrait/) — notable probe facts: careers enter at track top −0.2 with cell `--s` 0.4167 (start state), dive-mid at 42% runway with cell `--s` 0.6538 and `--reveal` 0.000. 06-vbec-settled refreshed 2026-06-12 (capalt numeral-marker removal): photo-strip top 59.3px, `--capalt-p` 0.612, capability plates markless.

### tablet-landscape (1194×834, DPR 2, touch) — captured 2026-06-12, commit `15bb981`

Pin behavior: lifetime + VBEC PIN at this class (landscape gates pass) — so it carries their mid poses; sector-diamonds still flows (desktop-only pin). 17 shots under [home/tablet-landscape/](home/tablet-landscape/): the phone/tabport set PLUS [05-lifetime-mid.png](home/tablet-landscape/05-lifetime-mid.png) (second diamond mid-draw) and [06-vbec-pinned-mid.png](home/tablet-landscape/06-vbec-pinned-mid.png) (`--fac2-fig-h` 141px grown, `--fac2-media-x` 0 — pre-swipe; refreshed 2026-06-12, capalt numeral-marker removal — lattice class, no visual delta). Other probed poses: 05-lifetime-settled with all three diamonds + captions and VBEC not yet covering (fac2 top 1011 > viewport); 06-vbec-settled at `--cap-op`/`--cap-sc` 1.000 still pinned (P 0.942, `--fac2-media-x` 1312.4px; refreshed 2026-06-12, capalt numeral-marker removal — lattice class, no visual delta); 08-careers dive-mid at `--center-img-zoom` 1.1030 / `--reveal` 0.000, settled at 1.0000 / 1.000 with the stage still filling the frame.
