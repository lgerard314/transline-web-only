"use client";
import { useRef, useState, useCallback, useEffect, useId } from "react";
import { LrCountUp } from "./lr-count-up";
import { LrDiamondSeal } from "./lr-diamond-seal";

// ONE continuous "growing line" across the three lifetime diamonds, drawn strictly
// LEFT → RIGHT. On DESKTOP the entire chain — all three diamond outlines AND the two
// connecting lines — is a SINGLE unified SVG (one set of paths, one stroke-width), so
// the line and the borders are identical in thickness and the diamond→line seam is
// seamless (it is one shape). The reveal pairs TWO copies of the chain: a TERRACOTTA
// base layer clipped to [0, frontierX] (the settled draw), and a GOLD copy masked to
// a soft band (BAND px) riding the frontier — so the growing edge reads as drawn in
// gold trailing back into the settled terracotta, identically on the diamonds and the
// lines. The gold band fades out once the reel settles (data-done). The only other
// gold is the active/hover per-diamond seal edge (handled in CSS, untouched).
//
// PROGRESS-DRIVEN: the frontier position — and each diamond's count-up — is tied to a
// 0..1 `progress`. The SOURCE of that progress is the parent's choice: on desktop the
// pinned section now feeds an AUTO-PLAY timeline (the chain draws itself once the
// section fills — see lifetime-reel-01.jsx); in the uncontrolled / mobile fallback the
// widget self-derives progress from the section's travel through the viewport (see
// START_VISIBLE_FRAC) so scrolling draws/reverses the chain. Either way the wipe is a
// pure function of progress (left→right at frontierX), so it replays whenever progress
// runs 0→1. The per-diamond count-up runs in LrCountUp's CONTROLLED mode, fed each
// diamond's local slice of the global progress. The geometry (paths + milestone x's)
// is measured once from the live diamond boxes. The per-diamond seal edges are
// hidden on desktop (the chain draws them) and used only as the MOBILE one-at-a-time
// fallback. prefers-reduced-motion pins progress to 1 (fully drawn, no animation).

// Scroll→progress mapping (UNCONTROLLED / mobile only): progress 0 when the TOP 60%
// of the FIRST (left) diamond is visible; progress 1 when the BOTTOM of the body
// caption reaches the screen. On desktop the section is PINNED and the parent feeds
// `progress` directly (see lifetime-reel-01.jsx), so this self-mapping is unused there.
const START_VISIBLE_FRAC = 0.6; // fraction of the first diamond visible at progress 0
const BAND = 90; // px width of the gold "charge" band riding the frontier (keep in sync with mask-size in 07-lifetime-reel.css)
const CHAIN_SPEED = 4; // the diamond/line gradient build runs this many × the count-up pace (chain finishes in the first 1/CHAIN_SPEED of progress; the numbers are unaffected). Each count still STARTS as its diamond forms (segStart = apexStart/CHAIN_SPEED, so it tracks the sped draw).
const COUNT_SPEED = 1.4; // the numbers count this many × faster: they all still land TOGETHER but at drawProg = 1/COUNT_SPEED instead of 1, so the whole count completes 40% sooner (desktop/controlled only).
// Time-based grace AFTER the third diamond finishes rendering, before hover can override the
// auto-selected third. This is a wall-clock perception window, not a scroll distance: it is
// sized to outlast the highlight's appear transitions (caption fade .35s, active scale .32s)
// plus a beat to register them, so (a) the user clearly SEES the third highlighted, and (b)
// those transitions have SETTLED before hover engages — otherwise the layout shifting under a
// stationary mouse fires a stray mouseenter that instantly steals the selection. A scroll
// distance can't express this (a fast scroll crosses it before the transition even finishes).
const HOVER_GRACE_MS = 600;

export function LifetimeReel({ highlights = [], progress }) {
  const controlled = typeof progress === "number"; // parent (pinned section) supplies progress
  const n = highlights.length;
  const baseId = useId();
  const captionId = `${baseId}-caption`;
  const [internalProg, setInternalProg] = useState(0); // 0..1 self-driven scrub (uncontrolled mode)
  const prog = controlled ? Math.min(1, Math.max(0, progress)) : internalProg;
  const [sticky, setSticky] = useState(null); // last diamond hovered/focused/clicked
  const [current, setCurrent] = useState(0); // mobile one-at-a-time index (scroll-synced, tap-overridable)
  const [reduced, setReduced] = useState(false); // prefers-reduced-motion
  const [geom, setGeom] = useState(null);  // { linesD, diamondsD, fillsD, stageW, stageH, sw, milestones[6] }
  const stageRef = useRef(null);
  const rootRef = useRef(null);
  const captionsRef = useRef(null);
  const captionEls = useRef([]);

  // Left→right SLOT order of highlight indices. For the canonical 3-up reel we keep
  // the original placement (disposal | chain-of-custody | recycled = idx 0 | 2 | 1)
  // so the 100% chain-of-custody stat stays centred as the hero. slotOf maps a
  // highlight index to its slot (0=left, 1=centre, 2=right).
  const ORDER = n === 3 ? [0, 2, 1] : highlights.map((_, i) => i);
  const orderRef = useRef(ORDER);
  orderRef.current = ORDER;
  const slotOf = (idx) => ORDER.indexOf(idx);
  const posOf = (idx) => ["left", "center", "right"][slotOf(idx)] || "center";

  // Measure the three diamond boxes once (and on resize) and build the unified chain:
  // each diamond's rounded outline as a top half + bottom half (both left apex →
  // right apex), plus the two connector segments at the diamonds' mid-height — all in
  // ONE path string in stage-pixel coordinates. Also record the milestone x's (each
  // apex) the wipe steps through and the matched stroke width. Rounded-vertex apexes
  // (viewBox 200): L 19.29 / R 180.71 / T,B 100.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof window === "undefined") return;
    const U = (f) => (vx, vy) => `${(f.x + (vx / 200) * f.w).toFixed(2)} ${(f.y + (vy / 200) * f.h).toFixed(2)}`;
    const rOf = (f) => ((10 / 200) * f.w).toFixed(2);
    const half = (f) => {
      const u = U(f), r = rOf(f);
      const top = `M ${u(19.29, 100)} A ${r} ${r} 0 0 1 ${u(22.22, 92.93)} L ${u(92.93, 22.22)} A ${r} ${r} 0 0 1 ${u(107.07, 22.22)} L ${u(177.78, 92.93)} A ${r} ${r} 0 0 1 ${u(180.71, 100)}`;
      const bot = `M ${u(19.29, 100)} A ${r} ${r} 0 0 0 ${u(22.22, 107.07)} L ${u(92.93, 177.78)} A ${r} ${r} 0 0 0 ${u(107.07, 177.78)} L ${u(177.78, 107.07)} A ${r} ${r} 0 0 0 ${u(180.71, 100)}`;
      return { top, bot, leftX: f.x + (19.29 / 200) * f.w, rightX: f.x + (180.71 / 200) * f.w, midY: f.y + f.h / 2 };
    };
    const closed = (f) => {
      const u = U(f), r = rOf(f);
      return `M ${u(19.29, 100)} A ${r} ${r} 0 0 1 ${u(22.22, 92.93)} L ${u(92.93, 22.22)} A ${r} ${r} 0 0 1 ${u(107.07, 22.22)} L ${u(177.78, 92.93)} A ${r} ${r} 0 0 1 ${u(177.78, 107.07)} L ${u(107.07, 177.78)} A ${r} ${r} 0 0 1 ${u(92.93, 177.78)} L ${u(22.22, 107.07)} A ${r} ${r} 0 0 1 ${u(19.29, 100)} Z`;
    };
    const measure = () => {
      const sr = stage.getBoundingClientRect();
      if (!sr.width) return;
      const fOf = (pos) => {
        const seal = stage.querySelector(`.mw-lr-reel__item[data-pos="${pos}"] .mw-lr-seal`);
        if (!seal) return null;
        const b = seal.getBoundingClientRect();
        return { x: b.left - sr.left, y: b.top - sr.top, w: b.width, h: b.height };
      };
      const L = fOf("left"), C = fOf("center"), R = fOf("right");
      if (!L || !C || !R) return;
      const hL = half(L), hC = half(C), hR = half(R);
      const connA = `M ${hL.rightX.toFixed(2)} ${hL.midY.toFixed(2)} L ${hC.leftX.toFixed(2)} ${hC.midY.toFixed(2)}`;
      const connB = `M ${hC.rightX.toFixed(2)} ${hC.midY.toFixed(2)} L ${hR.leftX.toFixed(2)} ${hR.midY.toFixed(2)}`;
      const linesD = `${connA} ${connB}`;
      const diamondsD = [hL.top, hL.bot, hC.top, hC.bot, hR.top, hR.bot].join(" ");
      const fillsD = [closed(L), closed(C), closed(R)].join(" ");
      const milestones = [hL.leftX, hL.rightX, hC.leftX, hC.rightX, hR.leftX, hR.rightX];
      const sw = 1.6 * (C.w / 200); // matches the old per-diamond + connector rendered width
      setGeom({ linesD, diamondsD, fillsD, stageW: sr.width, stageH: sr.height, sw, milestones });
    };
    let raf, n2 = 0;
    const loop = () => { measure(); if (n2++ < 8) raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", measure);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", measure); };
  }, []);

  // Scroll-driven progress: one rAF-coalesced reader that maps the section's viewport
  // position to 0..1. prefers-reduced-motion pins progress to 1 and attaches no
  // listener. Cleans up the listeners on unmount / mode change.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // CONTROLLED: the pinned section owns the scrub and feeds `progress`. We only
    // mirror the reduced-motion flag (used by localOf's pre-geometry fallback) and
    // attach no scroll listener of our own.
    if (controlled) {
      const sync = () => setReduced(mq.matches);
      sync();
      mq.addEventListener("change", sync);
      return () => mq.removeEventListener("change", sync);
    }
    // UNCONTROLLED (mobile / no-pin): self-drive progress from the section's travel
    // through the viewport. prefers-reduced-motion pins progress to 1.
    let raf = 0;
    const compute = () => {
      raf = 0;
      const stage = stageRef.current, band = captionsRef.current;
      if (!stage || !band) return;
      const vh = window.innerHeight || document.documentElement.clientHeight || 1;
      const left = stage.querySelector('.mw-lr-reel__item[data-pos="left"] .mw-lr-seal');
      if (!left) return;
      const lr = left.getBoundingClientRect();
      if (!lr.height) return;
      const startA = lr.top + START_VISIBLE_FRAC * lr.height; // top 60% of first diamond visible
      // End: bottom of the body-paragraph caption = top of the section's bottom padding.
      const endB = band.getBoundingClientRect().bottom;
      const p = (vh - startA) / ((endB - startA) || 1);
      setInternalProg(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute); };
    const attach = () => {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      compute();
    };
    const detach = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    };
    const sync = () => {
      if (mq.matches) { setReduced(true); detach(); setInternalProg(1); }
      else { setReduced(false); detach(); attach(); }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => { detach(); mq.removeEventListener("change", sync); };
  }, [controlled]);

  // Write the wipe frontier directly from progress — no timed transition, so the draw
  // tracks progress 1:1 (the auto-play timeline / scroll already paces it). Every CLIP
  // layer (terracotta base + fills) is clipped to [0, frontierX]; every MASK layer (the
  // gold copies) rides its soft band so its leading edge sits at the frontier — gold at
  // the growing edge, fading back into the settled terracotta. Both update in lockstep.
  const applyFrontier = useCallback((p, g) => {
    const stage = stageRef.current;
    if (!stage || !g) return;
    const m0 = g.milestones[0], m5 = g.milestones[5];
    // The GOLD band's leading edge runs all the way to m5 + BAND by p=1, so it sweeps
    // fully OFF the right apex of the third diamond — the gradient runs the whole length
    // and the third diamond settles SOLID (not cut off by the fade). The terracotta clip
    // frontier tracks the band but caps at m5: the chain reaches full draw a touch before
    // p=1, then holds while the gold finishes exiting over the tail.
    const goldX = m0 + p * (m5 - m0 + BAND);
    const clipX = Math.min(m5, goldX);
    const rightInset = Math.max(0, g.stageW - clipX);
    const clipVal = `inset(0 ${rightInset.toFixed(1)}px 0 0)`;
    const maskX = (goldX - BAND).toFixed(1); // band's leading (opaque) edge sits at goldX
    stage.querySelectorAll('.mw-lr-reel__chain[data-reveal="clip"]').forEach((el) => {
      el.style.transition = "clip-path 0ms linear";
      el.style.clipPath = clipVal;
    });
    stage.querySelectorAll('.mw-lr-reel__chain[data-reveal="mask"]').forEach((el) => {
      el.style.transition = "-webkit-mask-position 0ms linear, mask-position 0ms linear, opacity .5s linear";
      el.style.webkitMaskPosition = `${maskX}px 0`;
      el.style.maskPosition = `${maskX}px 0`;
    });
  }, []);

  // Re-apply the frontier whenever progress or geometry changes (scroll tick, resize).
  // The chain (diamond outlines + lines + gold band) draws at CHAIN_SPEED× the count-up
  // pace: we feed applyFrontier a sped-up progress so the whole chain finishes (and the
  // gold sweeps off) within the first 1/CHAIN_SPEED of the scroll, while the numbers keep
  // running off the un-scaled progress (drawProg/localOf) — so the lines race ahead and
  // the figures count up at their original, unchanged speed.
  useEffect(() => {
    if (!geom) return;
    applyFrontier(Math.min(1, prog * CHAIN_SPEED), geom);
  }, [prog, geom, applyFrontier]);

  // Hover / focus / click emphasise a diamond — but ONLY after the whole chain has drawn AND the
  // grace has elapsed (hoverReady). During the draw + grace, hovers are ignored (no diamond is
  // emphasised; the captions simply accumulate). hoverReadyRef lets the stable callback read the
  // latest value.
  const done = prog >= 0.999;                 // chain fully drawn (drives data-done)
  const [hoverReady, setHoverReady] = useState(false);
  const hoverReadyRef = useRef(false);
  hoverReadyRef.current = hoverReady;
  const select = useCallback((idx) => () => { if (hoverReadyRef.current) setSticky(idx); }, []);

  // Start the grace clock the moment the chain is fully drawn; hover engages HOVER_GRACE_MS
  // later. If the user scrolls back before then (done → false), reset so it must elapse again.
  useEffect(() => {
    if (!done) { setHoverReady(false); return; }
    const t = setTimeout(() => setHoverReady(true), HOVER_GRACE_MS);
    return () => clearTimeout(t);
  }, [done]);

  // DESKTOP each count STARTS exactly as its own diamond's border begins drawing, but all
  // three FINISH together at the very end (when the third diamond's count completes) — a
  // staggered cascade of starts that lands as one. MOBILE keeps the original lockstep: each
  // count runs with its own diamond's draw (start at its left apex, complete at its right
  // apex), since there is no shared chain there. Before geometry is measured, fall back to
  // fully-shown only under reduced motion (else hidden).
  // Visible-DRAW fraction: because the gold band overshoots the chain end by BAND to
  // sweep off the third diamond, the terracotta draw (clipX, capped at m5) completes a
  // touch before the raw timeline ends — the tail is just the gold exiting. The
  // count-ups and captions key off THIS fraction (not raw prog).
  const span0 = geom ? (geom.milestones[5] - geom.milestones[0]) : 0;
  const drawProg = span0 ? Math.min(1, prog * (span0 + BAND) / span0) : prog;
  // The body paragraphs reveal the instant the LAST counter lands. On desktop every count
  // finishes together at drawProg = 1/COUNT_SPEED, so that is the cue (no longer the full-scroll
  // `done`). Mobile reveals the current diamond's caption one at a time and ignores this.
  const countsDone = controlled ? drawProg >= (1 / COUNT_SPEED) - 1e-4 : false;
  const localOf = (idx) => {
    const g = geom;
    if (!g) return reduced ? 1 : 0;
    const s = slotOf(idx);
    const m0 = g.milestones[0], span = (g.milestones[5] - m0) || 1;
    const apexStart = (g.milestones[2 * s] - m0) / span;       // this diamond's left apex (un-sped frontier fraction)
    if (controlled) {
      // The CHAIN_SPEED-accelerated wipe reaches this diamond's left apex at
      // drawProg = apexStart / CHAIN_SPEED — so the count fires exactly as the border
      // starts drawing. They all land TOGETHER at the shared end drawProg = 1/COUNT_SPEED
      // (< 1), so the whole count completes COUNT_SPEED× sooner — 40% faster — regardless
      // of when each one started.
      const segStart = apexStart / CHAIN_SPEED;
      const segEnd = 1 / COUNT_SPEED;
      return Math.min(1, Math.max(0, (drawProg - segStart) / Math.max(1e-4, segEnd - segStart)));
    }
    const segEnd = (g.milestones[2 * s + 1] - m0) / span;     // its right apex (draw complete) — mobile lockstep
    return Math.min(1, Math.max(0, (drawProg - apexStart) / Math.max(1e-4, segEnd - apexStart)));
  };

  // The diamond emphasis (amber border + scale) is HOVER-ONLY: it lights the hovered diamond
  // after the chain has drawn. The body paragraphs are gated on the WHOLE chain finishing —
  // all three reveal together once the last diamond is fully rendered (done), not per-diamond
  // (see the caption `data-on`) — so hover (which only styles the diamonds) never drives them.
  const activeIdx = (hoverReady && sticky != null) ? sticky : null;

  // Mobile one-at-a-time current diamond (chain hidden on mobile): pick the slot whose
  // segment the global progress has entered. Scroll drives `current` (the effect only
  // fires when the slot actually changes); a dot tap can override it until the next
  // slot transition.
  const slotCurrent = (() => {
    const g = geom;
    if (!g) return 0;
    const m0 = g.milestones[0], m5 = g.milestones[5], span = (m5 - m0) || 1;
    const c1 = (g.milestones[2] - m0) / span; // centre slot segStart
    const c2 = (g.milestones[4] - m0) / span; // right slot segStart
    return drawProg >= c2 ? 2 : drawProg >= c1 ? 1 : 0;
  })();
  useEffect(() => { setCurrent(orderRef.current[slotCurrent] ?? slotCurrent); }, [slotCurrent]);

  // Lay out the reveal captions (lock band height to the tallest; slide each under
  // its own diamond). Measured from the live elements; recomputed on load + resize.
  useEffect(() => {
    const band = captionsRef.current;
    const stage = stageRef.current;
    if (!band || !stage || typeof window === "undefined") return;
    const place = () => {
      const bb = band.getBoundingClientRect();
      let maxH = 0;
      highlights.forEach((_, idx) => {
        const el = captionEls.current[idx];
        if (!el) return;
        maxH = Math.max(maxH, el.offsetHeight);
        const card = stage.querySelector(`.mw-lr-reel__item[data-idx="${idx}"] .mw-lr-reel__card`);
        if (!card) return;
        const cb = card.getBoundingClientRect();
        const capW = el.offsetWidth;
        const target = (cb.left + cb.width / 2) - (bb.left + bb.width / 2);
        const clampMag = Math.max(0, (bb.width - capW) / 2);
        const dx = Math.max(-clampMag, Math.min(clampMag, target));
        el.style.setProperty("--lr-cap-dx", `${dx}px`);
      });
      if (maxH) band.style.height = `${maxH}px`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [countsDone, highlights.length]);

  return (
    <div
      className="mw-lr-reel"
      ref={rootRef}
      data-current={current}
      data-done={done ? "1" : undefined}
      data-active={activeIdx != null ? "1" : undefined}
    >
      <div className="mw-lr-reel__stage" ref={stageRef}>
        {/* Unified chain (desktop), revealed left→right by the wipe. Split into z layers
            so the diamond fill overlay sits BETWEEN the connector lines and the diamond
            borders (back → front: lines → fill → borders → content). Each stroked layer
            is a PAIR: a terracotta --base (clipped to [0, frontier]) plus a --gold copy
            (masked to a soft band riding the frontier, on top of its base), so the
            growing edge reads as gold trailing into settled terracotta. All clip/mask
            off the same frontier (set in applyFrontier); gold fades out on settle
            (data-done). Stroke width matches the diamond size. */}
        {geom && (
          <>
            <svg className="mw-lr-reel__chain mw-lr-reel__chain--lines mw-lr-reel__chain--base" data-reveal="clip" viewBox={`0 0 ${geom.stageW} ${geom.stageH}`} preserveAspectRatio="none" aria-hidden="true">
              <path d={geom.linesD} strokeWidth={geom.sw} />
            </svg>
            <svg className="mw-lr-reel__chain mw-lr-reel__chain--lines mw-lr-reel__chain--gold" data-reveal="mask" viewBox={`0 0 ${geom.stageW} ${geom.stageH}`} preserveAspectRatio="none" aria-hidden="true">
              <path d={geom.linesD} strokeWidth={geom.sw} />
            </svg>
            <svg className="mw-lr-reel__chain mw-lr-reel__chain--fills" data-reveal="clip" viewBox={`0 0 ${geom.stageW} ${geom.stageH}`} preserveAspectRatio="none" aria-hidden="true">
              <path d={geom.fillsD} />
            </svg>
            <svg className="mw-lr-reel__chain mw-lr-reel__chain--diamonds mw-lr-reel__chain--base" data-reveal="clip" viewBox={`0 0 ${geom.stageW} ${geom.stageH}`} preserveAspectRatio="none" aria-hidden="true">
              <path d={geom.diamondsD} strokeWidth={geom.sw} />
            </svg>
            <svg className="mw-lr-reel__chain mw-lr-reel__chain--diamonds mw-lr-reel__chain--gold" data-reveal="mask" viewBox={`0 0 ${geom.stageW} ${geom.stageH}`} preserveAspectRatio="none" aria-hidden="true">
              <path d={geom.diamondsD} strokeWidth={geom.sw} />
            </svg>
          </>
        )}

        {highlights.map((h, idx) => {
          const name = `${h.value}${h.suffix}${h.unit ? " " + h.unit : ""} — ${h.label}`;
          const local = localOf(idx);
          const started = local > 0;
          const capShown = controlled ? countsDone : current === idx; // its caption reveals the moment the last counter lands
          return (
            <div
              className="mw-lr-reel__item"
              key={idx}
              data-idx={idx}
              data-pos={posOf(idx)}
              data-settled={local >= 0.999 ? "1" : undefined}
              data-active={activeIdx === idx ? "1" : undefined}
            >
              <div className="mw-lr-reel__cardwrap">
                <button
                  type="button"
                  className="mw-lr-reel__card"
                  aria-label={`${name}. Show details`}
                  aria-expanded={capShown}
                  aria-controls={`${captionId}-${idx}`}
                  data-mw-lr-seal={started ? "closed" : "open"}
                  onClick={select(idx)}
                  onMouseEnter={select(idx)}
                  onFocus={select(idx)}
                >
                  <LrDiamondSeal legend="" draw="lr">
                    <span className="mw-lr-reel__figstack">
                      <span className="mw-lr-reel__num">
                        <LrCountUp value={h.value} suffix={h.suffix} progress={local} />
                      </span>
                      {h.unit ? <span className="mw-lr-reel__unit">{h.unit}</span> : null}
                    </span>
                    <span className="mw-lr-reel__label" aria-hidden="true">{h.label}</span>
                  </LrDiamondSeal>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reveal captions: one per diamond, each sitting under its diamond. On desktop all
          three stay HIDDEN until the last counter finishes (every count lands together at
          drawProg = 1/COUNT_SPEED → countsDone), then reveal together; on mobile (one diamond
          at a time) only the current diamond's caption shows. */}
      <div className="mw-lr-reel__captions" ref={captionsRef}>
        {highlights.map((h, idx) => {
          // Desktop: hold ALL three captions hidden until the last counter lands
          // (countsDone), then reveal them together. Mobile: one at a time, the current
          // diamond's caption.
          const shown = controlled ? countsDone : current === idx;
          return (
            <p
              key={idx}
              className="mw-lr-reel__caption"
              id={`${captionId}-${idx}`}
              data-idx={idx}
              ref={(el) => { captionEls.current[idx] = el; }}
              data-on={shown ? "1" : undefined}
              aria-hidden={shown ? undefined : "true"}
            >
              {h.reveal}
            </p>
          );
        })}
      </div>

      {/* Mobile-only: revisit dots (desktop hides this). */}
      {n > 1 && (
        <div className="mw-lr-reel__dots" role="group" aria-label="Choose a lifetime highlight">
          {highlights.map((h, idx) => (
            <button
              key={idx}
              type="button"
              className="mw-lr-reel__dot"
              aria-label={`${h.value}${h.suffix} ${h.label}`}
              aria-pressed={current === idx}
              data-on={current === idx ? "1" : undefined}
              onClick={() => { setCurrent(idx); setSticky(idx); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
