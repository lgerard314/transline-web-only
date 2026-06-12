"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
import { FigureStat01 } from "@/components-v2/04_blocks/stats/figure-stat-01";
import { ImageAccordion01 } from "@/components-v2/05_widgets/galleries/image-accordion-01";
import { Fac2Dumptruck01 } from "@/components-v2/05_widgets/graphics/fac2-dumptruck-01";
import { sectionProps } from "@/components-v2/section-config";

// MediaSplit01 — the home VBEC (facility) section. A 40/60 split on a cream section. Two phases:
//
// ENTRANCE (as the section scrolls in to fill the viewport):
//   LEFT  — intro rests visible at final alignment (no clip or mask-rise).
//   RIGHT — rises UP from below on easeInOut(E) so the media column finishes with pin-in.
//
// PINNED SEQUENCE (once the section fills the viewport):
//   1. HIGHLIGHTS — scroll-scrubbed (FIG_START_P → FIG_END_P on pin P) begins as soon as the
//      section pins; the 3-figure band grows out from under the photos (reverses on scroll-up).
//   2. SWIPE — after highlights finish, SWIPE_HOLD_P of extra scroll before the media exit
//      scrubs; that nudge arms a
//      careers-style auto-advance (zoom-collage-01: one rAF loop, window.scrollBy while
//      pinned, accelerating pace) that scroll-drives the photo exit → SWIPE_END.
//      Remaining track height below SWIPE_END is release scroll after the sequence.
//
// Mobile / reduced-motion: no pin, beige section, columns at rest. Styling: app/styles/home/facility.css + facility-pin.css.
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = (x) => 1 - Math.pow(1 - x, 3);            // easeOutCubic (highlights)
const easeIn = (x) => x * x * x;                       // easeInCubic — slow start, speeds up (truck fade)
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

const FIG_START_P = 0;        // highlights scrub begins as soon as the section pins (no pre-hold)
const FIG_END_P = 0.09;       // pin P where the highlights band is fully grown (0.09 scrub span)
const SWIPE_HOLD_P = 0.10;    // pin P hold after highlights land before the media exit scrubs
const EXIT_MS = 1200;       // base auto-advance pace for the photo exit (careers DIVE_MS pattern)
const USER_IDLE_MS = 160;   // pause auto-nudge while the user is actively scrolling
const SWIPE_END = 0.9;      // pin P where media is fully off-screen and diamonds are in
const EXIT_PAD = 32;        // px past the viewport right edge once exit completes
const CAP_TIP = 0.5 - Math.SQRT1_2 / 2; // left vertex of a 45° diamond in its inner box
const CAP_ROT = 210;        // deg base spin as each diamond rotates in (settles to 0)
const CAP_SPIN = 120;       // extra rotation added on top of CAP_ROT at enter
const CAP_LAUNCH_OVERLAP = 0.32; // fraction of a diamond covered by the media edge at launch
const CAP_START_SCALE = 0.25;

// Capabilities "diamond of diamonds" — 8 diamonds on the who-we-serve argyle lattice (6×6 cells,
// each diamond a 2×2 box; (col+row) even keeps them on the lattice). A TITLE diamond crowns the
// top; 7 capability diamonds ring an EMPTY centre.
const CAP_COLS = 6, CAP_ROWS = 6;
const CAP_SX = 100 / CAP_COLS, CAP_SY = 100 / CAP_ROWS;
const CAP_SLOTS = [
  { col: 1, row: 1 }, { col: 3, row: 1 },
  { col: 0, row: 2 }, { col: 4, row: 2 },
  { col: 1, row: 3 }, { col: 3, row: 3 },
  { col: 2, row: 4 },
];
const CAP_TONES = ["#3D594A", "#465E67", "#735A38", "#7A462D", "#51483A", "#38564F", "#3E4E5C"];
const capDiaStyle = (col, row, extra) => ({ left: `${col * CAP_SX}%`, top: `${row * CAP_SY}%`, width: `${2 * CAP_SX}%`, ...extra });
const capSoftWrap = (s) => s.replace(/([/-])/g, "$1" + String.fromCharCode(0x200b));
const capText = (cap) => (typeof cap === "string" ? cap : cap?.name || "");
const capDetail = (cap, lines, i) => (typeof cap === "string" ? lines?.[i] || "" : cap?.line || cap?.detail || lines?.[i] || "");

export function MediaSplit01({ content, config = {} }) {
  const { eyebrow, stage, title, lead, figures, capsTitle, capabilities, capabilityLines, primaryCta, aboutLink, headingId, photos } = content;
  const autoScroll = config.autoScroll !== false;
  const trackRef = useRef(null);
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const mediaRef = useRef(null);
  const figsRef = useRef(null);
  const capsRef = useRef(null);
  const altRef = useRef(null);
  const [activeCap, setActiveCap] = useState(null);
  const activeCapRef = useRef(null);
  const [centerTurn, setCenterTurn] = useState(0);
  // Whether the PIN can own the entrance (mirrors canPin below / the CSS pin gate). On
  // pin-capable surfaces the gallery rests at --p=1 (reveal={false}) and the pin choreography
  // is the entrance; on FLOW surfaces (portrait, narrow, short, reduced-motion-off scrub) the
  // gallery runs its own scroll-scrubbed plate-cascade entrance instead. Initial `true` keeps
  // SSR/desktop byte-stable (no hidden-panel flash); phones flip after hydration, before the
  // section scrolls into view.
  const [pinCapable, setPinCapable] = useState(true);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mqs = ["(min-width: 901px)", "(orientation: landscape)", "(min-height: 640px)"].map((q) => window.matchMedia(q));
    const mqRM = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPinCapable(mqs.every((m) => m.matches) && !mqRM.matches);
    sync();
    [...mqs, mqRM].forEach((m) => m.addEventListener("change", sync));
    return () => [...mqs, mqRM].forEach((m) => m.removeEventListener("change", sync));
  }, []);

  // FLOW-ONLY scroll motion (the CSS lives in the flow media blocks of facility-pin.css, so
  // the pinned desktop can never see it; the writes likewise only happen when the pin can't
  // own them). Figures: one-shot staggered rise when the band enters ([data-figs-in]).
  // Diamond cluster: the desktop ROLL-IN as a reversible SCROLL SCRUB — each cell launches
  // a width above-left and falls down-right with spin + scale into its lattice slot (the
  // same vars + formulas the pinned sequence writes), staggered by cell order, while the
  // dumptruck slides in from the right behind it. The ALT capability spine below the
  // cluster gets one scrubbed progress var (--capalt-p); its per-item cascade is pure CSS.
  // Reduced motion: no writes — the CSS defaults rest everything settled.
  useEffect(() => {
    if (typeof window === "undefined" || pinCapable) return;
    const mqRM = window.matchMedia("(prefers-reduced-motion: reduce)");
    const figclip = figsRef.current ? figsRef.current.parentElement : null;
    const caps = capsRef.current;
    const alt = altRef.current;

    const cells = caps ? Array.from(caps.querySelectorAll(".mw-cap-dia__cell")) : [];
    const truck = caps ? caps.querySelector(".mw-fac2__truck") : null;
    const stage = caps ? caps.querySelector(".mw-fac2__stage") : null;
    const SPIN = CAP_ROT + CAP_SPIN;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (mqRM.matches) return;
      const vh = window.innerHeight || 1;
      // FIGURES — scroll-scrubbed, completing exactly when the band is fully on-screen:
      // since the band sits ABOVE the capability rail, it is always fully rendered before
      // the rail's first card can begin (visual order guaranteed structurally, not by
      // timers). Reversible with scroll.
      if (figclip) {
        const fr = figclip.getBoundingClientRect();
        if (fr.bottom > -200 && fr.top < vh + 300) {
          figclip.style.setProperty("--figs-p", clamp01((vh - fr.top) / Math.max(1, fr.height)).toFixed(3));
        }
      }
      if (caps && cells.length && caps.offsetParent !== null) { // skip when the lattice is display:none (≤900)
        const r = caps.getBoundingClientRect();
        if (r.bottom > -200 && r.top < vh + 300) {
          const p = clamp01((vh - r.top) / (vh * 0.78));
          cells.forEach((cell, k) => {
            const raw = clamp01((p - k * 0.055) / 0.5);
            const e = ease(raw);
            const boxW = cell.offsetWidth || 60;
            cell.style.setProperty("--cap-tx", ((1 - e) * -boxW).toFixed(1) + "px");
            cell.style.setProperty("--cap-ty", ((1 - e) * -boxW * 0.5).toFixed(1) + "px");
            cell.style.setProperty("--cap-rot", (-(1 - e) * SPIN).toFixed(1) + "deg");
            cell.style.setProperty("--cap-sc", (CAP_START_SCALE + (1 - CAP_START_SCALE) * e).toFixed(3));
            cell.style.setProperty("--cap-op", clamp01(raw / 0.12).toFixed(3));
          });
          if (truck && stage) {
            const t = easeIn(clamp01((p - 0.2) / 0.65));
            const sw = stage.getBoundingClientRect().width || 300;
            truck.style.setProperty("--fac2-truck-op", t.toFixed(3));
            truck.style.setProperty("--fac2-truck-x", ((1 - t) * sw * 0.28).toFixed(1) + "px");
          }
        }
      }
      if (alt) {
        const ar = alt.getBoundingClientRect();
        if (ar.bottom > -200 && ar.top < vh + 300) {
          // The rail's cascade spans from its own entry to the SECTION's bottom clearing the
          // screen bottom — p = 1 exactly then, and the per-card slices (CSS) are spread so
          // the LAST card lands at p = 1: the rail is still assembling the whole way down,
          // never "already done" early.
          const secEl = sectionRef.current;
          const secBottom = secEl ? secEl.getBoundingClientRect().bottom : ar.bottom;
          alt.style.setProperty("--capalt-p", clamp01((vh - ar.top) / Math.max(1, secBottom - ar.top)).toFixed(3));
        }
      }
      // STRIP WIPE (≤900 — CSS consumes it there only): the photo card expands in from the
      // RIGHT screen edge moving LEFT, completing exactly when the TITLE below it (the
      // section header) has its top at the screen bottom — fully revealed before the
      // headline enters.
      const iaccEl = mediaRef.current ? mediaRef.current.querySelector(".mw-iacc") : null;
      const titleEl = sectionRef.current ? sectionRef.current.querySelector(".mw-fac2__title") : null;
      if (iaccEl && titleEl) {
        const ir = iaccEl.getBoundingClientRect();
        if (ir.bottom > -200 && ir.top < vh + 300) {
          const titleTop = titleEl.getBoundingClientRect().top;
          const span = Math.max(1, titleTop - ir.top);
          iaccEl.style.setProperty("--fac2-strip-p", clamp01((vh - ir.top) / span).toFixed(3));
        }
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    // Requeue after the main pin effect's flow-clear (same IO-ordering pattern as lifetime).
    const io = new IntersectionObserver(onScroll, { threshold: 0, rootMargin: "300px 0px" });
    if (figclip) io.observe(figclip);
    if (caps) io.observe(caps);
    if (alt) io.observe(alt);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (figclip) figclip.style.removeProperty("--figs-p");
      cells.forEach((c) => ["--cap-tx", "--cap-ty", "--cap-rot", "--cap-sc", "--cap-op"].forEach((p) => c.style.removeProperty(p)));
      if (truck) { truck.style.removeProperty("--fac2-truck-op"); truck.style.removeProperty("--fac2-truck-x"); }
      if (alt) alt.style.removeProperty("--capalt-p");
      const iaccCleanup = mediaRef.current ? mediaRef.current.querySelector(".mw-iacc") : null;
      if (iaccCleanup) iaccCleanup.style.removeProperty("--fac2-strip-p");
    };
  }, [pinCapable]);
  const activateCap = (i) => {
    const prev = activeCapRef.current;
    if (prev !== null && prev !== i) setCenterTurn((turn) => turn + 1);
    activeCapRef.current = i;
    setActiveCap(i);
  };
  const clearActiveCap = () => {
    activeCapRef.current = null;
    setActiveCap(null);
  };
  // Touch/flow: a tap OUTSIDE the cluster clears the active capability (mouseleave never
  // fires on touch, so the sticky selection had no way off). Desktop keeps mouseleave.
  useEffect(() => {
    if (typeof document === "undefined" || activeCap === null) return;
    const onDown = (e) => {
      if (e.target && e.target.closest && e.target.closest(".mw-cap-dia")) return;
      clearActiveCap();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [activeCap]);
  // Careers-style driver (zoom-collage-01): one continuous rAF loop while the track is in
  // view reads scroll → writes the scene, auto-advances the exit once the user nudges past
  // the highlights hold. Wide viewport + motion OK only; otherwise columns rest static.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const track = trackRef.current;
    if (!track) return;
    // Mirrors the CSS pin gate in home/facility-pin.css exactly: landscape-only, ≥640px tall,
    // motion-OK (motion-test rule, playbook §0: STATIC-composition pins like this one
    // never pin on portrait; full-screen-converging choreographies are the exception).
    const mqWide = window.matchMedia("(min-width: 901px)");
    const mqLand = window.matchMedia("(orientation: landscape)");
    const mqTall = window.matchMedia("(min-height: 640px)");
    const mqRM = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canPin = () => mqWide.matches && mqLand.matches && mqTall.matches && !mqRM.matches;
    let raf = 0, running = false, lastTs = 0, lastY = window.scrollY;
    let exitArmed = false, cancelled = false;
    let lastUserTs = -1e9;

    const onUserInput = (e) => { lastUserTs = e.timeStamp; };

    const resetPinClocks = () => {
      exitArmed = false;
      cancelled = false;
    };

    const idleState = () => ({
      entranceDone: false,
      P: 0,
      sweep: 0,
      figDone: false,
      swipeGate: FIG_END_P + SWIPE_HOLD_P,
      total: 1,
      pinned: false,
    });

    const render = () => {
      const track = trackRef.current, section = sectionRef.current;
      const left = leftRef.current, right = rightRef.current;
      const media = mediaRef.current, figs = figsRef.current, caps = capsRef.current;
      if (!track || !section || !left || !right || !media || !figs || !caps) {
        return idleState();
      }
      if (!canPin()) {
        const introOff = left.querySelector(".mw-fac2__intro");
        if (introOff) {
          introOff.style.removeProperty("--fac2-intro-y");
          introOff.style.removeProperty("clip-path");
        }
        right.style.removeProperty("--fac2-right-y");
        media.style.removeProperty("--fac2-media-x");
        media.style.removeProperty("--fac2-media-op");
        media.style.removeProperty("visibility");
        delete media.dataset.figDone;
        caps.style.removeProperty("--fac2-cap-y");
        if (figs.parentElement) figs.parentElement.style.removeProperty("--fac2-fig-h");
        track.style.removeProperty("--fac2-head-off");
        const g = caps.querySelector(".mw-cap-dia");
        if (g) g.querySelectorAll(".mw-cap-dia__cell").forEach((c) => { c.style.removeProperty("--cap-sc"); c.style.removeProperty("--cap-op"); c.style.removeProperty("--cap-tx"); c.style.removeProperty("--cap-ty"); c.style.removeProperty("--cap-rot"); });
        const truckOff = caps.querySelector(".mw-fac2__truck");
        if (truckOff) {
          truckOff.style.removeProperty("--fac2-truck-op");
          truckOff.style.removeProperty("--fac2-truck-x");
        }
        delete media.dataset.iaccHover;
        resetPinClocks();
        return idleState();
      }
      // Pin immediately BELOW the fixed header (read it live — it collapses on scroll).
      const header = document.querySelector(".tl-topbar");
      const headOff = header ? Math.round(header.getBoundingClientRect().bottom) : 115;
      track.style.setProperty("--fac2-head-off", headOff + "px");

      const vh = window.innerHeight || document.documentElement.clientHeight || 1;
      const vw = window.innerWidth || document.documentElement.clientWidth || 1;
      const secTop = section.getBoundingClientRect().top;   // sticky-resolved top
      const trackTop = track.getBoundingClientRect().top;
      const span = Math.max(1, vh - headOff);

      // ENTRANCE E: 0 when the section top is at the screen bottom → 1 at pin-in (fills viewport).
      const E = clamp01((vh - secTop) / span);
      // PIN P: 0 at pin-in → 1 at release.
      const total = Math.max(1, track.offsetHeight - vh + headOff);
      const P = clamp01((headOff - trackTop) / total);

      // ENTRANCE — left intro rests visible; right column rises UP on the same curve.
      const u = easeInOut(E);
      const intro = left.querySelector(".mw-fac2__intro");
      if (intro) {
        intro.style.removeProperty("--fac2-intro-y");
        intro.style.removeProperty("clip-path");
      }

      const coverR = right.offsetHeight || span;
      right.style.setProperty("--fac2-right-y", ((1 - u) * coverR).toFixed(1) + "px");

      // PIN 1 — HIGHLIGHTS: scroll-scrubbed figclip growth (FIG_START_P → FIG_END_P on pin P).
      const entranceDone = E >= 0.999;
      const figSpan = Math.max(0.001, FIG_END_P - FIG_START_P);
      const figIn = entranceDone && P >= FIG_START_P
        ? ease(clamp01((P - FIG_START_P) / figSpan))
        : 0;
      const figDone = entranceDone && P >= FIG_END_P;
      const swipeGate = FIG_END_P + SWIPE_HOLD_P;
      const figclip = figs.parentElement;
      if (figclip) figclip.style.setProperty("--fac2-fig-h", (figs.offsetHeight * figIn).toFixed(1) + "px");

      // Freeze scroll parallax on the photos while highlights scrub (same scroll also
      // grows the figclip — MillerParallax must not rewrite --px-* on the images).
      if (figIn > 0) media.dataset.figReveal = "1";
      else delete media.dataset.figReveal;

      media.dataset.figDone = figDone ? "1" : "";

      // PIN 2 — SWIPE (scroll-scrubbed): only after highlights AND SWIPE_HOLD_P extra scroll
      // past FIG_END_P — so the band can rest before the media exit begins.
      const sweep = figDone && P > swipeGate
        ? clamp01((P - swipeGate) / Math.max(0.001, SWIPE_END - swipeGate))
        : 0;

      // Mouse parallax on the big photo once entrance finishes and before the exit swipe.
      const photoReady = entranceDone && sweep < 0.001;
      if (photoReady) media.dataset.iaccHover = "1";
      else delete media.dataset.iaccHover;
      const exitT = sweep;
      const exitDone = figDone && sweep >= 1;

      const rightRect = right.getBoundingClientRect();
      const rightTop = rightRect.top;
      // Use transform-independent layout metrics for the swipe. Reading
      // getBoundingClientRect().left here would include the previous
      // --fac2-media-x write, which can feed back into the next frame when the
      // page initializes below this pinned section and the user scrolls upward.
      const mediaBaseLeft = rightRect.left + media.offsetLeft;
      const mediaBaseWidth = media.offsetWidth || media.getBoundingClientRect().width;
      const exitDist = (vw - mediaBaseLeft) + mediaBaseWidth + EXIT_PAD;
      const mediaX = exitT * exitDist;
      media.style.setProperty("--fac2-media-x", mediaX.toFixed(1) + "px");
      const mediaFade = ease(clamp01((exitT - 0.72) / 0.28));
      media.style.setProperty("--fac2-media-op", (1 - mediaFade).toFixed(3));
      if (exitDone) media.style.visibility = "hidden";
      else media.style.removeProperty("visibility");
      const containerLeft = mediaBaseLeft + mediaX;
      // Shared body-content right edge (.mw-inner): width min(100% - clamp(48px, 8vw, 144px), 1560px), centred.
      const bodyGutter = Math.max(Math.min(72, Math.max(24, 0.04 * vw)), (vw - 1560) / 2);
      const bodyContentRight = vw - bodyGutter;

      // Park the diamond grid at the right column's vertical centre (matches flex-centred media).
      const capsH = caps.offsetHeight;
      const rightCenter = rightRect.top + rightRect.height / 2;
      caps.style.setProperty("--fac2-cap-y", ((rightCenter - rightTop) - capsH / 2).toFixed(1) + "px");

      // 8 diamonds × 1 rule: each diamond starts one width above-left, already tucked
      // under the moving media edge, then falls down-right on a straight 45° path into
      // its final lattice slot. The first diamond to launch settles first; each later
      // launch follows, with the final diamond settled once the media clears the body
      // content width.
      const grid = caps.querySelector(".mw-cap-dia");
      if (grid) {
        const gridLeft = grid.getBoundingClientRect().left;
        const cells = grid.querySelectorAll(".mw-cap-dia__cell");
        const metrics = Array.from(cells, (cell) => {
          const inner = cell.querySelector(".mw-cap-dia__d");
          const boxLeft = gridLeft + cell.offsetLeft + (inner?.offsetLeft || 0);
          const boxW = inner?.offsetWidth || cell.offsetWidth;
          const diamondLeft = boxLeft + boxW * CAP_TIP;
          const startX = -boxW;
          const startRight = boxLeft + boxW * (1 - CAP_TIP) + startX;
          const launchEdge = startRight - boxW * CAP_LAUNCH_OVERLAP;
          return { cell, boxW, startX, launchEdge };
        });
        const edge = containerLeft;
        const lastLaunchEdge = Math.max(...metrics.map((m) => m.launchEdge));
        const settleSpan = Math.max(1, bodyContentRight - lastLaunchEdge);
        const spinTotal = -(CAP_ROT + CAP_SPIN);
        for (const { cell, boxW, startX, launchEdge } of metrics) {
          const travelPx = edge - launchEdge;
          const raw = travelPx <= 0
              ? 0
              : clamp01(travelPx / settleSpan);
          const spin = ease(raw);
          const scale = CAP_START_SCALE + (1 - CAP_START_SCALE) * ease(raw);
          const startY = -boxW * 0.5;
          const pathX = (1 - raw) * startX;
          const pathY = (1 - raw) * startY;
          if (raw <= 0) {
            cell.style.setProperty("--cap-sc", CAP_START_SCALE.toFixed(3));
            cell.style.setProperty("--cap-rot", spinTotal + "deg");
            cell.style.setProperty("--cap-tx", startX.toFixed(1) + "px");
            cell.style.setProperty("--cap-ty", startY.toFixed(1) + "px");
            cell.style.setProperty("--cap-op", "0");
            continue;
          }
          cell.style.setProperty("--cap-sc", scale.toFixed(3));
          cell.style.setProperty("--cap-rot", ((1 - spin) * spinTotal).toFixed(1) + "deg");
          cell.style.setProperty("--cap-tx", pathX.toFixed(1) + "px");
          cell.style.setProperty("--cap-ty", pathY.toFixed(1) + "px");
          cell.style.setProperty("--cap-op", ease(clamp01(raw / 0.08)).toFixed(3));
        }
      }

      // Dumptruck exit — parked in the stage behind the diamonds (final rest = translateX 0).
      // Starts tucked right under the media container, slides LEFT into centre as the media
      // block exits right. Window: first movement → media fully past body-content. Ease-in.
      const truck = caps.querySelector(".mw-fac2__truck");
      const stage = caps.querySelector(".mw-fac2__stage");
      if (truck && stage) {
        const stageRect = stage.getBoundingClientRect();
        const truckFadeSpan = Math.max(1, bodyContentRight - stageRect.left);
        const truckFadeTravel = containerLeft - stageRect.left;
        const truckRaw = truckFadeTravel <= 0 ? 0 : clamp01(truckFadeTravel / truckFadeSpan);
        const truckEase = easeIn(truckRaw);
        const mediaRight = mediaBaseLeft + mediaX + mediaBaseWidth;
        const tuckRight = Math.max(0, mediaRight - stageRect.right, mediaBaseWidth * 0.22);
        const truckX = tuckRight * (1 - truckEase);
        truck.style.setProperty("--fac2-truck-op", truckEase.toFixed(3));
        truck.style.setProperty("--fac2-truck-x", truckX.toFixed(1) + "px");
      }

      const pinned = entranceDone && P < 1 && secTop <= headOff + 4 && track.getBoundingClientRect().bottom > vh;
      return {
        entranceDone,
        P,
        sweep,
        figDone,
        swipeGate,
        total,
        pinned,
      };
    };

    const loop = (ts) => {
      if (!canPin()) { stop(); render(); return; }
      raf = requestAnimationFrame(loop);
      const dt = lastTs ? Math.min(50, ts - lastTs) : 16.7;
      lastTs = ts;

      const state = render();

      if (autoScroll) {
        const y = window.scrollY;
        const userActive = ts - lastUserTs < USER_IDLE_MS;
        if (state.figDone && state.P > state.swipeGate) exitArmed = true;
        if (state.P <= state.swipeGate) {
          cancelled = false;
          exitArmed = false;
        }
        if (!cancelled && state.pinned && exitArmed && state.sweep < 1 && y < lastY - 1) cancelled = true;

        // Careers auto-advance: real scroll, animation feel — accelerating pace, instant steps.
        // Only honour USER_IDLE_MS once the exit is visibly underway so the arming nudge does
        // not stall the self-run (careers never has a separate arm step).
        const userBlocks = userActive && state.sweep > 0.05;
        if (exitArmed && state.pinned && state.sweep < 1 && !cancelled && !userBlocks) {
          const exitDist = Math.max(1, (SWIPE_END - state.swipeGate) * state.total);
          const v = (exitDist / EXIT_MS) * 0.924 * (1 + 3 * state.sweep);
          window.scrollBy({ top: v * dt, behavior: "instant" });
        }
        lastY = window.scrollY;
      }
    };

    const start = () => {
      if (running || !canPin()) return;
      running = true;
      lastTs = 0;
      lastY = window.scrollY;
      if (autoScroll) {
        window.addEventListener("wheel", onUserInput, { passive: true });
        window.addEventListener("touchmove", onUserInput, { passive: true });
      }
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      if (autoScroll) {
        window.removeEventListener("wheel", onUserInput);
        window.removeEventListener("touchmove", onUserInput);
      }
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      render();
    };
    const evaluate = () => { if (canPin()) start(); else { stop(); render(); } };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) start();
      else stop();
    }, { threshold: 0 });
    io.observe(track);
    mqWide.addEventListener("change", evaluate);
    mqLand.addEventListener("change", evaluate);
    mqTall.addEventListener("change", evaluate);
    mqRM.addEventListener("change", evaluate);
    evaluate();
    return () => {
      io.disconnect();
      stop();
      mqWide.removeEventListener("change", evaluate);
      mqLand.removeEventListener("change", evaluate);
      mqTall.removeEventListener("change", evaluate);
      mqRM.removeEventListener("change", evaluate);
    };
  }, [autoScroll]);

  return (
    <div className="mw-fac2-track" ref={trackRef}>
      <section className="mw-fac2" aria-labelledby={headingId} ref={sectionRef} {...sectionProps(config)}>
        <div className="mw-inner">
          <div className="mw-fac2__grid">
            {/* LEFT — intro copy at rest (no entrance choreography). */}
            <div className="mw-fac2__left" ref={leftRef}>
              {/* Each intro part sits in a .mw-fac2__rise mask (the designed hero mask-rise —
                  CSS exists in facility.css): on FLOW surfaces the gallery widget's scroll
                  cascade drives --p so the text mask-rises after the photos; on the pinned
                  desktop reveal={false} rests every riser at --p=1 — byte-identical render.
                  The modifier classes are the ≤900 single-column ordering hooks. */}
              <div className="mw-fac2__intro">
                <header className="mw-fac2__head">
                  <div className="mw-fac2__rise mw-fac2__rise--field"><div className="mw-fac2__rise-in">
                    <p className="mw-fac2__field">
                      {stage ? <span>{stage}</span> : null}
                      <span className="mw-fac2__field-rule" />
                      <span>{eyebrow}</span>
                    </p>
                  </div></div>
                  <div className="mw-fac2__rise mw-fac2__rise--title"><div className="mw-fac2__rise-in">
                    <h2 id={headingId} className="mw-fac2__title">
                      {title.em}
                    </h2>
                  </div></div>
                </header>

                <div className="mw-fac2__rise mw-fac2__rise--lead"><div className="mw-fac2__rise-in">
                  <p className="mw-fac2__lead">{lead}</p>
                </div></div>

                <div className="mw-fac2__rise mw-fac2__rise--actions"><div className="mw-fac2__rise-in">
                  <div className="mw-fac2__actions">
                    <SolidCta01 href={primaryCta.href}>
                      <span className="mw-fac2__lbl-long">{primaryCta.longLabel}</span>
                      <span className="mw-fac2__lbl-short">{primaryCta.shortLabel}</span>
                      {" "}<ActionArrow01 />
                    </SolidCta01>
                    <Link href={aboutLink.href} className="mw-fac2__about">
                      <span className="mw-fac2__lbl-long">{aboutLink.longLabel}</span>
                      <span className="mw-fac2__lbl-short">{aboutLink.shortLabel}</span>
                      {" "}<span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div></div>
              </div>
            </div>

            {/* RIGHT — two stacked layers: MEDIA (photos + highlights band) which
                rises in then swipes RIGHT, and CAPS (the diamond cluster) parked centred behind it,
                rolling in as the media uncovers it. */}
            <div className="mw-fac2__right" ref={rightRef}>
              <div className="mw-fac2__media" ref={mediaRef}>
                <ImageAccordion01 photos={photos} reveal={!pinCapable} label="Vaughn Bullough Environmental Centre photo gallery" />
                {/* Clip band — the 3 highlights grow out from under the photos (no container). */}
                <div className="mw-fac2__figclip">
                  <dl className="mw-fac2__figs" aria-label="Facility figures" ref={figsRef}>
                    {figures.map((f) => (<FigureStat01 key={f.label} label={f.label} num={f.num} unit={f.unit} />))}
                  </dl>
                </div>
              </div>

              {/* Onsite capabilities — dumptruck slides left out of the media container while the
                  "diamond of diamonds" cluster rolls in behind it on a shared centred stage. */}
              <div className="mw-fac2__caps" ref={capsRef}>
                <div className="mw-fac2__stage">
                  <div className="mw-fac2__truck" aria-hidden="true">
                    <Fac2Dumptruck01 />
                  </div>
                  <div
                    className="mw-cap-dia"
                    style={{
                      aspectRatio: `${CAP_COLS} / ${CAP_ROWS}`,
                      "--cap-active-bg": activeCap === null ? undefined : CAP_TONES[activeCap],
                      "--cap-center-rot": `${centerTurn * 90}deg`,
                    }}
                    role="group"
                    aria-label={capsTitle}
                    data-cap-active={activeCap === null ? undefined : "1"}
                    onMouseLeave={clearActiveCap}
                  >
                  <div className="mw-cap-dia__cell mw-cap-dia__cell--title" style={capDiaStyle(2, 0)}>
                    <span className="mw-cap-dia__d">
                      <svg className="mw-cap-dia__svg" viewBox="0 0 200 200" aria-hidden="true">
                        <rect className="mw-cap-dia__fill" x="29.3" y="29.3" width="141.4" height="141.4" rx="15" transform="rotate(45 100 100)" />
                      </svg>
                      <span className="mw-cap-dia__face"><span className="mw-cap-dia__title">{capsTitle}</span></span>
                    </span>
                  </div>
                  <div className="mw-cap-dia__center" aria-hidden="true">
                    <svg className="mw-cap-dia__center-svg" viewBox="0 0 200 200" aria-hidden="true">
                      <rect className="mw-cap-dia__center-fill" x="29.3" y="29.3" width="141.4" height="141.4" rx="0" transform="rotate(45 100 100)" />
                    </svg>
                    <span className="mw-cap-dia__center-face">
                      {capabilities.map((cap, i) => {
                        const name = capText(cap);
                        const detail = capDetail(cap, capabilityLines, i);
                        return (
                          <span
                            className={`mw-cap-dia__center-item mw-cap-dia__center-item--${i}${activeCap === i ? " mw-cap-dia__center-item--active" : ""}`}
                            key={`center-${name || i}`}
                          >
                            {detail ? <span className="mw-cap-dia__center-line">{detail}</span> : null}
                          </span>
                        );
                      })}
                    </span>
                  </div>
                  {capabilities.map((cap, i) => {
                    const s = CAP_SLOTS[i];
                    const name = capText(cap);
                    const detail = capDetail(cap, capabilityLines, i);
                    return (
                      <div
                        className={`mw-cap-dia__cell mw-cap-dia__cell--cap mw-cap-dia__cell--cap-${i}${activeCap === i ? " mw-cap-dia__cell--active" : ""}`}
                        style={capDiaStyle(s.col, s.row, {
                          "--cap-bg": CAP_TONES[i],
                        })}
                        key={name || i}
                        aria-label={detail ? `${name}: ${detail}` : name}
                      >
                        <span className="mw-cap-dia__hit" aria-hidden="true" onMouseEnter={() => activateCap(i)} />
                        <span className="mw-cap-dia__d">
                          <svg className="mw-cap-dia__svg" viewBox="0 0 200 200" aria-hidden="true">
                            <rect className="mw-cap-dia__fill" x="29.3" y="29.3" width="141.4" height="141.4" rx="0" transform="rotate(45 100 100)" />
                          </svg>
                          <span className="mw-cap-dia__face">
                            <span className="mw-cap-dia__name">{capSoftWrap(name)}</span>
                          </span>
                        </span>
                      </div>
                    );
                  })}
                  </div>
                </div>
              </div>

              {/* CAPABILITY RAIL — the single-column (≤900) capabilities view, replacing the
                  diamond lattice there (the lattice + truck stay on 901–1024 portrait and the
                  pinned desktop): a thumb-scrollable strip of mineral-toned plates that bleeds
                  from the LEFT screen edge (the photos bleed right — the strips bookend the
                  column) and slides in from the left on the scrubbed --capalt-p, each card on
                  its own slice. display:none ≥901. Styling: facility-pin.css (.mw-capalt*). */}
              <div className="mw-capalt" ref={altRef} role="group" aria-label={capsTitle}>
                <p className="mw-capalt__head">
                  <span>{capsTitle}</span>
                </p>
                <div className="mw-capalt__rail">
                  <span className="mw-capalt__spine" aria-hidden="true" />
                  <ol className="mw-capalt__list">
                    {capabilities.map((cap, i) => {
                      const name = capText(cap);
                      const detail = capDetail(cap, capabilityLines, i);
                      return (
                        <li className="mw-capalt__item" key={`alt-${name || i}`} style={{ "--ci": i, "--alt-bg": CAP_TONES[i] }}>
                          {/* Quiet mineral plate — no index numeral (banned in the eyebrow
                              register) and no orphaned diamond in its place: the diamond is
                              reserved for eyebrows / diagram nodes / state markers, and these
                              plates are non-interactive, so typography carries the row (the
                              CWC fleet-plate resolution, logan + consult 2026-06-12). */}
                          <span className="mw-capalt__body">
                            <span className="mw-capalt__name">{capSoftWrap(name)}</span>
                            {detail ? <span className="mw-capalt__detail">{detail}</span> : null}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
