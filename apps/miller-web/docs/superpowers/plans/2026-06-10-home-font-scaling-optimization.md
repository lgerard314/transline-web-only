# Home Font-Scaling Optimization — Parallel Section Plan

> **For agentic workers:** dispatched as parallel, file-scoped subagents (one per section). Each agent edits ONLY its assigned files, verifies with Playwright on the already-running shared dev server using its own isolated browser, and reports back.

**Goal:** Across every home section from **Services through the end of the page** (the hero is DONE — do not touch it; the certs banner is BEFORE services and is out of scope), review and re-tune the responsive font scaling so fonts stop shrinking *too early and too fast*. The body-content column is large (`.mw-inner = min(100% - clamp(48px, 8vw, 144px), 1560px)`), so fonts should hold their comfortable sizes across a generous range of widths and only begin shrinking when the column is genuinely narrow — and shrink *gently*.

**Architecture:** All home section styling lives in `app/styles/home/<section>.css` (one file per section; all 8 are `@import`-ed in `app/globals.css`; no co-located template CSS). Templates live in `components-v2/06_sections/...`. One subagent owns one section's CSS + that section's template JSX. File sets are disjoint → safe to run in parallel.

---

## Audit findings & required pre-dispatch fixes (reviewed 2026-06-10, two read-only reviewers + self-review)

**Confirmed safe / good news:**
- Each of the 8 templates renders exactly once on home; no template is shared between two of the sections.
- `sector-grid-motion-03.jsx` is used only by sector-diamonds 03/04 — sectors-only, safe to assign to `sct`.
- **Fonts are all tunable from within each owned section file.** `.mw-section-title` does carry a shared base clamp (`clamp(32px, 3.4vw, 60px)` in `02-primitives.css`), but every section overrides it with its own title clamp (e.g. `.mw-roster2__title`, `.mw-secd__title`, `.mw-final__title`). The shared marks (`Eyebrow01`/`StopText01`/`SolidCta01`/`ActionArrow01`) carry NO hardcoded font-size — they're styled by section-scoped selectors. So **no font requires editing a shared file.** (If a section's own title clamp doesn't already fully win over `.mw-section-title`, the agent adds/keeps a section-scoped `font-size` — never edits the shared base.)

**MUST FIX BEFORE DISPATCH (coordinator, step 0):**
- **Cross-section coupling:** `app/styles/home/careers.css:319-323` contains a stray *facility* rule:
  ```css
  /* VBEC media — rightmost photo flush to the screen; card framing unchanged elsewhere. */
  .mw-fac2-track .mw-fac2__media { padding-right: 0; border-right: none; }
  ```
  This is a facility (`fac`) selector living in the careers (`car`) file. Left as-is it's a latent hazard (the `car` agent could delete it; the `fac` agent can't reach it). **Coordinator relocates this rule from `careers.css` into `facility-pin.css` before dispatch** (a 4-line move, no behavior change), so `car`'s file has zero facility rules and `fac` owns the rule. After the move: `car` = careers-only, `fac` owns it. If for any reason it is NOT moved, then: `car` MUST leave those 4 lines byte-identical, and `fac` MUST NOT edit careers.css (flag to coordinator instead).

**Consistency gap (address during the work, not blocking):** current breakpoints are ad hoc across sections (600, 721, 840, 900, 901, 1024, 1025, 1200…). The retune should converge on a small shared vocabulary so the page shrinks in rhythm — see "Shared breakpoint vocabulary" below.

---

## Shared font philosophy (every agent applies this)

The problem: most sizes are `clamp(min, <k>vw, max)`. A pure-`vw` middle term starts descending from `max` the instant the viewport drops below the width where `k·vw == max` — which, with a 1560px content cap, is often *far* too early, and it races to the `min` floor too quickly.

Fix techniques (pick what fits each value; **do not make anything larger than it is now at the top end** — the issue is the descent rate, not the max):
- **Raise the floor** (`min`) so the smallest size is still readable.
- **Flatten the curve**: lower the `vw` coefficient and add a `px` constant, e.g. `clamp(20px, 0.6vw + 14px, 28px)` instead of `clamp(18px, 2vw, 28px)` — same max, much gentler slope, higher floor.
- **Hold-then-step**: keep the size flat (a fixed px or the `max`) until a real breakpoint, then drop — via `@media`/container queries — instead of bleeding down continuously from full width.
- Prefer keeping the **max** (large-screen) sizes unchanged; concentrate the change on the 1024–1560 "big but not max" band where things currently shrink for no reason.

Hard constraints for all:
- Preserve the warm clay palette, motifs, motion, and structure — this is *font-scaling* tuning only (plus the two explicit structural tasks below).
- Do NOT touch shared files: `_shared.css`, `01-tokens.css`, `02-primitives.css`, `globals.css`, any `01_marks`/`02_buttons` shared components, or any other section's files.
- Do NOT `git checkout/reset/restore/revert`. Another agent's uncommitted work is live on disk.

## Shared pin / full-viewport-height reconsideration (every agent whose section pins or forces 100vh)

Right now, on desktop, most sections lean on a breakpoint that effectively pins the section to the top of the screen and/or forces it to fill the full viewport height (sticky "windowed" scroll, pinned reveals, scroll-jacked stages). **Only the hero is required to be exactly the band between the bottom of the (collapsed) topnav and the bottom of the screen.** Every other section does NOT have to be full screen height and does NOT have to pin *if the whole section already fits on screen*.

Rule for every other section:
- If, at a given width/height, the **entire section fits within the available viewport** (below the collapsed topnav), let it flow at its **natural height** and scroll past normally — do **not** stretch it to `100vh`/`100svh` and do **not** engage the pin.
- Only engage the pin / full-viewport framing when the section's content **genuinely exceeds** the viewport (i.e. the exact condition the pin mechanism exists to handle — e.g. a scroll-jacked grid taller than the screen, a reveal that needs the freeze). Most of these already have a `canPin()`-style gate (e.g. sectors gates on `min-height: 820px` + `min-width: 721px`); tighten/extend that gate so "it already fits → don't pin, don't force full height."
- This is mostly a JS gating + CSS `min-height`/sticky concern, and it **interacts with the font work**: tuning fonts changes section heights, so re-evaluate the fit condition after retuning. Keep the pinned experience intact where it's still needed (tall content); just stop forcing it when the section comfortably fits.

**Per-section pin mechanism (audited) — only these 5 pin; `hist`/`aff`/`cta` do NOT pin (static flow, leave their height behavior alone):**
- **`svc`** — sticky clipped "window" + scroll-jacked grid; already gated in JS on `window.innerWidth > 1024` (roster-collage-02.jsx). The window height is `calc(100vh - chrome - 2·gap)`. Tighten so that when the grid's natural height already fits the band, it doesn't pin/scrub (let it flow). Mechanism is JS-driven, so this is a JS-gate change.
- **`fac`** — sticky `.mw-fac2-track` + section `height: calc(100vh - ~115px)`, gated `(min-width: 901px)` (facility-pin.css). Forces full height. Add a "content already fits → don't pin / don't force height" path.
- **`sct`** — sticky `.mw-secd-track`, section `min-height:100vh`, gated `(min-width:721px) and (min-height:840px)` CSS @media. **The `min-height:100vh` forces full height even when content fits** — must change to height:auto + a real fit check (JS measure or a better gate), not just rely on the @media.
- **`reel`** — sticky `.mw-lr-track`, section `height:100vh`, gated `(min-width:721px)`. Same forced-full-height issue as `sct`.
- **`car`** — sticky `.mw-czoom__stage` `height:100vh` scroll-scrubbed zoom; **no JS gate at all**, always pins on desktop. Same forced-full-height issue; needs a fit/needed check before pinning.
- For `sct`/`reel`/`car` specifically: the "don't force full height if it fits" rule means a **structural change** (convert `height:100vh` → conditional, gate the sticky), not merely a font tweak. Preserve the `prefers-reduced-motion` off-switches that already disable these pins.

## Shared breakpoint vocabulary (use to keep the retune cohesive)

The current per-section breakpoints are fragmented (600 / 721 / 840 / 900 / 901 / 1024 / 1025 / 1200). To make the page shrink *in rhythm*, prefer this shared ladder when adding/adjusting breakpoints, and only deviate with a written reason:
- **≥1440** — full/max sizes (don't change the top end).
- **1024–1440** — the "big but not max" band where fonts currently over-shrink; **hold sizes flat or nearly flat here** (this is the main fix target).
- **768–1024** — begin gentle scale-down.
- **600–768** — tablet/large-phone.
- **≤600** — phone (existing mobile passes mostly already live here).
Keep each section's *existing* mobile (≤600) and touch-tablet passes working; concentrate new work in the 1024–1440 band. Don't invent one-off breakpoints like 730/901/1150 unless a section genuinely needs it (e.g. the sectors layout-change point) — and if so, document why.

## Section → owned files (disjoint)

| Agent | Section | Owned files (EDIT ONLY THESE) |
|---|---|---|
| `svc` | Services / roster | `app/styles/home/services.css`, `components-v2/06_sections/grids/roster-collage-02.jsx` |
| `sct` | Who We Serve / sector diamonds | `app/styles/home/sectors.css`, `components-v2/06_sections/grids/sector-diamonds-04.jsx`, `components-v2/06_sections/grids/sector-grid-motion-03.jsx` |
| `reel` | Lifetime Reel | `app/styles/home/lifetime.css`, `components-v2/06_sections/statements/lifetime-reel-01.jsx` |
| `fac` | Facility split | `app/styles/home/facility.css`, `app/styles/home/facility-pin.css`, `components-v2/06_sections/splits/media-split-01.jsx` |
| `hist` | History timeline | `app/styles/home/history.css`, `components-v2/06_sections/splits/timeline-split-01.jsx` |
| `car` | Careers zoom collage | `app/styles/home/careers.css`, `components-v2/06_sections/callouts/zoom-collage-01.jsx` |
| `aff` | Affiliates marquee | `app/styles/home/affiliates.css`, `components-v2/06_sections/banners/rotating-banner-01.jsx` |
| `cta` | Final CTA | `app/styles/home/final-cta.css`, `components-v2/06_sections/callouts/multi-column-cta-01.jsx` |

## Two extra structural tasks (in addition to font tuning)

- **`svc` (Services):** while the layout is the side-by-side form (list on the LEFT, collage grid on the RIGHT — i.e. above the ≤1024 stack), the collage grid must step **3 → 2 → 1 columns** as the viewport narrows (currently it only does 3 → 2 via the `min-width:1025 and max-width:1279` band I already added). Add a 1-col sub-band at the low end of the side-by-side range (e.g. split 1025–1279 into a 2-col upper part and a 1-col lower part) so a single, wider card shows when the collage column gets too tight for two. When the column count drops, **reshape the cards** (adjust `aspect-ratio` — wider/shorter at 1-col so a single card isn't a giant square). Audit confirms: the scroll/hover JS reads the live column count from `getComputedStyle(grid).gridTemplateColumns`, so it adapts with **no JS change** — but the `:nth-child(3n+2)` middle-column parallax must be neutralized in EVERY non-3-col band (the existing 2-col block already does this; mirror it for the new 1-col band).
- **`sct` (Who We Serve):** the interlocked single diamond lattice currently reflows into a different layout as it narrows (audit found related breakpoints at 1024 — leader-lines/margin-labels hide — and 600 — on-photo labels; the user perceives the "becomes completely different" change around ~730, near the `min-width:721` pin gate; **the agent must first pin down the EXACT width where the layout stops being the interlocked checkmarks and confirm it against the ~730 the user sees**). Instead of that reflow, **split each category + its 4 photos into its own separate checkmark diamond grid** (4 stacked checkmark grids), so every category keeps its checkmark (✓) shape at narrow widths. Audit note: the lattice is computed in `buildGrid()` (STEP=4 interlock) in `sector-diamonds-04.jsx`, so the cleanest implementation is a **JSX change** (render 4 per-category grids below the breakpoint) rather than CSS-only re-positioning; after the change, **re-verify the `SectorGridMotion03` scroll-reveal still fires per cell** and the hover spotlight still works.

## Verification protocol (every agent)

- The dev server is ALREADY RUNNING at `http://localhost:3001`. Use it. NEVER start a second server, kill/restart it, or edit `next.config.*`.
- For each check, launch your OWN isolated headless browser (`chromium.launch()` — private context) pointed at `http://localhost:3001/`, screenshot YOUR section at multiple widths (e.g. 1920, 1560, 1440, 1280, 1100, 1024, 900, 768, 600, 390), **Read the screenshots and actually look**, then CLOSE your browser before finishing the response.
- **Test multiple viewport HEIGHTS too** (e.g. a short 1440×720 and a tall 1440×1100), not just widths — the pin/full-height "does it fit?" decision depends on height, so the same width can pin or not depending on height.
- Write screenshots to your own scratch dir (e.g. `_scratch_fonts_<agent>/`). Don't read/write other agents' scratch.
- Because 8 agents edit files all imported by `/`, every save triggers an HMR recompile for everyone — you may briefly catch another agent's mid-edit (or a transient compile error) in a screenshot of a section that isn't yours. Judge ONLY your own section; if your own section looks wrong, re-shoot before concluding. Never "fix" another section.
- Skills to consult: `frontend-design`, `accessibility-guard` (readable minimums), and for JSX changes `frontend-implementation-guard`.

## Coordinator responsibilities (not the section agents)

- **Step 0 (before dispatch):** relocate the stray facility rule out of `careers.css` into `facility-pin.css` (see Audit findings).
- **Handshake:** collect every agent's confirmation (files + own-browser usage) before sending "proceed".
- **Final integration pass (after all agents return):** load the WHOLE home page in one fresh browser at the shared breakpoint ladder widths AND a couple of heights, scroll top→bottom, and confirm (a) no section regressed, (b) the font shrink feels cohesive across sections, (c) pins still engage only where content overflows, (d) no leftover compile errors. Then clean up all `_scratch_*` dirs.

## Handshake (REQUIRED)

Each agent's FIRST response is a confirmation only — no edits, no Playwright yet. It must echo back: the exact files it will edit, that it will use its own `chromium.launch()` browser on `:3001` and close it after each run, and that it will not touch any other file or the server. Then it WAITS for the coordinator's "proceed" message before doing any work.
