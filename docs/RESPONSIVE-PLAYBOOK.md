# Responsive translation playbook — get it right on the first pass

**Read this in full before optimizing ANY designed section for non-desktop viewports.** It was distilled from the 2026-06 miller-web home responsive pass, where nearly every round of rework traced to one of a small set of repeatable process failures — all of them preventable by following this doc. The verification protocol lives in the root `CLAUDE.md` ("How to verify responsive work") and is mandatory; this doc covers the part that comes BEFORE verification: how to design the translation correctly the first time, how to specify motion, and the implementation recipes that are now house patterns (each with a worked in-repo reference).

The failure tax this doc exists to prevent, by actual count from that session: the VBEC section was rebuilt three times because the first attempt re-skinned an inherited mobile layout instead of translating the desktop design; the Lifetime section's motion took three rounds because a token "background zoom" was substituted for the desktop's expanding-panel entrance; the capability rail's timing was redone twice because "in position by X" was read as "allowed to finish any time before X"; and one shipped-broken phone layout came from deleting CSS without checking what it was neutralizing.

## 0. The standing contract (applies to every section, both apps)

- **Desktop IS the design.** logan designs on desktop; the desktop render is the brief. Desktop must not change at all during responsive work — every edit sits behind width/orientation/pointer gates, and desktop byte-invariance is re-verified every round.
- **The bar, per section per viewport:** "is this an exceptional, high-end, expensive-looking website that is potentially award-winning?" Not "does it fit."
- **Surfaces:** desktop / small desktop–big tablet / tablet / phone (~460 nominal, flexible per component) — crossed with orientation and pointer type. Portrait is the dominant real-world orientation on tablets and phones; design portrait first among the small surfaces.
- **Only the home hero is ever 100vh on portrait. Pins are landscape-only, period** (full rule + recipe in §4.1).
- **Motion is scroll-tied, not autonomous.** The house language is scroll-scrubbed choreography; the only "live" animations are small one-shot reveals. Horizontal thumb-scrollable rails/strips are welcome on small screens.

## 1. Phase one — the desktop-intent inventory (mandatory, before any edit)

Render the section on desktop (the live page, not the code) and write down, explicitly:

1. **Every component and what it is FOR** — eyebrow, title, lead, CTAs, each media element, figures, ornaments, frames/containers, background graphics. A white card around photos is chrome with a job; a background map is a stage; a sliver gallery is a curated one-open reveal. If you can't say what a component is for, you can't translate it.
2. **Every motion beat, in order, with its trigger and what it COMMUNICATES.** The Lifetime panel growing from a small opaque-map box into the full band is not decoration — it IS the section's identity, and "add back the motion" meant porting THAT, not adding a generic zoom. Write the desktop choreography as a sequence ("intro slides down → photo column rises → highlights grow → media swipes right → diamonds roll in") so each beat can be deliberately kept, re-staged, or consciously dropped per surface.
3. **Every interaction state** — hover, active, selected, expanded — what it reveals, and whether the content it reveals is reachable without a fine pointer.

Then write the **translation plan per surface** before touching code: for each inventory item, decide keep / re-stage / re-orient / replace — and say where its motion goes. Two hard rules here:

- **Never accept an existing smaller-viewport layout as the brief.** It is usually an artifact of an earlier pass, not a design. Optimizing the VBEC mobile photo wall (instead of translating the desktop's one-open hero + sliver gallery) was this session's worst failure.
- **Content behind hover must survive on touch as content, not disappear.** Hover-revealed detail becomes tap-to-select with an explicit way OFF (outside-tap clear); grayscale-until-hover photo treatments become full-color at rest on touch (otherwise the un-hoverable surface is stranded permanently in the "waiting" state).

## 2. Phase two — the design vocabulary (approved moves; reach for these first)

These are patterns logan asked for or explicitly approved this pass. They are the house starting points for narrow-surface translation, not an exhaustive limit.

- **Horizontal snap rails / film strips** for photo sets and card sets: ~62–84vw cards, scroll-snap, hidden scrollbar, the **next card partially peeking** as the swipe affordance. No stacked-image walls, ever, on any page — a wall of full-width images with no purpose other than being images is banned.
- **Edge bleeds are directional and meaningful.** On the home VBEC, photos bleed off the RIGHT screen edge and the capability rail bleeds off the LEFT — mirrored full-bleeds bookend the column and read as deliberate. A bleed edge and a peek edge are different jobs: the bleed signals "this strip extends beyond the page," the peek signals "swipe me." Don't put both jobs on the same edge by default.
- **A scroller's rest pose and reading direction are part of the spec.** Ask (or infer from the bleed direction): which item is fully visible at rest, at which edge, and which way does the thumb travel through the sequence? (The capability rail rests with card #1 flush at the content-right edge, #7 furthest off the left bleed, and a left-to-right swipe travels 1→7 — built with `row-reverse`, see §4.6.)
- **White media cards** (the desktop card chrome) survive on phones: warm surface + hairline + shadow, the card's leading edge extending slightly into the gutter while the first photo's edge stays exactly on the content line, the frame consistent on three sides and **absent on the bleeding side until the last item is reached** (end padding seats the final photo with the same inset).
- **Adjacent sections must not repeat a motif.** A vertical capability spine directly above the history section's vertical timeline spine was rejected purely for that adjacency — check the neighbors before committing a treatment.
- **Legibility beats geometry.** When a desktop graphic taxes its content at column width (capability names wrapping 4 lines at 11px inside a 100px rhombus; detail copy behind an undiscoverable tap), re-stage the CONTENT comfortably (cards, rails, rows) and keep the graphic's DNA — same tones, numbering, diamond marks — rather than shrinking the graphic until the content suffocates.
- **Staggered/zigzag label rows** buy type size: alternating items drop ~half an element height so neighbors clear each other's baseline and the type can grow 20–30%.
- **Type on portrait is bigger than you think.** Display titles ≈34–50px at 390–720 and wrapping to 3–4 lines is welcome; one-column card titles ≈30px (a 24px title that "passed" was later bumped +25% on request); body ≥14px; mono labels/details ≥11–12px floors. When torn between two sizes, take the larger — every type-size correction this session was "bigger."
- **Spacing beats compression.** Each visual beat of a section (eyebrow / media / labels / heading) needs a real pause — 6–16px gaps between beats read as "compressed" and were called out. And in flow (un-pinned) mode, a panel edge and the content start often coincide by construction; flowing surfaces need explicit in-panel insets (≈34–50px top, ≈40–80px bottom) — see §4.7.

## 3. Phase three — motion contracts (write them before coding)

For every motion on a flow surface, write a one-line contract: **progress source → start anchor → end anchor**, where both anchors are **exact geometric events**, not tuned thresholds.

- **Anchor vocabulary that shipped** (all as `p = clamp01(...)` formulas in a writer, §4.2): "p hits 1 exactly when the section bottom meets the viewport bottom" (`(vh − top) / (secBottom − top)`); "completes when the title's top reaches the viewport bottom"; "completes when the band is fully on-screen"; "starts when the top half of the start-pose box is visible."
- **"In position by the time X passes the bottom of the screen" means: lands AT that exact frame, with assembly VISIBLY IN PROGRESS the whole approach.** Finishing early is as wrong as finishing late — spread per-item slices across the full runway so the last item settles at p=1.000, not at p=0.6. This was corrected twice; treat it as the default reading of any "by the time" spec.
- **Derive ordering guarantees from geometry, not tuning.** "The figures band must finish before the rail below starts" is guaranteed forever by "band completes when fully visible" (it sits above the rail), and can never drift the way tuned thresholds do when spacing changes.
- **Un-pinning is not de-animating.** Every desktop choreography beat survives on flow surfaces as a scroll scrub (reversible both directions) unless the translation plan consciously drops it. Port the actual desktop move — same variables and formulas where possible (the ≤900 diamond roll-in reuses the pinned sequence's exact `--cap-tx/-ty/-rot/-sc` math) — never a token substitute.
- **Perceptible or it doesn't exist.** An effect whose CSS variables provably change but which is invisible at the position the user actually looks (a 7%-opacity wash being zoomed; a chain-draw completing below the fold within the first 100px of entry) counts as MISSING. Effects need their own visibility arc (e.g. enter at 0.2 opacity, breathe down to the settled wash) and their completion staged where the eye is. Verify motion BY EYE at mid-scroll frames, not only by variable probes.
- **Reveals follow VISUAL order** (position-sorted, §4.5), everything is reversible with scroll, and `prefers-reduced-motion` rests every surface fully settled (never un-entered).

## 4. Implementation recipes (house patterns, with worked references)

### 4.1 Landscape-only pin gate + JS mirror
CSS: `@media (min-width: <N>px) and (orientation: landscape) and (min-height: <M>px) and (prefers-reduced-motion: no-preference)` wraps EVERY pin rule. JS: a `canPin()` built from `matchMedia` mirrors of the exact same queries gates the pin effect, the track-height writer, and any pin-state classes — so JS state can never fire without the CSS pin. Portrait never pins at any width or pointer type (logan tests fine-pointer portrait windows via devtools responsive mode, so `pointer: coarse` exclusions are NOT sufficient). Worked references: `home/lifetime.css:90` + `lifetime-reel-01.jsx`, `home/sectors.css:653` + `sector-diamonds-04.jsx`, `home/facility-pin.css:14` + `media-split-01.jsx` (`pinCapable`).

### 4.2 Flow writer → CSS-var slices (the scrub backbone)
One rAF-coalesced passive scroll listener per section (gated to the pin's exact complement, skipped under reduced motion) writes per-section progress vars (`--capalt-p`, `--figs-p`, `--fac2-strip-p`, `--lr-*`, …) from rect-anchored formulas. CSS consumes them per item: `--t: clamp(0, calc((var(--p, 1) - var(--thr)) * rate), 1)` with `--thr` derived from the item index, then `opacity: var(--t); transform: …calc((1 - var(--t)) * <distance>)…`. Defaults (`var(--p, 1)`) rest everything settled for no-JS and reduced motion. Worked reference: the flow writer in `media-split-01.jsx` + the `.mw-capalt__item` / `.mw-fac2__fig` slice rules in `facility-pin.css`.

### 4.3 IO-requeue (surviving var-clears and programmatic jumps)
A pin effect that clears its variables on teardown can erase a flow writer's values, and a single programmatic scroll jump can land one frame before the writer's first pass. Register a small IntersectionObserver (generous `rootMargin`, e.g. `300px 0px`) AFTER the pin effect's own IO that re-schedules a rAF write — worked reference in `lifetime-reel-01.jsx` and `media-split-01.jsx`.

### 4.4 Single-column re-composition without touching desktop DOM
`display: contents` on the desktop wrapper elements + flex `order` on the children re-composes a 2-column section into one editorial column with zero DOM moves, so every desktop pin selector keeps working. Gotchas: the flex column MUST set `align-items: stretch` (an inherited `start` shrinks items to content width — this collapsed the film strip to 93px), and any base `display: none` for a flow-only element must sit BEFORE the media block that re-enables it or the cascade order silently wins the wrong way. Worked reference: the ≤900 block in `facility-pin.css`.

### 4.5 Position-sorted reveal cascades
Whenever CSS re-orders layout (`order`, `display:contents`, grid placement), sort animation targets by on-screen position (top, then left, ~24px tie tolerance; re-sort on resize) instead of DOM order, so the cascade sweeps what the eye sees — an element rendered above another must never animate in after it. Worked reference: `image-accordion-01.jsx`.

### 4.6 Reversed horizontal scroller
`flex-direction: row-reverse` on the scroller seats DOM item #1 at the RIGHT at rest (a row-reverse scroller natively rests at its first item, `scrollLeft` goes negative leftward), with later items extending off the left bleed; a left-to-right swipe travels 1→N. DOM and screen-reader order stay 1→N. Reverse the cascade thresholds to match the visual sweep (leftmost item arrives first, item #1 lands last at p=1). Worked reference: `.mw-capalt__list` in `facility-pin.css`.

### 4.7 Flow-mode in-panel insets
Write the inset block's media query as the EXACT COMPLEMENT of the pin gate (`(orientation: portrait), (max-width: …), (max-height: …), (prefers-reduced-motion: reduce)`) so every non-pinned surface gets real air between the panel edge and the first/last content row. Worked reference: the flow-inset block in `home/lifetime.css`.

### 4.8 Sticky touch-`:hover`
A tap sets `:hover` persistently on touch. Media-gate ALL hover-only choreography (spotlights, gathers, grows) off re-flowed surfaces — including rules that look harmless; two ungated gather rules slid photos 184px off-lattice on tap. Replace with tap-to-select + an outside-`pointerdown` clear, and re-tune any state that grows an element (a desktop 1.24× lattice grow overflows a phone column; it's capped at 1.04 ≤1024). Worked references: `sectors.css` frieze-surface media list + `sector-diamonds-04.jsx`; `media-split-01.jsx` activeCap clear.

### 4.9 CSS deletion audit
Before deleting CSS rules, grep what they were overriding/neutralizing — old fallback blocks are often kept inert ONLY by later neutralizing rules, and deleting the neutralizer re-activates the legacy block (exactly how a broken phone layout shipped). Prefer deleting the legacy block itself once grep proves it has no other consumer.

## 5. Phase four — verify

Follow the root `CLAUDE.md` protocol ("How to verify responsive work") exactly. The measured-assertion menu that paid for itself this session: element-center offsets ("caption 0px off band center"), fits-inside checks ("active cluster bounds 17→373 inside 390"), computed-style probes for stray legacy rules, and **exact-frame timing checks** (settle-loop the scroll until anchor element X sits at viewport position Y, then assert `p === 1.000` and the last item's opacity). Exercise interaction states per viewport (tap, then measure + screenshot). Capture mid-scrub frames and judge the motion by eye, not just the variables. Re-verify desktop byte-invariance every round. Touch emulation: `{ viewport, isMobile: true, hasTouch: true }`, viewport screenshots only (element screenshots of taller-than-viewport nodes silently reset the emulation), and settle-loop scroll positioning because JS-sized sections above shift layout for a few frames.

When you evolve one of these patterns intentionally, update this doc and `docs/DESIGN-SYSTEM.md` §9/§11 in the same change.
