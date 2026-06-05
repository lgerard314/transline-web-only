"use client";
import { useRef, useState, useCallback, useEffect, useId } from "react";
import { LrCountUp } from "./lr-count-up";
import { LrDiamondSeal } from "./lr-diamond-seal";

// ONE continuous "growing line" across the three lifetime diamonds, drawn strictly
// LEFT → RIGHT. On DESKTOP the entire chain — all three diamond outlines AND the two
// connecting lines — is a SINGLE unified SVG (one set of paths, one stroke-width,
// one gradient mechanism), so the line and the borders are identical in thickness,
// the gold is identical everywhere, and the diamond→line seam is seamless (it is one
// shape). The reveal is a single left→right wipe:
//
//   - a TERRACOTTA base layer, clipped to [0, frontierX] (revealed left→right);
//   - a GOLD layer, masked to a soft band riding the frontier — so the growing edge
//     looks drawn in gold trailing into the settled terracotta, identically on the
//     diamonds and the lines. The gold fades out once the reel settles (data-done).
//
// The frontier sweeps at a CONSTANT speed (px/ms) through diamond → line → diamond,
// so everything draws at one pace. Phases gate the count-ups + caption + mobile:
//   idle → d1draw → linkA → d2draw → linkB → d3draw → done
// Each phase moves the frontier to the next milestone (a diamond's left/right apex)
// over a duration proportional to that segment's width (constant speed). A diamond's
// number counts up as the wipe crosses it. The geometry (paths + milestone x's) is
// measured once from the live diamond boxes. The per-diamond seal edges are hidden on
// desktop (the chain draws them) and used only as the MOBILE one-at-a-time fallback.
// prefers-reduced-motion jumps straight to the fully-drawn `done` state.
const PHASES = ["idle", "d1draw", "linkA", "d2draw", "linkB", "d3draw", "done"];
const PI = (ph) => PHASES.indexOf(ph);
const PHASE_MI = { idle: 0, d1draw: 1, linkA: 2, d2draw: 3, linkB: 4, d3draw: 5, done: 5 };
const TIMED_PHASES = new Set(["d1draw", "linkA", "d2draw", "linkB"]); // d3draw → done via the last count
const TOTAL_MS = 3600; // nominal total sweep time; per-segment time = distance / speed
const BAND = 90;       // px width of the gold "charge" band riding the frontier (matches mask-size in CSS)

export function LifetimeReel({ highlights = [] }) {
  const n = highlights.length;
  const baseId = useId();
  const captionId = `${baseId}-caption`;
  const [phase, setPhase] = useState("idle");
  const [started, setStarted] = useState(() => highlights.map(() => false)); // count began → number shows
  const [settled, setSettled] = useState(() => highlights.map(() => false)); // count finished → interactive
  const [sticky, setSticky] = useState(null);                                // last diamond hovered/focused/clicked
  const [current, setCurrent] = useState(0);                                 // mobile one-at-a-time index
  const [geom, setGeom] = useState(null);                                    // { d, stageW, stageH, sw, milestones[6], speed }
  const phaseRef = useRef("idle");
  const geomRef = useRef(null);
  const timers = useRef([]);
  const stageRef = useRef(null);
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

  // Keep refs in sync DURING render so child/sibling effects read current values.
  phaseRef.current = phase;
  geomRef.current = geom;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Reduced motion: present the whole drawn composition at once.
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStarted(highlights.map(() => true));
      setSettled(highlights.map(() => true));
      setPhase("done");
      setCurrent(Math.max(0, n - 1));
    }
  }, [n]); // eslint-disable-line react-hooks/exhaustive-deps

  // Move the wipe frontier to targetX over `dur` ms (linear). Every CLIP layer (the
  // terracotta lines + fills + diamond borders) is clipped to [0, targetX]; every
  // MASK layer (the gold copies) has its band ride so its leading edge sits at
  // targetX. All transition together so lines, fill, and borders reveal in lockstep.
  const applyFrontier = useCallback((targetX, dur) => {
    const stage = stageRef.current, g = geomRef.current;
    if (!stage || !g) return;
    const rightInset = Math.max(0, g.stageW - targetX);
    const clipVal = `inset(0 ${rightInset.toFixed(1)}px 0 0)`;
    const maskX = (targetX - BAND).toFixed(1);
    stage.querySelectorAll('.mw-lr-reel__chain[data-reveal="clip"]').forEach((el) => {
      el.style.transition = `clip-path ${dur}ms linear`;
      el.style.clipPath = clipVal;
    });
    stage.querySelectorAll('.mw-lr-reel__chain[data-reveal="mask"]').forEach((el) => {
      el.style.transition = `-webkit-mask-position ${dur}ms linear, mask-position ${dur}ms linear, opacity .5s linear`;
      el.style.webkitMaskPosition = `${maskX}px 0`;
      el.style.maskPosition = `${maskX}px 0`;
    });
  }, []);

  // Apply the frontier for the current phase (also re-applies when geometry is first
  // measured or changes on resize).
  useEffect(() => {
    if (!geom) return;
    const pIdx = PI(phase);
    const target = geom.milestones[PHASE_MI[phase]];
    const prevTarget = geom.milestones[PHASE_MI[PHASES[Math.max(0, pIdx - 1)]]];
    const dur = (phase === "idle" || phase === "done") ? 0 : Math.max(60, Math.abs(target - prevTarget) / geom.speed);
    applyFrontier(target, dur);
  }, [phase, geom, applyFrontier]);

  // Advance the phase machine: each animating phase schedules the next once its wipe
  // segment finishes (duration = segment width / constant speed).
  useEffect(() => {
    const pIdx = PI(phase);
    setCurrent(pIdx >= PI("d3draw") ? (orderRef.current[2] ?? 2) : pIdx >= PI("d2draw") ? (orderRef.current[1] ?? 1) : (orderRef.current[0] ?? 0));
    if (!TIMED_PHASES.has(phase)) return;
    const g = geomRef.current;
    let dur = 700;
    if (g) {
      const target = g.milestones[PHASE_MI[phase]];
      const prevTarget = g.milestones[PHASE_MI[PHASES[pIdx - 1]]];
      dur = Math.max(60, Math.abs(target - prevTarget) / g.speed);
    }
    const t = setTimeout(() => setPhase(PHASES[pIdx + 1]), dur);
    timers.current.push(t);
    return () => clearTimeout(t);
  }, [phase]);

  const onStart = useCallback((idx) => () => {
    setStarted((s) => { const x = s.slice(); x[idx] = true; return x; });
    // The leftmost diamond's count starting (on scroll-in) kicks off the sweep.
    if (orderRef.current.indexOf(idx) === 0 && phaseRef.current === "idle") setPhase("d1draw");
  }, []);

  const onDone = useCallback((idx) => () => {
    setSettled((s) => { const x = s.slice(); x[idx] = true; return x; });
    // Once the rightmost (last-drawn) diamond's count finishes, the reel is done.
    if (orderRef.current.indexOf(idx) === n - 1) setPhase("done");
  }, [n]);

  // Hover / focus / click all just SELECT a diamond; the selection is sticky.
  const select = useCallback((idx) => () => setSticky(idx), []);

  // Measure the three diamond boxes once (and on resize) and build the unified chain:
  // each diamond's rounded outline as a top half + bottom half (both left apex →
  // right apex), plus the two connector segments at the diamonds' mid-height — all in
  // ONE path string in stage-pixel coordinates. Also record the milestone x's (each
  // apex) that the wipe steps through, the matched stroke width, and the constant
  // sweep speed. Rounded-vertex apexes (viewBox 200): L 19.29 / R 180.71 / T,B 100.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof window === "undefined") return;
    const U = (f) => (vx, vy) => `${(f.x + (vx / 200) * f.w).toFixed(2)} ${(f.y + (vy / 200) * f.h).toFixed(2)}`;
    const rOf = (f) => ((10 / 200) * f.w).toFixed(2);
    // diamond outline as two open halves (left apex → right apex), for the STROKE
    const half = (f) => {
      const u = U(f), r = rOf(f);
      const top = `M ${u(19.29, 100)} A ${r} ${r} 0 0 1 ${u(22.22, 92.93)} L ${u(92.93, 22.22)} A ${r} ${r} 0 0 1 ${u(107.07, 22.22)} L ${u(177.78, 92.93)} A ${r} ${r} 0 0 1 ${u(180.71, 100)}`;
      const bot = `M ${u(19.29, 100)} A ${r} ${r} 0 0 0 ${u(22.22, 107.07)} L ${u(92.93, 177.78)} A ${r} ${r} 0 0 0 ${u(107.07, 177.78)} L ${u(177.78, 107.07)} A ${r} ${r} 0 0 0 ${u(180.71, 100)}`;
      return { top, bot, leftX: f.x + (19.29 / 200) * f.w, rightX: f.x + (180.71 / 200) * f.w, midY: f.y + f.h / 2 };
    };
    // diamond as a closed loop, for the FILL overlay (same shape, filled)
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
      const speed = (milestones[5] - milestones[0]) / TOTAL_MS;
      setGeom({ linesD, diamondsD, fillsD, stageW: sr.width, stageH: sr.height, sw, milestones, speed });
    };
    let raf, n2 = 0;
    const loop = () => { measure(); if (n2++ < 8) raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", measure);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", measure); };
  }, []);

  const p = PI(phase);
  // All three diamonds mounted (in their slots) from the start; each stays dark until
  // it `plays` (its count starts) as the wipe reaches it.
  const playing = (idx) => { const s = slotOf(idx); return s === 0 ? true : s === 1 ? p >= PI("d2draw") : p >= PI("d3draw"); };
  const posOf = (idx) => ["left", "center", "right"][slotOf(idx)] || "center";
  const done = phase === "done" || settled[n - 1];
  // The reveal copy stays hidden until ALL diamonds have loaded; after that one is
  // ALWAYS shown — the sticky selection, defaulting to the CENTRE-slot diamond.
  const defaultActive = ORDER[Math.floor(n / 2)] ?? (n - 1);
  const activeIdx = done ? (sticky != null ? sticky : defaultActive) : null;

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
      data-phase={phase}
      data-current={current}
      data-done={done ? "1" : undefined}
      data-active={activeIdx != null ? "1" : undefined}
    >
      <div className="mw-lr-reel__stage" ref={stageRef}>
        {/* Unified chain (desktop), revealed left→right by one wipe. Split into z
            layers so the diamond fill overlay sits BETWEEN the connector lines and
            the diamond borders (back → front: lines → fill → borders → content):
              lines  (terracotta base + gold band)  — furthest back
              fills  (opaque diamond interiors)
              borders(terracotta base + gold band)  — in front of the fill
            All clip/mask off the same frontier (data-reveal). Stroke width matches
            the diamond size; gold fades out on settle (data-done). */}
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
          return (
            <div
              className="mw-lr-reel__item"
              key={idx}
              data-idx={idx}
              data-pos={posOf(idx)}
              data-settled={settled[idx] ? "1" : undefined}
              data-active={activeIdx === idx ? "1" : undefined}
            >
              <div className="mw-lr-reel__cardwrap">
                <button
                  type="button"
                  className="mw-lr-reel__card"
                  aria-label={`${name}. Show details`}
                  aria-expanded={activeIdx === idx}
                  aria-controls={`${captionId}-${idx}`}
                  data-mw-lr-seal={started[idx] ? "closed" : "open"}
                  onClick={select(idx)}
                  onMouseEnter={select(idx)}
                  onFocus={select(idx)}
                >
                  <LrDiamondSeal legend="" draw="lr">
                    <span className="mw-lr-reel__figstack">
                      <span className="mw-lr-reel__num">
                        <LrCountUp value={h.value} suffix={h.suffix} play={playing(idx)} onStart={onStart(idx)} onComplete={onDone(idx)} />
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
