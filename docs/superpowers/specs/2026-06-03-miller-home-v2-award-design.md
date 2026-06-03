# Spec — Miller Environmental award-tier home page (`/v2`)

- **Date:** 2026-06-03
- **Status:** FINAL (self-reviewed + 3-specialist team review integrated)
- **Author:** Claude, integrating the design specialist team's review (design-lead / design-critic / ia-architect)

## Changelog — review integration (draft → final)

The draft was reviewed by the three specialists against the real code + live pixels. Curated changes folded in (balancing design-critic's "too restrained to win" against the owner's chosen "refined monument" — added craft *density* without motion *busyness*; kept to **three** signature beats, not a zoo):

- **Money shot named:** the `Σ · TO DATE` tally (the seal *closing* on the final value) is THE screenshot moment; design backward from it.
- **Section rhythm fixed:** Facility becomes a **mid dark anchor** → darks at **1 / 6 / 8 / 11** (was 1/8/11, a 6-section light run). **Careers ↔ Affiliates swapped** so a logo marquee doesn't deflate the post-tally slot. Certs band kept visually thin.
- **Saggy-middle mitigated three ways:** the dark Facility anchor; a **ledger line-item grammar** so the manifest is felt in the section *bodies*, not just the gutter; and **one** on-concept contained move — the `· IN TRANSIT` custody-thread advance (a 1px-line scroll-scrub, the single place scroll-linked motion is justified).
- **Custody thread promoted** from `aria-hidden` garnish to the load-bearing signature device (legible in-flow micro-events at seams; stage labels surfaced to screen readers).
- **Diamond budget goes DOWN, not up:** the custody node **replaces** the eyebrow diamond at a seam (one diamond per viewport); `/v2` timeline nodes demote to plain ticks; the two "big" diamonds (hero seal, tally frame) get real **seal texture**.
- **Truck = authored/traced SVG** (orthographic side elevation, `non-scaling-stroke` hairline, squared joins), **codex raster = reference only**; exactly **one** linework truck (disposition); the history truck stays a graded **photo** plate.
- **Hero reconciled:** a manifest *masthead* (more concept) with *less* kinetic pile-up (a monument hero is still) — one entrance move, the large seal lands in stillness.
- **Added:** one signature **type expression** (oversized zero-padded stage numerals as structural dividers / manifest title-block), one contained **atmosphere** move on the dark crescendo, one **user-driven** micro-interaction.
- **Isolation hardened:** no bare `data-reveal/-stagger/-parallax` in `/v2` (grep-gated); CSS **Module** (`v2.module.css`) for compiler-enforced scoping; `mx-` marks consume global tokens, never redefine; **noindex** metadata; the tally sequence owned by **one** client driver; content **imported & reshaped**, not copy-pasted; v2 stays statically rendered.
- **Codex pipeline CONFIRMED** (smoke-tested): `image_gen` + Pillow chroma-key/color, saved via `danger-full-access`; produced a transparent 1600×600 terracotta blueprint truck. Capability is real; the open caveat is now narrower (vector vs raster for linework — see §8/§9).

## 0. Locked decisions (from owner)

| Decision | Choice |
|---|---|
| Concept (spine) | **Chain-of-custody "manifest"**, with **diamond = custody node/seal** and a **blueprint-line truck = the vehicle** as its two devices. |
| Boldness | **Refined monument + 3 signature beats** ("slow and few"; gravitas base, a few bold authored moments). |
| Template architecture | **Page-local, self-contained.** New templates live only under the new route. `components-v2` and `/` stay byte-untouched. |
| Scope | **Full reimagined page** — every section, end-to-end. |
| Route | `app/v2/page.jsx` → `/v2`. `/` untouched; promote later by swap. |
| Palette / type | **Locked.** Warm clay only (blue ISO seals = sanctioned exception); Barlow Condensed display, IBM Plex Sans body, IBM Plex Mono labels/numbers. |
| Photography | Generated via **codex** (confirmed working); exact prompts in the plan; transparent-friendly for cut-outs. |

## 1. Goal & success criteria

A genuinely award-caliber (Awwwards / FWA / CSSDesignAwards SOTD tier) Miller home page, built as a **separate, isolated** page at `/v2` so the live `/` and shared `components-v2` are never at risk.

**Acceptance criteria:**

1. The chain-of-custody concept is *legible* — the page reads as one continuous documented journey (intake → disposition), carried in the section **bodies** (ledger grammar), not only the gutter.
2. A defined **money shot** (the `Σ · TO DATE` tally, seal closing on the final value) that the page is designed backward from; exactly **one** dramatic moment.
3. A real **motion vocabulary** (4 reveal verbs) + **3 signature beats** (still manifest hero, the tally seal-close, the truck self-draw) + **one** contained on-concept move (`· IN TRANSIT`) + **one** user-driven micro-interaction. Reveals slow enough to be seen (~480–560ms).
4. **Diamond count goes DOWN vs `/`** — the custody node replaces the eyebrow diamond at seams; `/v2` timeline nodes are ticks; no background diamond field.
5. Exactly **one** blueprint-line truck (a traced vector, not raster), at the disposition close.
6. One signature **type expression** unique to `/v2`; one contained **atmosphere** move on a dark section.
7. **Isolation proven:** `/` byte-identical; `git status` shows no edits outside `app/v2/**` (+ `docs/**` + generated assets); no bare `data-reveal/-stagger/-parallax` anywhere in `app/v2/**` (grep-gated); `mx-` namespace 100%.
8. **A11y:** AA contrast; semantic landmarks; visible clay focus rings; manifest **stage labels are screen-reader-available** (only the line+glyph is `aria-hidden`); count-up live-region final value; **every** animation has a `prefers-reduced-motion` off-switch with a *designed* on-screen resting composition.
9. **Perf:** hero LCP preloaded; CLS ≈ 0; **no horizontal overflow** at any breakpoint (desktop + 390px); below-fold lazy-loaded; transform/opacity-only (clip-path `inset()` capped to a few images); `/v2` statically rendered; **noindex**.
10. **Quality bar:** 0 console errors; Playwright-verified with screenshots actually reviewed.

## 2. The concept — "the documented line"

The scroll **is** the manifest: you travel down a document recording the waste's journey from intake to final disposition, and the page's devices are the marks of that record.

**Narrative stages** (used as section framing, surfaced as readable section labels — NOT new prose copy): `00 · ORIGIN` (hero) → `01 · CERTIFIED` (ISO) → the vow (creed) → `02–04` the record (services / sectors / facility) → `· IN TRANSIT` (the thread advancing) → track record (history) → `Σ · TO DATE` (the tally — the money shot) → `· DISPOSITION` (the close, the truck delivers/completes the document).

**Three carriers (the custody thread is now load-bearing, not garnish):**

- **The custody thread + nodes (in-flow, NOT scroll-bound).** A clay hairline in the left margin continues the hero's vertical hairline; at each major seam it passes through a **custody node** — a small diamond *seal* carrying a zero-padded stage number + mono micro-label. It documents *stages*, not scroll %. **Legible, not marginal:** on reveal each node **stamps** (square→diamond) and the hairline does a short **draw** between nodes; the node **replaces** that section's eyebrow diamond (so total diamonds drop). The stage *label text* is screen-reader-available; only the line + diamond glyph are `aria-hidden`.
- **The diamond = the seal.** The logomark diamond is the custody node and the frame for the one crescendo number, borrowing notary/ISO-seal semantics. Strict scale ladder + actual seal texture on the two big ones (§7).
- **The truck = the vehicle.** One blueprint-line truck (the thing that carries the chain) — a faint first appearance at the `· IN TRANSIT` middle, then the full **arrival** at disposition that completes the document.

**Clay accent is concentrated** on (a) the thread/nodes and (b) the one crescendo numeral, so the accent *means* "the through-line." Routine eyebrows sit at a calmer ink tone.

## 3. Architecture & isolation

- **Route:** `app/v2/page.jsx` → `/v2` (a real path; NOT a route group, which would resolve to `/`). Thin composition only.
- **Layout seam:** `app/v2/layout.jsx` hosts the CSS-module import + `metadata` (incl. `robots: { index: false, follow: false }`) and mounts the page-local motion drivers **once** for the subtree. Chrome (TopNav/SiteFooter) comes from the **root** layout automatically.
- **Sections (new, page-local):** `app/v2/_sections/*.jsx` — none imported from `components-v2`.
- **Devices (new, page-local):** `app/v2/_components/*.jsx` — `CustodyThread`/`CustodyNode`, `DiamondSeal`, `TruckLine`, `MxReveal`, `MxParallax`, `MxTally` (owns the whole count-up→seal-close→hairline→trio sequence — ONE driver, like `ResponseTimeline` owns one clock), `MxCountUp`.
- **Content:** `app/v2/_content/*.js` — **import** the exported consts from `lib/content/template-testing-home.js` (already composed from canonical sources) and **reshape** for new templates. Do NOT copy-paste prose (drift). No copy rewrite (only the creed drops its giant stat).
- **Styles:** a **CSS Module** `app/v2/v2.module.css` (hashed class names = compiler-enforced isolation), class intent-prefix `mx-`. Plain global `v2.css` is the fallback only if a Module proves impractical — and then: zero bare element selectors, no `:root`, no token redefinition. `mx-` marks **consume** global tokens (`--c-accent`, `--font-mono`, …), never redefine them.
- **Motion isolation (HARD RULE):** the root's global `MillerScrollReveal`/`MillerParallax` are **selector-based** (`[data-reveal]`, `[data-reveal-stagger] > *`, `[data-parallax]`). `/v2` uses ONLY `data-mx-reveal`/`data-mx-parallax` and ships its own drivers. **`app/v2/**` must NEVER emit a bare `data-reveal`, `data-reveal-stagger`, or `data-parallax`** — verification greps for these and fails the build if found.
- **Rendering:** `/v2` is **static** (no dynamic data of its own; the root layout's `cookies()`/`headers()` for the banner don't opt v2's content into dynamic rendering). Banner is **off** on `/v2` (`shouldShowEmergencyBanner("/v2")` already returns false — `lib/nav` untouched).

**Isolation guarantee:** only `app/v2/**`, `docs/superpowers/**`, and generated assets under `public/miller/**` are created/changed. Nothing under `components-v2/**`, `app/(home)/**`, `app/styles/**`, `app/layout.jsx`, or other routes.

## 4. Section architecture (full page, final sequence)

Re-sequenced so the manifest **tallies at the end of the proof run** (you sign the total at the bottom). Dark anchors at **1 / 6 / 8 / 11**, none adjacent (cream History at 7 separates the two dark beats 6 & 8).

| # | Section (new template) | Surface | Stage / role | Content | Photos | Motion |
|---|---|---|---|---|---|---|
| 1 | `HeroManifest` | **dark** | `00 · ORIGIN` — manifest masthead | HERO | cinematic hero (codex) | **still** masthead: one entrance move + the large seal lands in stillness; subtle parallax |
| 2 | `CertSeals` | light (**thin**) | `01 · CERTIFIED` — trust | CERTS_BANNER | ISO seals (keep blue) | clip-reveal + stagger |
| 3 | `CreedVow` | light | the vow (breath) | CREED (**de-statted**) | none | `line` type reveal; stamp-period lands last |
| 4 | `ServicesIndex` | light | `02` record — what | SERVICES_GRID | service tiles | `cards` stagger + **ledger grammar** |
| 5 | `SectorsLedger` | light | `03` record — who | SECTORS | 3 sector photos (codex SET — currently empty on `/`) | `clip` + **ledger grammar** |
| 6 | `FacilitySplit` | **dark** | `04` record — where/how (VBEC); mid dark anchor | FACILITY | VBEC aerial/building (reuse) | media `clip` + spec figures + **ledger grammar** |
| — | (`· IN TRANSIT`) | — | the thread advances (contained scroll-scrub between two nodes); faint truck echo | — | faint truck linework | the ONE contained scroll-linked move (1px line only) |
| 7 | `HistoryTimeline` | cream | track record (proof) | HISTORY | graded **photo** truck-plate (stats stay on photo) | timeline draw + plate |
| 8 | `ScaleTally` | **dark** | `Σ · TO DATE` — **the money shot** | LIFETIME_SCALE | none (type + seal) | **signature beat:** count-up → **seal closes** on final value → hairline draws → trio staggers; contained atmosphere (soft radial warmth) |
| 9 | `CareersCallout` | light | the people | CAREERS | team photos (reuse/codex) | `clip` photo reveal |
| 10 | `AffiliatesMarquee` | light | **countersignatures** (buffer) | AFFILIATES_BANNER | affiliate logos (reuse) | marquee (reduced-motion: static) |
| 11 | `DispositionCta` | **dark** | `· DISPOSITION` — the close | FINAL_CTA | blueprint **truck arrival** | **signature beat:** truck self-draws/arrives → triggers the close "DELIVERED" stamp; CTA |

## 5. New page-local template inventory

**Sections (11):** `HeroManifest`, `CertSeals`, `CreedVow`, `ServicesIndex`, `SectorsLedger`, `FacilitySplit`, `HistoryTimeline`, `ScaleTally`, `CareersCallout`, `AffiliatesMarquee`, `DispositionCta` (+ the inline `· IN TRANSIT` interstitial, likely folded into the Facility→History seam).

**Devices (page-local):** `CustodyThread` + `CustodyNode` (legible in-flow stamps), `DiamondSeal` (the two big sealed diamonds), `TruckLine` (traced SVG, self-draw capable), `MxReveal` (verbs via `data-mx-reveal`), `MxParallax`, `MxTally` (owns the full tally sequence), `MxCountUp`, plus reimplemented `mx-` atoms (stamp, eyebrow, arrow).

## 6. Motion system

**Reveal verbs** (`data-mx-reveal`), one easing family, ~480–560ms, each with a designed reduced-motion resting composition: `fade` (default), `line` (per-line mask-rise headlines), `cards` (longer-travel staggered cascade, reading order), `clip` (`clip-path: inset()` wipe for images — capped to a few).

**The 3 signature beats (and no more):**
1. **HeroManifest entrance — STILL.** A masthead, not a kinetic pile-up: ONE entrance move (the headline `line`-rise OR a slow settle, not both stacked with seal+truck), the large diamond **seal** landing in stillness with the manifest title-block. Subtle parallax retained.
2. **ScaleTally — the money shot.** Eyebrow → figure counts up (mono tabular, fixed-width) → the **diamond seal draws closed** on the final value (the memorable micro-moment) → divider hairline draws → trio staggers. Stillness + scale; the count-up is the motion. Mobile fallback per §7.
3. **DispositionCta — the truck arrival.** The truck **self-draws** via `stroke-dashoffset` (decelerate, ~1.2–1.6s; NOT an off-canvas X-translate), then triggers the close "DELIVERED" stamp. Reduced-motion = fully drawn + stamp shown. Any X-travel (if used at all) lives inside an `overflow: clip` wrapper.

**The ONE contained scroll-linked move:** `· IN TRANSIT` — the custody hairline visibly **advances between two nodes** as you scroll the Facility→History seam (a decorative 1px line only — never layout; vestibular-safe; reduced-motion = drawn). This is the single place scroll-binding is on-concept (the manifest progressing), and it's the sustaining beat for the mid-run.

**The ONE user-driven micro-interaction:** hovering a ledger line-item (Services/Sectors) **lights its custody node and draws its thread segment** — rewards exploration without a showreel.

**Custody nodes** stamp square→diamond on reveal (the one diamond micro-animation, §7).

## 7. The diamond system (discipline — budget goes DOWN)

Strict **scale ladder**, each tier capped, and a hard anti-saturation rule:
- **Tiny (controlled):** **one diamond per viewport at a seam** — the custody node **replaces** the eyebrow's diamond mark (the node becomes the section's announcing mark). `/v2` timeline markers are **plain ticks**, not diamonds. Net diamonds < current `/`.
- **Medium (exactly one):** the `DiamondSeal` framing the **tally numeral**, with seal texture (faint embossed/letterpress edge + a mono micro-legend, e.g. `ON THE RECORD`). **Mobile fallback:** below ~600px the rotated square around the hero-scale numeral becomes a **corner-bracket or a bottom seal** (a full rotated box around a 300px wrapping numeral overflows 390px).
- **Large (exactly one):** the **hero manifest seal** (`00 · ORIGIN`) — the issuing-authority mark, with the same seal texture.
- **NO background diamond field** — the 49° grain is the sole ambient texture.
- **One diamond micro-animation:** the stamp-period (and custody node) rotates 45°→0° as it lands.
- **MUST NOT appear:** as wallpaper; on routine stat numerals; framing grid/sector cards; directly prefixing an `<h*>`; doubled with an eyebrow diamond in one viewport.

## 8. The truck system

**Exactly one** linework truck, at the disposition close (+ a faint echo at `· IN TRANSIT`). It must read as a **technical drawing**, not clip-art:
- **Authored/traced SVG** — single stroke-width = the hairline token, `vector-effect: non-scaling-stroke`, **squared** linejoins/caps, no fill/shadow/gradient, **orthographic side elevation** (not a 3/4 marketing render), cropped at the frame edge.
- **Codex is reference only** here: codex can raster a line-truck (confirmed — see §9), but the *shipping* asset is the traced/cleaned vector so it matches the 1px hairline system at any scale. (Pipeline: codex raster → trace/clean → SVG with the constraints above.)
- The **history** section keeps its **graded photo** truck-plate (a 1px outline can't legibly carry the three overlaid stat figures) — this keeps the "exactly one linework truck" budget honest.

## 9. Photo / asset plan (codex — CONFIRMED working)

Pipeline verified: codex `image_gen` + Pillow (chroma-key transparency + clay-color enforcement), saved via `danger-full-access`. Produced a clean transparent 1600×600 terracotta blueprint truck in the smoke test. **Caveat:** codex output is **raster** — for the truck linework, raster is *reference*, the shipping asset is vectorized (§8); for photographs, raster is the shipping asset.

Exact prompts live in the plan. Art direction (from review):
- **Hero (highest priority):** do NOT reuse the stock-ish `home-frame-1`. Codex: cinematic wide of VBEC / a hazmat tech at a containment line, low raking golden-hour light, warm clay LUT, **clean negative space upper-left for the masthead type**, 16:9, photographic, no text.
- **Sectors ×3 — a matched SET** (the live `/` renders these as empty placeholders → load-bearing): identical grade + focal length + light direction across industrial / public-works / household-HHW so they read as one art-directed series.
- **Truck:** orthographic side elevation, single-weight line, transparent bg (reference for the traced vector).
- **Optional anchor:** one cut-out subject on transparent bg (tech with a manifest clipboard, or a sealed drum with a custody label) for the hero plate.
- **Reuse (do NOT regenerate):** VBEC aerial/building, ISO seals (blue), affiliate logos, team photos.

## 10. Accessibility & performance budgets

- **A11y:** semantic landmarks; AA text tokens; visible clay `:focus-visible` rings; **manifest stage labels are SR-available** (only line+glyph `aria-hidden`); count-up animating digits `aria-hidden` + SR-only final value; **every** animation reduced-motion-guarded with a *designed* on-screen resting composition (truck fully drawn + stamp; tally seal closed on final value).
- **Perf:** preload hero LCP (`fetchPriority="high"`, React-19 hoisted); explicit dimensions/aspect-ratio → CLS ≈ 0; below-fold `loading="lazy"`; transform/opacity only; `clip-path: inset()` capped to a few images; `[data-mx-*]` drivers rAF-coalesced + passive; **no horizontal overflow** (truck self-draw avoids X-travel; any X-travel inside `overflow: clip`); `/v2` static; **noindex**.

## 11. Out of scope / non-goals

- No edits to `/`, `components-v2/**`, `app/styles/**`, `app/layout.jsx`, `lib/nav`, or any other route.
- No copywriting/content rewrite (reuse; only the creed drops its giant stat).
- No shared `components-v3` library this pass (page-local; extraction is a later decision).
- No new runtime dependencies; no data-layer changes.
- The owner's uncommitted case-study asset changes are untouched.

## 12. Open items / residual risks

- **a. Codex vector linework** — codex emits raster (confirmed); the truck needs tracing to vector. Plan must include the trace/clean step; if tracing proves heavy, fall back to a hand-authored SVG truck (codex raster as the reference).
- **b. Tally diamond at hero scale** — the medium seal around a `clamp(88px,19vw,300px)` numeral needs the §7 mobile fallback; validate desktop corner-collision with section padding during build.
- **c. The `· IN TRANSIT` scroll-scrub** — must be proven vestibular-safe (1px line only, reduced-motion drawn) and overflow-safe; if it adds any jank, drop to a plain in-flow draw-on-reveal.
- **d. Promotion path** — `/v2` → `/` later (route swap + redirect); out of scope now.

## 13. Acceptance checklist (testable)

- [ ] `/` + `components-v2/**` byte-untouched (git diff clean outside `app/v2/**`, `docs/**`, generated `public/miller/**`).
- [ ] No bare `data-reveal/-stagger/-parallax` in `app/v2/**` (grep passes); `mx-` namespace 100%; tokens consumed not redefined.
- [ ] Concept legible in section bodies (ledger grammar), not only the gutter; stages SR-available.
- [ ] One money shot (tally seal-close); 3 signature beats; 4 reveal verbs; one `· IN TRANSIT` move; one user-driven interaction.
- [ ] Diamond count ≤ current `/` (node replaces eyebrow diamond; timeline = ticks); no background diamond field; one traced-vector truck.
- [ ] One signature type expression; one contained atmosphere move.
- [ ] 0 console errors; no horizontal overflow desktop + 390px; CLS ≈ 0; hero LCP preloaded; `/v2` static + noindex.
- [ ] Reduced-motion disables all motion with *designed* resting compositions; AA; focus rings; count-up SR value.
- [ ] Playwright-verified with screenshots actually reviewed.
