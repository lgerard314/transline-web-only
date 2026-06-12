# Responsive — the rendered desktop section is the brief

Every smaller viewport is a DERIVATION of the desktop section's intent. Never accept an existing mobile layout as the brief, and never reduce a designed composition to generic stacked blocks (purposeless image dumps are banned on every page).

## Reflow changes the motion contract — re-derive, don't carry over

When a narrow viewport wraps, stacks, or reorders the layout, the section's geometry is NEW — and every motion contract written against the old geometry is INVALID until re-derived. This is a restructuring pass, not a shrink: re-inventory which components moved where, then re-anchor every scrub slice, travel distance, and completion frame to the new geometry, and re-sequence reveals to the new VISUAL order. The home VBEC section is the worked example — its mobile layout is substantially different from desktop, so its choreography was re-derived against the mobile structure rather than carried over or dropped.

**Motion is ADJUSTED on small viewports, never stripped** — `prefers-reduced-motion` is the only off-switch. The adjustments per surface:

- **Scroll scrubs:** re-anchor to the new rects (a stacked layout has different runway lengths); shorten travel distances to the viewport's scale; keep completions landing AT their anchors.
- **Pins:** decided by the motion test (motion.md), never by blanket "mobile doesn't pin."
- **Hover systems:** every hover gets a touch equivalent (tap-to-commit, focus parity), sticky touch-`:hover` gets an explicit way off (outside-tap clear), and active poses that GROW an element are re-tuned so they still fit the column — a desktop-tuned 1.24× grow overflows a phone. Both pointer types must work at every width (fine-pointer small windows are real).
- **Parallax/drift effects:** soften the travel to the viewport (parallax amplitude that reads elegant at 1440 reads seasick at 390) — tune, don't remove.
- **Section padding / gaps / spacing:** re-derived from the shared clamps at each width, then PROBED — seam rhythm, in-section gaps, and content insets are part of the motion contract's geometry, not separate cosmetics; a panel edge and a content start often coincide by construction and need explicit insets in flow mode.
- **Type:** re-clamped per the portrait scale (bigger than you think — see below).

After restructuring, the verification is FULL: walk every component at the new width (verification.md), re-run the sequential scroll walk for every motion moment against the NEW geometry, and re-check every interaction state.

## The process

1. **Read the repo playbook in full first** (mandatory in the white-owl monorepo): pre-edit process, approved vocabulary (rails/strips with peek, directional edge bleeds, white media cards, stagger rows, portrait type scale), worked recipes, and the §6 pre-ship checklist.
2. **Desktop intent inventory from the RENDERED page:** every component + its purpose, every motion beat + what it communicates, every interaction state, and the props the section is mounted with (read the page.jsx call site). Then ask per surface: "how does THIS design translate here, and how does its motion come along?"
3. **Pin-vs-flow by the motion test** (see motion.md): full-screen-converging choreography keeps its pin everywhere; static-composition pins go landscape-only with entry scrubs surviving; flowing surfaces get explicit content insets (panel edge and content start often coincide by construction).
4. **Write motion contracts** (progress source → exact geometric start/end anchors) using the user's exact geometry words — his words like "centered" are literal contracts.
5. **Derive multi-element geometry on paper** against gutter targets — never eyeball offsets.
6. **Implement, then verify** per verification.md: measured assertions at proven frames, interaction states, the playbook checklist, and judge each key pose (rest / mid-motion / settled) against "is this exceptional, high-end, expensive?"

## Hard-won specifics

- **Test the in-between widths,** not just round breakpoints: ~430 (Pro Max class), the 600–720 band, portrait tablets (768/834/1024), landscape tablets, AND a fine-pointer ~650×950 window — the user tests devtools responsive mode, which is FINE-pointer, so `pointer: coarse` gates don't fire there. Both pointer types must be sane at every size.
- **Touch emulation:** `browser.newContext({ viewport, isMobile: true, hasTouch: true })`; remember the element-screenshot gotcha (verification.md).
- **Capture at REAL device dimensions — width AND height (logan, 2026-06-12).** A width-only or arbitrary-height window hides cut-offs that exist on actual phones ("fits at 390 wide" is meaningless if the judged pose assumed the wrong height). Use true device viewports — 390×844 (iPhone), 430×932 (Pro Max class), 768×1024 / 834×1194 (portrait tablets), landscape equivalents — with `isMobile`/`hasTouch`/`deviceScaleFactor` set, and judge "fits / in position by X" against that real height. Desktop reference frame is 1440×900.
- **Reveal order follows VISUAL order** when CSS re-orders layout (`order`, `display:contents`, grid placement) — sort animation targets by on-screen position.
- **Before deleting CSS rules, grep what they were overriding** — old fallback blocks are often only kept inert by later neutralizing rules; deleting the neutralizer re-activates the legacy block (this exact mistake shipped a broken phone layout).
- **Type on portrait is bigger than you think** — when torn between two sizes, take the larger.
- **Audit every clamp and fixed px size at its band's EXTREMES against the container it must fit** (white-owl playbook §4.12): a clamp that's fine at the round breakpoints can overflow or clip mid-band when its container steps on a different clamp (real failure: fixed-size stat captions chevron-clipped inside a grid-stepped column at every pinned width, unprobed). For sizes that live inside stepped columns, prefer container-relative sizing (`container-type` + `cqi`) or JS-computed clearance vars where JS knows the clip geometry.

## Red flags — each of these shipped a real failure

| Thought | Reality |
|---|---|
| "That failing probe is probably a sampling artifact" | It's REAL until re-run green at a proven frame. A dismissed −32px overlap probe shipped a desktop regression. |
| "The rule says portrait never pins" | Rules encode intent. Run the motion test; a full-screen-converging dive keeps its pin everywhere. |
| "He asked for X, so I'll do X" | A specific idea inside "optimize the section" is an input; the full composition pass is still the scope. |
| "The tiles look roughly like a grid" | Derive coordinates, then pairwise-probe every element pair at the exact rest frame. |
| "All assertions pass, ship it" | Probes don't measure taste. Judge rest/mid/settled poses against the expensive-looking bar. |
| "I'll fix it on the surface he complained about" | Tweaks have cross-surface blast radius — re-probe the ORIGINAL surface too. |
| "I'll reuse the browser that's already open" | Never. Fresh instance per agent per run, closed after. |
| "Motion vars are changing, so the effect works" | Imperceptible = missing. Judge motion by eye at mid-scrub frames. |
