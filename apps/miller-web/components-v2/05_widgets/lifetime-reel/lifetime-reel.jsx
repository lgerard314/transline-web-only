"use client";
import { useRef, useState, useCallback, useEffect, useId } from "react";
import { LrCountUp } from "./lr-count-up";
import { LrDiamondSeal } from "./lr-diamond-seal";

// ONE continuous "growing line" across the three lifetime diamonds, drawn strictly
// LEFT → RIGHT. On DESKTOP the entire chain — all three diamond outlines AND the two
// connecting lines — is a SINGLE unified SVG (one set of paths, one stroke-width), so
// the line and the borders are identical in thickness and the diamond→line seam is
// seamless (it is one shape). The reveal is a single left→right wipe of a TERRACOTTA
// layer, clipped to [0, frontierX] (revealed left→right). There is NO moving gold
// gradient on the draw — the chain reveals in its settled terracotta the whole way;
// the only gold is the active/hover per-diamond seal edge (handled in CSS, untouched).
//
// SCROLL-SCRUBBED: the wipe is NOT a self-running timeline. The frontier position —
// and each diamond's count-up — is tied to a 0..1 progress derived from the
// section's travel THROUGH the viewport (see PROG_START/PROG_END). Scrolling down
// draws the chain left→right at scroll speed; scrolling back up reverses it; so the
// whole effect replays every time the section is scrolled through, in either
// direction. The per-diamond count-up runs in LrCountUp's CONTROLLED mode, fed each
// diamond's local slice of the global progress. The geometry (paths + milestone x's)
// is measured once from the live diamond boxes. The per-diamond seal edges are
// hidden on desktop (the chain draws them) and used only as the MOBILE one-at-a-time
// fallback. prefers-reduced-motion pins progress to 1 (fully drawn, no scrubbing).

// Scroll→progress mapping (UNCONTROLLED / mobile only): progress 0 when the TOP 60%
// of the FIRST (left) diamond is visible; progress 1 when the BOTTOM of the body
// caption reaches the screen. On desktop the section is PINNED and the parent feeds
// `progress` directly (see lifetime-reel-01.jsx), so this self-mapping is unused there.
const START_VISIBLE_FRAC = 0.6; // fraction of the first diamond visible at progress 0

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

  // Write the wipe frontier directly from progress — no timed transition, so the
  // terracotta draw tracks the scroll position 1:1. (No moving gold gradient: the
  // chain reveals in its settled terracotta the whole way; the only gold is the
  // active/hover per-diamond seal edge, which is untouched.)
  const applyFrontier = useCallback((p, g) => {
    const stage = stageRef.current;
    if (!stage || !g) return;
    const m0 = g.milestones[0], m5 = g.milestones[5];
    const clipX = m0 + p * (m5 - m0);
    const rightInset = Math.max(0, g.stageW - clipX);
    const clipVal = `inset(0 ${rightInset.toFixed(1)}px 0 0)`;
    stage.querySelectorAll('.mw-lr-reel__chain[data-reveal="clip"]').forEach((el) => {
      el.style.transition = "clip-path 0ms linear";
      el.style.clipPath = clipVal;
    });
  }, []);

  // Re-apply the frontier whenever progress or geometry changes (scroll tick, resize).
  useEffect(() => {
    if (!geom) return;
    applyFrontier(prog, geom);
  }, [prog, geom, applyFrontier]);

  // Hover / focus / click select a diamond — but ONLY after the whole chain has drawn.
  // During the draw the active diamond follows the draw progression (see drawnSlot
  // below), so hovers are ignored until then. doneRef holds the latest `done` so the
  // stable callback can read it without re-subscribing.
  const doneRef = useRef(false);
  const select = useCallback((idx) => () => { if (doneRef.current) setSticky(idx); }, []);

  const done = prog >= 0.999;
  doneRef.current = done;

  // Each diamond's count runs in lockstep with ITS OWN border draw: 0 before the wipe
  // reaches its left apex (segStart), ramping to 1 exactly as the wipe crosses to its
  // right apex (segEnd). So each number is fully reached the moment its diamond finishes
  // drawing — right as that diamond becomes active and its body paragraph appears —
  // before the next diamond starts counting. Before geometry is measured, fall back to
  // fully-shown only under reduced motion (else hidden).
  const localOf = (idx) => {
    const g = geom;
    if (!g) return reduced ? 1 : 0;
    const s = slotOf(idx);
    const m0 = g.milestones[0], span = (g.milestones[5] - m0) || 1;
    const segStart = (g.milestones[2 * s] - m0) / span;     // this diamond's left apex
    const segEnd = (g.milestones[2 * s + 1] - m0) / span;   // its right apex (draw complete)
    return Math.min(1, Math.max(0, (prog - segStart) / Math.max(1e-4, segEnd - segStart)));
  };

  // Active-diamond progression: as the wipe FINISHES each diamond (its frontier passes
  // that diamond's right apex), THAT diamond becomes the active/highlighted one and its
  // body paragraph shows — while the next diamond is still drawing. drawnSlot is the
  // highest slot whose draw has completed (-1 before the first; left→centre→right).
  // After the whole chain is drawn (done), hover/focus takes over via `sticky`; until a
  // hover, the last-drawn (right) diamond stays active.
  const drawnSlot = (() => {
    const g = geom;
    if (!g) return reduced ? n - 1 : -1;
    const m0 = g.milestones[0], m5 = g.milestones[5], span = (m5 - m0) || 1;
    let ds = -1;
    for (let s = 0; s < n; s++) {
      const segEnd = (g.milestones[2 * s + 1] - m0) / span; // prog at which slot s finishes drawing
      if (prog >= segEnd - 1e-3) ds = s;
    }
    return ds;
  })();
  const activeIdx = (done && sticky != null) ? sticky : (drawnSlot >= 0 ? ORDER[drawnSlot] : null);

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
    return prog >= c2 ? 2 : prog >= c1 ? 1 : 0;
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
  }, [done, highlights.length]);

  return (
    <div
      className="mw-lr-reel"
      ref={rootRef}
      data-current={current}
      data-done={done ? "1" : undefined}
      data-active={activeIdx != null ? "1" : undefined}
    >
      <div className="mw-lr-reel__stage" ref={stageRef}>
        {/* Unified chain (desktop), revealed left→right by the scroll-scrubbed wipe.
            Split into z layers so the diamond fill overlay sits BETWEEN the connector
            lines and the diamond borders (back → front: lines → fill → borders →
            content). All clip off the same frontier (set in applyFrontier). Stroke
            width matches the diamond size. Terracotta-only — no moving gold gradient;
            the active/hover seal edge provides the only gold. */}
        {geom && (
          <>
            <svg className="mw-lr-reel__chain mw-lr-reel__chain--lines mw-lr-reel__chain--base" data-reveal="clip" viewBox={`0 0 ${geom.stageW} ${geom.stageH}`} preserveAspectRatio="none" aria-hidden="true">
              <path d={geom.linesD} strokeWidth={geom.sw} />
            </svg>
            <svg className="mw-lr-reel__chain mw-lr-reel__chain--fills" data-reveal="clip" viewBox={`0 0 ${geom.stageW} ${geom.stageH}`} preserveAspectRatio="none" aria-hidden="true">
              <path d={geom.fillsD} />
            </svg>
            <svg className="mw-lr-reel__chain mw-lr-reel__chain--diamonds mw-lr-reel__chain--base" data-reveal="clip" viewBox={`0 0 ${geom.stageW} ${geom.stageH}`} preserveAspectRatio="none" aria-hidden="true">
              <path d={geom.diamondsD} strokeWidth={geom.sw} />
            </svg>
          </>
        )}

        {highlights.map((h, idx) => {
          const name = `${h.value}${h.suffix}${h.unit ? " " + h.unit : ""} — ${h.label}`;
          const local = localOf(idx);
          const started = local > 0;
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
                  aria-expanded={activeIdx === idx}
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

      {/* Reveal captions: one per diamond, stacked in a band BELOW the row. */}
      <div className="mw-lr-reel__captions" ref={captionsRef}>
        {highlights.map((h, idx) => (
          <p
            key={idx}
            className="mw-lr-reel__caption"
            id={`${captionId}-${idx}`}
            ref={(el) => { captionEls.current[idx] = el; }}
            data-on={activeIdx === idx ? "1" : undefined}
            aria-hidden={activeIdx === idx ? undefined : "true"}
          >
            {h.reveal}
          </p>
        ))}
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
