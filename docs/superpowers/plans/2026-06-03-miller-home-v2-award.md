# Miller Home `/v2` Award-Tier Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a genuinely award-caliber Miller Environmental home page as an isolated, separate page at `/v2`, leaving `/` and `components-v2` byte-untouched.

**Architecture:** Page-local, self-contained Next.js App Router route at `app/v2/`, rendering *inside the existing root layout* (which supplies TopNav/footer/`<main>`/global motion drivers to every route). New section templates, concept devices, and motion drivers live under `app/v2/**`. The chain-of-custody "manifest" concept is carried by an in-flow custody thread (diamond seals at section seams), one hand-authored blueprint-truck SVG, ledger grammar in the section bodies, and a clay accent reserved for the through-line + the one crescendo number. Isolation is guaranteed by a `mx-` class/keyframe/attribute namespace + a grep-gate + a root-boundary `git diff --quiet` gate.

**Tech Stack:** Next.js 16 (App Router, React 19), namespaced global CSS (`app/v2/v2.css`, `mx-` only), client motion drivers (IntersectionObserver + rAF), Playwright for verification, codex (`image_gen`) for photographic assets.

**Source spec:** `docs/superpowers/specs/2026-06-03-miller-home-v2-award-design.md` (FINAL).

**Status:** FINAL (self-reviewed + 3-specialist team review integrated).

---

## Changelog — review integration (draft → final)

The draft plan was reviewed by design-lead (craft), design-critic (adversarial), ia-architect (architecture). All findings reconciled and folded in:

- **Root-layout reality (was missing — BLOCKER):** `/v2` renders *inside* `app/layout.jsx`, so TopNav, SiteFooter, `<main id="main">`, and the global `MillerScrollReveal`/`MillerParallax` are **present and active** on `/v2` (inert, not absent). Isolation reframed accordingly; the **root boundary files are gated** (not just `app/v2/**`); v2 must **never emit `<main>`**; TopNav behavior over the v2 hero must be verified; `v2.css` isolation is **namespace-based, not import-site-based**.
- **Phases reordered:** assets (codex) now run **before** the devices/sections that consume them (`0 scaffold → 1 motion → 2 assets → 3 devices → 4 content → 5 sections → 6 compose → 7 verify`), front-loading the highest-risk/latency step. A **"validate the tally signature beat early"** checkpoint (3.5) lands before the section run.
- **Craft forcing-functions added (the core fix):** every Phase-5 section carries a **failure-capable craft rubric** (name the one intentional compositional decision; concept visible in the section *body*, not just the gutter; neighbor-stitched rhythm check); plus a whole-page **money-shot gate** and a **cold-scroll mid-run** capture (no hovering) to prove sections 4→7 aren't empty-at-rest.
- **Hero (5.1):** composition spec + a "reads as a document header, not a hero with a label" acceptance bar; one signature **type expression** (`field-label : value` ledger heads) locked cross-cutting; **atmosphere** language for the dark sections.
- **Truck inverted:** **hand-authored open-stroke SVG is primary**; codex raster is a tracing *reference only* (auto-trace yields filled blobs, not single-stroke hairlines = clip-art). Codex `image_gen` is a hard precondition with an existing-assets fallback.
- **Technical hardening:** tally numeral **width reserved** (commas grow char-count → seal frame would reflow); `MxTally` chained-timeout/IO **cleanup on unmount**; `MxStop` reduced-motion **rests at 0° square**; custody thread `position:absolute` left-anchored in an `overflow-x:clip` wrapper; `@keyframes` must be `mx-`-prefixed (gated); MxTally **dropped from the layout mount** (it's a section owner); `/v2` **static-render** check; hero image **extension locked**; positive grep self-test; task splits (reveal verbs, truck raster/trace, in-transit scrub).
- **Codex CONFIRMED** (smoke-tested: transparent terracotta blueprint truck, 1600×600, via `image_gen`+Pillow, saved with `danger-full-access`).
- **Asset-reorg note:** the owner has a concurrent `public/miller/**` folder-flattening refactor in flight; reused-asset references are kept **structure-agnostic** and resolved at build time.

---

## CRITICAL CONTEXT: `/v2` runs UNDER the root layout

`apps/miller-web/app/layout.jsx` is the single root layout for the whole app and applies to `/v2`. For every route it renders: `<TopNav/>`, `<EmergencyBanner/>` (off on `/v2` — `shouldShowEmergencyBanner("/v2")` already returns false), `<SiteFooter/>`, `<main id="main">{children}</main>` inside `.tl-shell`, and **`<MillerScrollReveal/>` + `<MillerParallax/>` mounted globally**. Therefore:

- **The shared drivers are PRESENT and ACTIVE on `/v2`, but INERT** — they query `[data-reveal]`/`[data-reveal-stagger]`/`[data-parallax]`, which `/v2` never emits, so they match nothing (MillerScrollReveal still attaches a body ResizeObserver + runs its passes; harmless). The isolation guarantee is "**inert + root untouched**," NOT "absent."
- **v2 must NEVER emit a `<main>` element** (root owns `<main id="main">`; a nested `<main>` = double-landmark a11y violation). v2 sections are `<section aria-labelledby>` children.
- **The real isolation boundary is the root + shared files**, not `app/v2/**`. Gate them: `git diff --quiet apps/miller-web/app/layout.jsx apps/miller-web/app/styles apps/miller-web/components-v2 "apps/miller-web/app/(home)"` must pass.
- **TopNav scroll-collapse + hero-mark-swap is wired to the home hero** (`data-scroll-state="past-hero"`, the mark swap as the home hero scrolls behind it). On `/v2` the hero is `.mx-hero` — Task 5.1 must verify the nav behaves correctly over it (collapse + mark swap) or explicitly accept a static bar.
- **`v2.css` bundles globally** (in Next App Router, a CSS file imported anywhere is in the global bundle). Isolation is by **namespace** (`.mx-*` only exists on `/v2`, so rules are inert elsewhere), NOT by import site. So `v2.css` must contain: only `.mx-*` class selectors, `mx-`-prefixed `@keyframes`, no bare element/`:root` selectors, no `tl-`/`mw-` substrings, no descendant selectors reaching outside `.mx-`, and no token redefinition (consume `--c-*`/`--font-*`, never redefine).

---

## Methodology (read first)

This is visual/design work. Per-task "tests" are:
1. **Playwright capture + human-eye review** — capture against `http://localhost:3001/v2`, then open every screenshot with Read and review the pixels (structural assertions do NOT prove design quality — house rule).
2. **Isolation grep-gate + root-boundary gate** (below).
3. **Console + overflow checks** — 0 console errors; `scrollWidth === innerWidth` at 1440px and 390px (with the custody thread present).
4. **Craft rubric** (Phase 5) — a *failure-capable* subjective gate, answered in the task log, not a rubber-stamp.

Infrastructure/device tasks include complete code. Section tasks give the exact DOM skeleton, classes, content props, motion verb, and **craft acceptance bars**, then a build→capture→review→iterate loop — design CSS is tuned against pixels.

**Dev server:** already running on `:3001`. Do NOT start a second one (port collision + `.next` corruption). Note: the owner's concurrent asset-folder refactor may make the live `/` show broken images temporarily — that does not affect `/v2` work.

**The grep-gate + root-boundary gate (run in many tasks; must all pass):**
```bash
# 1. v2 emits no shared motion attrs (must print CLEAN):
grep -rEn "data-reveal(-stagger)?[^-]|data-parallax[^-]" apps/miller-web/app/v2/ && echo "FAIL: shared attr in v2" || echo "CLEAN"
# 2. v2.css is namespace-pure (must print nothing):
grep -nE "^\s*(:root|html|body|section|h[1-6]|p|a|img|ul|li|div|main)\b|@keyframes (?!mx-)|tl-|mw-" apps/miller-web/app/v2/v2.css || echo "CSS CLEAN"
# 3. root boundary untouched (must exit 0):
git diff --quiet apps/miller-web/app/layout.jsx apps/miller-web/app/styles apps/miller-web/components-v2 "apps/miller-web/app/(home)" && echo "BOUNDARY CLEAN" || echo "FAIL: boundary file changed"
# 4. positive self-test (proves the gate doesn't false-positive on data-mx-*): after MxReveal exists,
#    `grep -rc "data-mx-reveal" apps/miller-web/app/v2/` should be >0 while gate #1 still prints CLEAN.
```

**Asset paths:** all NEW assets go under `apps/miller-web/public/miller/v2/` (unaffected by the owner's reorg). REUSED-asset references (VBEC aerial, ISO seals, affiliate logos, team photos) are **structure-agnostic** — resolve the actual path at build time against the owner's current folder layout (it is mid-flatten); do not hardcode a subfolder that may move.

**Commits:** one per task on `dev`; messages `feat(miller-v2): …`. (Only commit if the owner has authorized commits this run; otherwise checkpoint per their preference.)

---

## File structure

- `apps/miller-web/app/v2/layout.jsx` — server layout: `metadata` (incl. `robots:{index:false,follow:false}`), `import "./v2.css"`, mounts **only** `<MxReveal/>` + `<MxParallax/>` (NOT MxTally — it's a section owner), wraps `{children}` in `<div className="mx-page">`. No `<main>`.
- `apps/miller-web/app/v2/page.jsx` — thin composition: `<CustodyThread/>` + the 11 sections in order; hero preload `<link>`.
- `apps/miller-web/app/v2/v2.css` — namespaced global stylesheet (`mx-` only; `mx-`-prefixed keyframes).
- `apps/miller-web/app/v2/_content/index.js` — imports `template-testing-home` consts, reshapes to `V2_*`.
- `apps/miller-web/app/v2/_components/` — `MxReveal.jsx`, `MxParallax.jsx`, `MxCountUp.jsx`, `MxTally.jsx`, `CustodyThread.jsx`, `DiamondSeal.jsx`, `TruckLine.jsx`, `marks.jsx`.
- `apps/miller-web/app/v2/_sections/` — `HeroManifest.jsx`, `CertSeals.jsx`, `CreedVow.jsx`, `ServicesIndex.jsx`, `SectorsLedger.jsx`, `FacilitySplit.jsx`, `InTransit.jsx`, `HistoryTimeline.jsx`, `ScaleTally.jsx`, `CareersCallout.jsx`, `AffiliatesMarquee.jsx`, `DispositionCta.jsx`.
- `apps/miller-web/public/miller/v2/` — `hero.<ext>`, `sector-industrial.jpg`, `sector-public.jpg`, `sector-household.jpg`, `truck-ref.png` (reference), `truck-line.svg` (shipping), optional `anchor.png`.

---

## Phase 0 — Scaffold & isolation harness

### Task 0.1: Route skeleton + isolation framing
**Files:** Create `app/v2/layout.jsx`, `app/v2/page.jsx`, `app/v2/v2.css`.
- [ ] **Step 1:** `v2.css` base — only `.mx-*` selectors (no bare element selectors, no `:root`):
```css
/* app/v2/v2.css — ALL selectors .mx-*; ALL @keyframes mx--prefixed; consume global tokens, never redefine. Isolation = this namespace + the grep-gate. v2 runs under the root layout (TopNav/footer/<main>/global drivers present). */
.mx-page { color: var(--c-ink); }
.mx-section { position: relative; }
.mx-inner { width: min(100% - clamp(48px, 8vw, 144px), 1560px); margin-inline: auto; }
```
- [ ] **Step 2:** `app/v2/layout.jsx`:
```jsx
import "./v2.css";
import { MxReveal } from "./_components/MxReveal";
import { MxParallax } from "./_components/MxParallax";

export const metadata = {
  title: "Miller Environmental — (preview)",
  robots: { index: false, follow: false },
  alternates: { canonical: "/v2" },
};

export default function V2Layout({ children }) {
  return (
    <div className="mx-page">
      {children}
      <MxReveal />
      <MxParallax />
    </div>
  );
}
```
(Create empty stub `MxReveal`/`MxParallax` returning `null` so this compiles; real bodies in Phase 1.)
- [ ] **Step 3:** `app/v2/page.jsx` placeholder — **no `<main>`** (root owns it):
```jsx
export default function V2Home() {
  return <section className="mx-inner" aria-label="preview"><h1>/v2 scaffold</h1></section>;
}
```
- [ ] **Step 4:** Verify: `curl` `/v2`→200 and `/`→200; run gate #1, #2, #3 (all CLEAN/pass); Playwright capture `/v2` at 1440px (renders inside TopNav/footer, 0 console errors, no overflow) — review screenshot.
- [ ] **Step 5:** Commit `feat(miller-v2): scaffold isolated /v2 under root layout (noindex, mx- namespace)`.

### Task 0.2: Isolation baseline
- [ ] Confirm `/` byte-identical (capture hero + a mid-frame, compare); run the root-boundary gate (#3) — must pass. Record baseline in task log.

---

## Phase 1 — Motion infrastructure

### Task 1.1: `MxReveal` driver + 4 verbs
**Files:** `app/v2/_components/MxReveal.jsx`; reveal CSS in `v2.css`.
- [ ] **Step 1:** Driver (reads ONLY `data-mx-reveal`; never bare attrs):
```jsx
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export function MxReveal() {
  const pathname = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      for (const e of es) { if (!e.isIntersecting) continue;
        const el = e.target; requestAnimationFrame(() => el.setAttribute("data-mx-in","1")); io.unobserve(el); }
    }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
    const attach = () => {
      document.querySelectorAll("[data-mx-reveal], [data-mx-reveal-stagger] > *")
        .forEach((el) => { if (el.getAttribute("data-mx-in") !== "1") io.observe(el); });
      document.querySelectorAll("[data-mx-reveal-stagger]").forEach((c) =>
        Array.from(c.children).forEach((el, i) => el.style.setProperty("--mx-i", i)));
    };
    const t1 = setTimeout(attach, 60), t2 = setTimeout(attach, 300);
    window.addEventListener("load", attach);
    return () => { io.disconnect(); clearTimeout(t1); clearTimeout(t2); window.removeEventListener("load", attach); };
  }, [pathname]);
  return null;
}
```
- [ ] **Step 2 (fade):** add `.mx-rv` base + `[data-mx-in="1"]` settled for `fade` (opacity 0→1 + 14px rise, ~520ms, one easing curve). Capture motion + reduced-motion (settled). 
- [ ] **Step 3 (line):** per-line mask-rise (`overflow:hidden` line wrapper + inner `translateY(110%)→0`), reusing the hero grammar at section scale. Capture mid-frames + reduced-motion.
- [ ] **Step 4 (cards):** staggered cascade via `--mx-i` (step ~100ms, longer travel ~560ms). Capture + reduced-motion.
- [ ] **Step 5 (clip):** `clip-path: inset(...)` wipe for images (capped to a few). Capture + reduced-motion.
- [ ] **Step 6:** Reduced-motion block: every verb → settled, no transition. Run gate #1 + positive self-test #4. Remove throwaway test elements.
- [ ] **Step 7:** Commit `feat(miller-v2): MxReveal + 4-verb reveal vocabulary`.

### Task 1.2: `MxParallax`
- [ ] Port `components/MillerParallax.jsx` to `_components/MxParallax.jsx` reading `[data-mx-parallax]`/`data-mx-parallax-speed`, rAF-coalesced, passive, reduced-motion disables + clears transform. Verify (transform changes on scroll; `none` under reduced-motion); gate CLEAN; commit.

### Task 1.3: `MxCountUp` + `MxTally`
**Files:** `MxCountUp.jsx`, `MxTally.jsx`; tally CSS in `v2.css`.
- [ ] **Step 1: `MxCountUp`** — ref-based count (IO + rAF easeOutCubic), writes `node.textContent` (with grouping), tabular-nums, **reserves final width** (render final value invisibly to size the box / `min-width` in `ch`) so a tight frame doesn't reflow as commas/digits appear; reduced-motion shows final immediately; animating digits `aria-hidden` + `tl-sr-only` final value; `onComplete` callback.
- [ ] **Step 2: `MxTally`** — ONE client component owning the sequence: on IO-enter start the count; on `onComplete` set `data-mx-seal="closed"` (seal draws closed), then (short timeout) `data-mx-tally="divider"` then `data-mx-tally="trio"`. Easing tail of the count **overlaps** the seal-close (one continuous gesture, no dead beat). Reduced-motion jumps to the fully-sealed final composition. **Clear all timeouts + disconnect IO in the effect teardown** (no post-unmount writes).
- [ ] **Step 3:** tally CSS staged states + reduced-motion final composition.
- [ ] **Step 4:** Verify with the real LIFETIME_SCALE figure: capture the full sequence frame-by-frame (count decelerates → seal closes with no dead beat → divider → trio) + reduced-motion (sealed/settled); 0 console errors (incl. a fast route-away to confirm no post-unmount warning); width does NOT reflow during count. Gate CLEAN.
- [ ] **Step 5:** Commit `feat(miller-v2): MxCountUp + MxTally (single-owner, width-reserved, one-gesture)`.

---

## Phase 2 — Asset generation (codex) — run BEFORE devices/sections

**Precondition:** confirm codex `image_gen` is available (smoke-tested ✓). If it ever fails, fall back to existing assets + owner-supplied art and note it. For each asset: call codex with the exact prompt + `danger-full-access`, save under `public/miller/v2/`, then **open the image with Read and review it** (regenerate if off).

### Task 2.1: Hero photograph — LOCK the extension
- [ ] codex prompt: *"Cinematic wide photograph of an industrial environmental / hazardous-waste treatment facility at golden hour — low raking sun, long shadows, warm amber/terracotta grade, containment yard or a hazmat-suited technician at a containment line, atmospheric haze, documentary realism, generous clean NEGATIVE SPACE in the upper-left third for overlaid text, 16:9, no text."* Save `public/miller/v2/hero.jpg` (**lock `.jpg`** so the 5.1 preload href can't drift). Review (confirm upper-left negative space). Commit.

### Task 2.2: Sector set ×3 (matched)
- [ ] ONE codex call, matched series (identical grade/lens/light): *(1) heavy industrial plant exterior, (2) municipal public-works yard, (3) household hazardous-waste drop-off — warm clay grade, same low directional light, same lens, documentary realism, no people facing camera, no text.* Save `sector-industrial.jpg`/`sector-public.jpg`/`sector-household.jpg`. Review all three together for consistency; regenerate outliers. Commit.

### Task 2.3a: Truck raster reference
- [ ] codex (transparent bg): *"Orthographic SIDE ELEVATION technical line drawing of a vacuum/roll-off waste truck, single thin terracotta stroke, no fill, no shadow, no perspective, drafting/blueprint style, squared corners, transparent background."* Save `public/miller/v2/truck-ref.png`. Review. Commit. (Reference only — see 2.3b.)

### Task 2.3b: Author the truck SVG (primary deliverable)
- [ ] **Hand-author (or codex-author-as-code)** `public/miller/v2/truck-line.svg` tracing `truck-ref.png` by eye: **open paths, `fill:none`, single `stroke` = hairline token, `vector-effect:non-scaling-stroke`, squared `stroke-linejoin/linecap`, orthographic side elevation.** (Do NOT auto-trace with potrace/vtracer — those emit filled outlines of both sides of each line, not single-stroke centerlines = clip-art.) Acceptance: renders as a crisp single-weight hairline at **both 320px and 1200px** wide; each path is single-pass so `stroke-dashoffset` self-draw traverses once (no fill double-back). Review at both scales. Commit.

### Task 2.4: Optional hero cut-out anchor
- [ ] codex (transparent bg): a sealed waste drum with a custody label OR a tech with a manifest clipboard, clean/transparent bg. Save `public/miller/v2/anchor.png`. Review/commit. (Skip if the hero composition doesn't need it.)

---

## Phase 3 — Concept devices

### Task 3.1: `mx-` atom marks
- [ ] `marks.jsx`: `MxStop` (clay square; rotates 45°→0° on a `data-mx-in` parent — **reduced-motion rests at 0° square**), `MxEyebrow` (mono label + rotated-diamond mark), `MxArrow` (`→`). Consume global tokens; never redefine. CSS in `v2.css`. Verify (incl. reduced-motion resting square); commit.

### Task 3.2: `CustodyThread` + `CustodyNode`
- [ ] **Step 1:** `CustodyThread` = a `position:absolute` (inside `position:relative .mx-page`) **left-anchored** hairline at `clamp(20px,3vw,60px)` — never `right`/negative offsets — inside an `overflow-x:clip` wrapper. A `CustodyNode` per stage = diamond seal + **screen-reader-available** stage label (`<span class="mx-node__label">01 · CERTIFIED</span>`, NOT aria-hidden) + diamond glyph (`aria-hidden`). On `data-mx-in`: node stamps (square→diamond) and the hairline segment to the next node draws. Desktop-only `@media (max-width:1100px){display:none}` — but each section ALSO renders its stage label inline (mobile + SR get the concept). The node **replaces** that section's eyebrow diamond (never both in one viewport).
- [ ] **Step 2:** Verify: nodes stamp on reveal; reduced-motion = fully drawn/settled; SR labels present in the a11y tree; **`scrollWidth===innerWidth` with the thread present** at 1440 + 390. (Full diamond-budget / node-vs-eyebrow count is a whole-page property — **deferred to Task 6.1**.) Gate CLEAN. Commit. *(The `· IN TRANSIT` scroll-scrub is NOT here — it's built+verified in Task 5.7.)*

### Task 3.3: `DiamondSeal`
- [ ] Radiused-joint rotated square matching the logomark + **seal texture** (faint embossed inset edge + mono micro-legend e.g. `ON THE RECORD`). Two instances only (hero large, tally medium). **Mobile fallback** `@media (max-width:600px)`: rotated frame → corner-bracket or bottom seal (never a full rotated box around a wrapping 300px numeral). Verify desktop (no corner collision with padding) + 390px (fallback engaged, `max-width:100%`). Commit.

### Task 3.4: `TruckLine`
- [ ] Inline-SVG component rendering `truck-line.svg` paths; self-draw via per-path `stroke-dasharray`/`stroke-dashoffset`→0 on `data-mx-in` (front→back draw order so it reads as assembling; decelerate ~1.2–1.6s); reduced-motion = fully drawn. No X-travel by default; if ever added it MUST be inside an `overflow:clip` wrapper. Verify self-draw frame-by-frame + reduced-motion drawn; no overflow. Commit.

### Task 3.5: CHECKPOINT — validate the signature beat early
- [ ] Build a **rough** `ScaleTally` (no photo deps — type + `DiamondSeal` + `MxTally` from Phases 1/3) and mount it temporarily on `/v2`. Capture the full money-shot sequence; **review: does the seal-close actually feel like THE moment?** If not, fix the beat now (before building 10 sections around it). Keep the rough version (Task 5.9 refines it). Commit `feat(miller-v2): validate tally signature beat`.

---

## Phase 4 — Content

### Task 4.1: `_content/index.js` (import & reshape)
- [ ] `import { HERO, CERTS_BANNER, CREED, SERVICES_GRID, LIFETIME_SCALE, SECTORS, FACILITY, HISTORY, CAREERS, AFFILIATES_BANNER, FINAL_CTA } from "@/lib/content/template-testing-home";` → build `V2_*`: add `stage` labels (`00 · ORIGIN` … `· DISPOSITION`), **remove the creed's giant `stat`** (keep the vow body), point photo fields at `/miller/v2/*` (hero/sectors) and **structure-agnostic** resolved paths for reused assets (VBEC etc.), add ledger fields (`lineNo`, `stageLabel`) to services/sectors items. No prose rewriting. Verify no `undefined` holes; commit.

---

## Phase 5 — Sections (build → capture → review → commit)

**Per-section CRAFT RUBRIC (answer in the task log before committing — a failure-capable gate, not a rubber-stamp):**
1. **Name the ONE intentional compositional decision** in this section (asymmetry / oversized numeral / negative-space alignment / ledger rule). If the honest answer is "centered title + lead + grid," it's a template — redo it.
2. **Is the custody concept visible in this section's BODY** (ledger grammar / stage), not just the gutter node? If only the gutter carries it, strengthen the body.
3. **Neighbor rhythm:** capture this section stitched with its two neighbors (not cropped) and confirm the dense↔quiet + dark rhythm reads (the `/` creed-spacing lesson).
4. Standard: the specced reveal verb actually fires (capture 3 mid-frames, confirm it's not silently `fade`); 0 console errors; `scrollWidth===innerWidth` at 1440+390; gate CLEAN. Sections are added to `page.jsx` incrementally.

**Cross-cutting type expression (apply in every section head, verify in 6.1):** section heads use a mono **`field-label : value` ledger grammar** — e.g. `STAGE 02 / SERVICES — WHAT WE HANDLE` set as a document field line above the condensed title. This is the one signature type move unique to `/v2`.

**Cross-cutting atmosphere (dark sections 1/6/11):** one shared authored depth language — a single raking-light gradient or faint vignette + edge registration marks (technical-drawing tone). `max-width:100%` on any decorative layer (no 390px overflow).

### Task 5.1: `HeroManifest` (dark, `00 · ORIGIN`, signature beat #1 — STILL)
- [ ] **Composition spec (not a parts list):** the masthead chrome (top hairline rule + mono ledger line `MANIFEST № · ORIGIN · INTAKE` + the large `DiamondSeal` issuing mark) renders as a single **document-header band** that frames the headline; the type block is pinned to the photo's negative-space quadrant (upper-left). Background `hero.jpg` (parallax wrap `data-mx-parallax-speed="0.12"`). **One** entrance move only (headline `line`-rise OR slow settle — not stacked); the seal lands in **stillness**. Hero atmosphere per the cross-cutting language.
- [ ] **Preload** `hero.jpg` via `<link rel="preload" as="image" fetchPriority="high" href="/miller/v2/hero.jpg">` in `page.jsx`.
- [ ] **Acceptance bars:** (a) shown cold, the first viewport reads as *the header of a document/manifest*, not *a hero with a label stuck on it*; (b) the seal lands still (capture load frames — no kinetic pile-up); (c) **TopNav behaves correctly over the v2 hero** (collapse + mark-swap, or explicitly accept the static bar); (d) LCP = hero image (preloaded), no overflow, 0 console.
- [ ] Capture (load sequence + settled + 390px + reduced-motion), review against bars, commit.

### Task 5.2: `CertSeals` (light, thin, `01 · CERTIFIED`)
- [ ] Visually **thin** band of ISO seals (keep blue) + COR; `clip`+`cards` reveal; inline stage label. Rubric + capture/review/commit.

### Task 5.3: `CreedVow` (light, the vow)
- [ ] De-statted creed — pure typographic manifesto; `line` reveal per line; accent phrase ink→clay as it rises; `MxStop` stamps last (45°→0°, reduced-motion square). No number. Rubric + capture (incl. reduced-motion)/review/commit.

### Task 5.4: `ServicesIndex` (light, `02`, ledger grammar + the user interaction)
- [ ] Services as **ledger line-items**: each row = `lineNo` + mono stage micro-label + title + a hairline baseline the custody thread visibly enters/exits; `cards` stagger. **User-driven micro-interaction:** hovering a row lights its custody node + draws its thread segment. **Fallback (must survive the loop):** if content-column→gutter-node coordination is janky, fall back to a *self-contained* row interaction (the row's own baseline draws + its line-number seal stamps on hover) — do NOT cut the interaction. Rubric + capture (incl. hover frames)/review/commit.

### Task 5.5: `SectorsLedger` (light, `03`, ledger grammar)
- [ ] 3 sector cards using the matched `sector-*.jpg` set, `clip` image reveal, ledger framing. Rubric (esp. confirm the 3 read as one art-directed set) + capture/review/commit.

### Task 5.6: `FacilitySplit` (DARK mid-anchor, `04`)
- [ ] VBEC media split (reuse aerial/building, structure-agnostic path), spec figures with **oversized-numeral** type treatment, ledger grammar, dark surface + atmosphere. `clip` media reveal. Rubric (esp. confirm the dark anchor breaks the light run) + capture/review/commit.

### Task 5.7: `InTransit` interstitial (Facility→History seam) — the ONE scroll-linked move
- [ ] Build the custody-thread **in-transit advance** here: a decorative 1px hairline draws between **two specific nodes** (a SHORT segment, not section-length) as you scroll past — line-only, `overflow-x:clip`, reduced-motion = drawn. Plus a faint `TruckLine` echo (low opacity). **Acceptance: it does NOT read as a scroll-progress indicator** (the removed-`/`-scrollbar test) — if it can't clear that bar in review, take the **draw-on-reveal fallback** (no scrub). Inherit whichever path is chosen (don't re-decide elsewhere). Rubric + capture (scroll advance + reduced-motion) + overflow check/review/commit.

### Task 5.8: `HistoryTimeline` (cream, proof)
- [ ] Timeline (draw-on-reveal) + the graded **photo** truck-plate (stats stay on the photo — NOT linework); `/v2` timeline markers are **plain ticks**, not diamonds. Rubric + capture/review/commit.

### Task 5.9: `ScaleTally` (DARK, `Σ · TO DATE`, THE money shot)
- [ ] Refine the Task-3.5 rough version: `MxTally` sequence — eyebrow → `MxCountUp` (width-reserved) inside the `DiamondSeal` (medium) → seal closes on the final value (one continuous gesture) → divider draws → trio staggers. Atmosphere: soft radial warmth behind the seal (`max-width:100%`). Mobile fallback per 3.3. **Acceptance: this is the frame you'd submit to Awwwards** — if it isn't, it's not done. Capture full sequence + reduced-motion (sealed) + 390px; review; commit.

### Task 5.10: `CareersCallout` (light, the people)
- [ ] Photo-bleed careers callout (reuse/codex team photos); `clip` reveal. Rubric + capture/review/commit.

### Task 5.11: `AffiliatesMarquee` (light, countersignatures, buffer)
- [ ] Affiliate logos reframed as **countersignatures** (mono `COUNTERSIGNED` eyebrow); marquee (reduced-motion: static row). Rubric + capture/review/commit.

### Task 5.12: `DispositionCta` (DARK, `· DISPOSITION`, signature beat #3)
- [ ] The close: `TruckLine` **self-draws** (arrival, front→back) → triggers the close `MxStop` "DELIVERED" stamp (lands on the last path completing) → the CTA (contact / 24-7). Atmosphere: faint blueprint-grid (this section only, `max-width:100%`). Reduced-motion = truck drawn + stamp shown. No X-travel (self-draw only). Rubric + capture (self-draw + stamp + reduced-motion + 390px no-overflow)/review/commit.

---

## Phase 6 — Composition & global rhythm

### Task 6.1: Assemble + the whole-page craft gates
- [ ] **Step 1:** `page.jsx` orders all 11 sections + `<CustodyThread stages={…}/>`; hero preload present.
- [ ] **Step 2 — full-page review:** slow-scroll (fire reveals), capture viewport segments top→bottom at 1440px; review every one. Confirm: dark rhythm at **1/6/8/11** none-adjacent; custody thread continuous + legible; the **type expression** (field-label:value heads) is applied consistently; tally is unmistakably THE moment.
- [ ] **Step 3 — COLD-SCROLL mid-run gate:** load `/v2` fresh, do ONE continuous reading-speed scroll top→bottom **without hovering**, capture sections 4→7. **They must NOT be blank/static voids at rest** — ledger grammar must give the body weight without hover. If 5.4/5.5 only come alive on hover, that's a FAIL (the `/` disease) — fix before proceeding.
- [ ] **Step 4 — diamond-budget gate:** count diamonds per viewport across the whole page ≤ current `/`; confirm no node+eyebrow doubling; timeline = ticks.
- [ ] **Step 5 — money-shot gate:** identify the one frame you'd submit to Awwwards and justify why it isn't forgettable. If you can't, the page is evenly-good-everywhere = forgettable — strengthen the hero (5.1) / tally (5.9).
- [ ] **Step 6:** tune spacing/rhythm against pixels (judge against neighbors, never cropped). Commit.

---

## Phase 7 — Verification, a11y, polish

### Task 7.1: Full acceptance matrix
- [ ] Playwright: desktop 1440 (segments) + mobile 390 + reduced-motion context. Each: 0 console errors; `scrollWidth===innerWidth`; reveals/beats fire (motion) and rest in *designed* states (reduced-motion). Run all gates (#1 v2 attrs, #2 v2.css purity, #3 **root boundary untouched**). Recapture `/` — byte-identical. Review ALL screenshots; fix anything not award-tier. Commit.

### Task 7.2: Accessibility
- [ ] No double-`<main>` (root owns it); manifest stage labels present in the a11y tree (not all aria-hidden); count-up SR final value announced once; keyboard tab order + visible clay focus rings; TopNav usable over the v2 hero; AA contrast spot-checks on dark sections; landmarks. Fix + commit.

### Task 7.3: Perf + final
- [ ] LCP = preloaded hero; CLS ≈ 0 (explicit dims); below-fold lazy; clip-path capped. **Confirm `/v2` is statically rendered** (`next build` lists it static, not `ƒ` dynamic). Lighthouse spot-check if available. Clean up temp capture scripts. Final commit `feat(miller-v2): /v2 award home — verification + polish`. Optionally append a `/v2` note to the design canon (now `references/white-owl-design-system.md` inside the website-design skill — `docs/DESIGN-SYSTEM.md` is a stub) only if promoting.

---

## Self-review (run against the spec)

- **Spec coverage:** §2 concept → 3.2 (thread, load-bearing) + ledger grammar (5.4/5.5/5.6) + SR stages (3.2/4.1). §4 sequence (1/6/8/11, careers↔affiliates) → Phase 5 order + 6.1. §6 motion (4 verbs + 3 beats + in-transit + hover) → 1.1, 5.1, 5.9, 5.12, 5.4, 5.7. §7 diamond budget → 3.2/3.3 + 6.1 gate. §8 truck (authored vector, one, history=photo) → 2.3b, 3.4, 5.8, 5.12. §9 photos → Phase 2 (front-loaded). §10 a11y/perf → 7.1/7.2/7.3 + per-section. §3 isolation → 0.1, root-layout framing, gates everywhere, 7.1. Money shot → 3.5 + 5.9 + 6.1 gate. Type expression → cross-cutting (5.x) + 6.1. Atmosphere → cross-cutting + 5.1/5.9/5.12. **No uncovered requirement.**
- **Placeholder scan:** infra/devices carry complete code; sections use specs + craft-rubric build-loop (documented methodology, with failure-capable gates — not vague TODOs); codex prompts exact; no "add error handling"-style steps.
- **Type/name consistency:** attrs `data-mx-reveal`/`-stagger`/`-parallax`/`-in`; states `data-mx-seal`/`-tally`; consts `V2_*`; components `Mx*`/`CustodyThread`/`CustodyNode`/`DiamondSeal`/`TruckLine`; classes `mx-*`; keyframes `mx-*`. Layout mounts MxReveal+MxParallax only; MxTally lives in ScaleTally. Consistent.

## Residual risks
- Codex emits raster → truck SVG is **hand-authored** (2.3b), raster is reference; existing-asset fallback if codex unavailable.
- Tally diamond at hero scale → mobile fallback (3.3) + width-reserve (1.3) + desktop collision check (5.9).
- In-transit scrub → must clear the "not a scroll-progress bar" bar (5.7) or fall back to draw-on-reveal.
- Isolation rests on the `mx-` namespace + grep-gate + root-boundary gate (global `v2.css` over CSS Module per spec §3 fallback — Modules don't scope `data-mx-*`/keyframes/pseudo-elements anyway; the gate is the real boundary).
- Owner's concurrent `public/miller/**` reorg → reused-asset paths resolved structure-agnostically at build time.
