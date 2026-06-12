# Motion — contracts, recipes, and the proven vocabulary

EVERY page ships motion, and the vast majority of it is scroll-based. The white-owl HOME page is the ceiling — an entrance keyframe suite on the hero plus five-plus pinned/scrubbed sections (sectors, services roster, lifetime, VBEC facility, history, careers dive) — and it is the reference for what the vocabulary looks like executed well. Interior pages run lighter but NEVER motionless. New APPLICATIONS of proven mechanics, never new mechanics (novel mechanisms are a flag-to-user decision). Every animation ships a reduced-motion off-switch whose rest state is the SETTLED/COMPLETE pose — and `prefers-reduced-motion` is the ONLY thing that disables motion; small viewports ADAPT it, never strip it (see "Reflow changes the motion contract" in responsive.md).

## Motion sizes (logan's taxonomy, 2026-06-12) — budget by SIZE, not count

Scroll-based motion comes in three sizes, and a page's budget is a MIX of them:

- **LARGE** — section-pinning-level choreography and stage transformations (the careers dive, the lifetime band growth, VBEC's pinned beat sequence). Big commitments: rare, purposeful, mostly home-tier; on interior pages a large motion is a deliberate page-signature decision.
- **MEDIUM — the sweet spot.** Container/composition-scale moments like the VBEC photos container assembling: a designed group of elements arriving/transforming on a scrub, inside a section that otherwise flows. This is the backbone of interior-page motion — when in doubt, build a medium.
- **SMALL** — title/header/text-level touches: reveals, stagger-ins, marker accents on headings. Cheap, frequent, fine on almost every section.

**Hover motion is a SEPARATE category from scroll motion** — and unlike scroll moments (which vary per section), hover behavior should be CONSISTENT per element type across the site (cards lift the same way everywhere, links arrow the same way, titles indent the same way). Design hover systems per element class, not per section — and don't underrate the micro-motions (a title indenting on hover, an arrow nudging, a diamond filling): those small touches are a large part of what makes a page feel alive, and their site-wide consistency is part of the home-foundation grammar (design-language.md).

**Hover effects never change their parent container's size (logan, 2026-06-12).** A hover may transform, recolor, reveal, or redistribute space INSIDE a fixed box (the roster/rail cards' 0fr→1fr reveals work because the card's aspect ratio is fixed — the title slides up, the card doesn't grow), but it must never grow the element's own outer box and push siblings/layout around. A reveal whose container grows on hover is a layout-shift machine — killed at the fleet T2 proposal.

**Photo hover splits by LINK-NESS (logan, 2026-06-12).** The zoom/bar-grow photo hover grammar belongs to LINKED photos/cards only — a hover effect on a photo that goes nowhere promises a click that doesn't exist. Non-link photos instead carry MOUSE-TRACKING PARALLAX once rendered: the shared `useMouseParallax` hook (miller-web `components/useMouseParallax.js`) writes `--mpx/--mpy` (−1…1) on the tracked figure, and the consumer's CSS drifts the img ±7–8px after the cursor against a ~1.06 scale headroom with a slow ease (~600ms house bezier), returning softly to center on leave. Fine-pointer hover surfaces only; the hook never attaches under reduced motion and the transform block is gated to no-preference (worked refs: CWC fleet photos, stream-index swap photo).

**Scroll-reveal coverage floor (logan, 2026-06-12).** "Most things should have some sort of on-scroll reveal motion": lists ALWAYS (per-item arrival — stagger, slices, or row reveals), and most text blocks too. Pressure valve: when one column/side of a section carries an effect, the other side may rest. Sections whose items already arrive via a scrub slice are covered; the failure mode is a block of meta/body text that just sits there while its neighbors move. Interior pages get this breadth of SMALL/MEDIUM motion — the big pinned choreography stays home-only.

## Two targets, one progress source

Scroll motion has two animation targets, and naming which one you're building keeps choreography coherent:

- **Stage-level** — the section's own frame/canvas transforms: container geometry grows, the background erases/swaps, the boundary moves (home lifetime band expanding; VBEC's cream surface erasing the walnut). The motion changes the section's GEOMETRY or GROUND.
- **Element-level** — the frame holds still and choreographed pieces move within it on slices of the progress (VBEC's rising photo column, gantt bars drawing, the marker sweep, portfolio assembly).

They compose, and the discipline is ONE progress source per section: a single flow-writer (or pin runway) writes one `p`; stage-level effects consume `p` directly, element-level effects consume per-item slices of the same `p` — that's why layers never drift. The progress source itself (scrub-through vs pin-held runway) is orthogonal: both targets run on either (careers dive = stage-level on a pin; gantt = element-level on a scrub; VBEC = both targets on a pin).

The split predicts responsive behavior: stage-level motion changes section geometry, so it drives pin decisions and seam interactions (the pin motion test largely asks "is the stage transformation the mechanism, or just a hold?"); element-level motion lives inside stable geometry and degrades gracefully into flow-mode entry scrubs.

## Motion contracts (write one per effect, before coding)

A contract = progress source + exact geometric anchors, in one sentence. Example: "p = (viewportBottom − stageTop)/stageHeight; the wipe completes EXACTLY when the stage's bottom meets the viewport bottom."

- **Anchors are rect events** (section bottom == viewport bottom; title top == viewport bottom; band fully visible) — never tuned scroll thresholds. Assert the anchor frame in the verify script (`p === 1.000` with the element at the viewport edge).
- **"In position by X" means landing AT that frame.** Spread per-item slices across the whole runway so assembly is visibly in progress the entire approach — finishing early is as wrong as finishing late.
- **Ordering guarantees derive from geometry** (slice math), so they can't drift.
- **Perceptible or it doesn't exist.** Variables provably changing ≠ an effect. Judge mid-scrub frames BY EYE via the sequential short-step screenshot walk (verification.md — ~200–600px scroll increments across the whole runway); an invisible layer animating, or a draw completing below the fold, counts as missing.

## The flow-writer recipe (the workhorse scrub)

JS: rAF-coalesced passive scroll listener writes a 0→1 progress var on the section (`--<ns>-p`), p = clamp((vh − rect.top)/rect.height); add a resize listener and an IntersectionObserver requeue (rootMargin ~300px) to survive programmatic jumps; early-return when `prefers-reduced-motion: reduce`.

CSS: per-item slice `--t: clamp(0, calc((var(--<ns>-p, 1) - var(--thr)) / LEN), 1)` — the var DEFAULTS TO 1 so no-JS and reduced-motion rest settled. Gate transforms/clips under `@media (prefers-reduced-motion: no-preference)` so the base rule is the settled pose.

Proven slice cadence for N=4 items: `thr = 0.07 + i·0.20`, `LEN = 0.33` → completions land at 0.40/0.60/0.80/1.00 with overlap and no dead zones. General form for any N: pick the first completion `C0` (≈0.40 keeps assembly visible early without being instant), then `step = (1 − C0)/(N − 1)`, `LEN ≈ 1.65·step` (the overlap), `thr_i = C0 − LEN + i·step` — completions land at `C0 + i·step` with the last at exactly 1.00. (Check against N=4: C0=0.40 → step 0.20, LEN 0.33, thr_0 0.07.)

Worked applications (all probe-verified): bar/gantt draws via `clip-path: inset(0 calc((1−t)·100%) 0 0)` (clip, not scaleX — scaleX squishes texture); marker sweeps via `background-size: calc(t·100%) H%` on an inline span (continues across line-break fragments); before/after wipes via clip-path on the top image with a seam element at `left: calc(t·100%)` whose opacity is `min(t, 1−t)·k` so it hides at both extremes; milestone pops via a steeper sub-slice of the tail (`(t − 0.85)/0.15`).

## The single-clock pattern (cycling devices)

One `setInterval` in the section owns the index; every synced surface (highlighted step, rail fill, notification feed component) renders from that ONE index so nothing drifts. Reduced motion: never start the clock — freeze at index 0 with the first state visible. Cause-before-effect: put `transition-delay` on the DESTINATION state's rule only (fill arrives, THEN the station lights, ~400ms).

## Derive vs measure (two hard-won failure modes)

- Plain percentage positioning ignores grid gaps — gap-aware calc: `--fillw: calc((100% - (N−1)·gap)/N · (i+0.5) + gap·i)`.
- A linear `idx/(N−1)` fraction along a rail assumes evenly-spread stops; uneven content heights make it overshoot progressively (+80px by the last stop in one real case). When geometry is content-driven, MEASURE it (offsetTop via layout effect + ResizeObserver writing px vars) instead of deriving it.
- 3+-element compositions are computed on paper and pairwise-probed at proven frames — never eyeballed.

## Hover/reveal coexistence

The reveal element and the hover-transform element must be DIFFERENT nodes (reveal fill-mode overrides hover transforms): `data-reveal` on the wrapper, hover transform on the inner card. When CSS reorders layout, reveal cascades follow VISUAL order (sort targets by on-screen position), not DOM order.

## Pins — know WHY a section pins before touching it

Pins exist for different REASONS, and the reason decides everything downstream:

- **Mechanism pins** — the choreography IS the hold (the careers dive's full-screen convergence). These pin on every surface; only layout adapts.
- **Utility/fit pins** — the pin exists as a fit guarantee, not spectacle: home's who-we-serve pins on desktop only so the photo grid's spotlight labels can't get cut off (the margin of error was too small without it). These are engineering safety, never carried to surfaces that don't have the fit problem, and a layout change that removes the fit risk can remove the pin.
- **Stage-transformation pins** — the hold gives a stage-level transformation (growth, erasure) room to play (lifetime, VBEC).

Pin-vs-flow is decided by the MOTION TEST, not a blanket rule: a pin that merely holds an oversized static composition never pins on portrait (gate on orientation/min-height/no-preference, mirrored in JS); a mechanism pin pins everywhere. A pin FREEZES geometry-driven scrubs at its engagement frame — any scrub inside a pinned section must complete exactly AT or before the pin point (this shipped a real failure when missed). Full derivation lives in the white-owl playbook (`white-owl-responsive-playbook.md` §0/§3).

**Parallax is contextual, not blanket-sanctioned:** on a static-scrollable section (no stage transformation) a subtle parallax layer is a reasonable medium-tier proposal; on a section whose stage already transforms (growth, erasure, pin choreography) adding parallax is a heavier, different decision. When the combination is novel for this site, flag it to the user instead of shipping it.
