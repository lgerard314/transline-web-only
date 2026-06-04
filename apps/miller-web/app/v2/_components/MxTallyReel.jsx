"use client";
import { useRef, useState, useCallback, useEffect, useId } from "react";
import { MxCountUp } from "./MxCountUp";
import { DiamondSeal } from "./DiamondSeal";

// ONE continuous "growing line" across the three lifetime diamonds. A strict
// phase machine guarantees there is never a gap — each connector grows out of the
// previous diamond's exact facing vertex, and the next diamond only begins
// drawing at the precise point the connector lands:
//
//   d1      D1 draws (centre); starts & ends at its RIGHT vertex (mid-height)
//   d1park  D1 slides to the LEFT slot (its complete border just translates)
//   link1   a hairline grows D1.right → centre.left
//   d2      D2 draws (centre) starting at its LEFT vertex (where link1 landed)
//   d2park  D2 slides to the RIGHT slot
//   link2   a hairline grows D2.left → centre.right
//   d3      D3 draws (centre) as a split from BOTH vertices at once (link1 is on
//           its left, link2 on its right)
//   done
//
// Diamond draws (border + count in lockstep, 1.6s) advance the machine on their
// onComplete; slides and connector growth advance on timers. A diamond is mounted
// before its turn (so the connector can measure its vertex) but stays fully dark
// until it `play`s. prefers-reduced-motion jumps straight to `done`.
const PHASES = ["d1", "d1park", "link1", "d2", "d2park", "link2", "d3", "done"];
const PI = (ph) => PHASES.indexOf(ph);
const HOLD = 320, SLIDE = 700, LINK = 500;
const TIMED = { d1park: SLIDE, link1: LINK, d2park: SLIDE, link2: LINK };

export function MxTallyReel({ eyebrow, highlights = [] }) {
  const n = highlights.length;
  const baseId = useId();
  const [phase, setPhase] = useState("d1");
  const [started, setStarted] = useState(() => highlights.map(() => false)); // count began → seal draws
  const [settled, setSettled] = useState(() => highlights.map(() => false)); // count finished → interactive
  const [open, setOpen] = useState(() => highlights.map(() => false));       // tap/click reveal latch
  const [current, setCurrent] = useState(0);                                 // mobile one-at-a-time index
  const phaseRef = useRef("d1");
  const timers = useRef([]);
  const stageRef = useRef(null);
  const linkARef = useRef(null);
  const linkBRef = useRef(null);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Reduced motion: present the whole drawn composition at once.
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      setCurrent(Math.max(0, n - 1));
    }
  }, [n]);

  // Timer-driven phase transitions (slides + connector growth). The draw phases
  // (d1/d2/d3) advance from each diamond's onComplete instead.
  useEffect(() => {
    phaseRef.current = phase;
    const p = PI(phase);
    setCurrent(p >= PI("d3") ? 2 : p >= PI("d2") ? 1 : 0);
    const dur = TIMED[phase];
    if (dur != null) {
      const next = PHASES[p + 1];
      const t = setTimeout(() => setPhase(next), dur);
      timers.current.push(t);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const onStart = useCallback((idx) => () => {
    setStarted((s) => { const x = s.slice(); x[idx] = true; return x; });
  }, []);

  const onDone = useCallback((idx) => () => {
    setSettled((s) => { const x = s.slice(); x[idx] = true; return x; });
    const ph = phaseRef.current;
    if (idx === 0 && ph === "d1") timers.current.push(setTimeout(() => setPhase("d1park"), HOLD));
    else if (idx === 1 && ph === "d2") timers.current.push(setTimeout(() => setPhase("d2park"), HOLD));
    else if (idx === 2 && ph === "d3") setPhase("done");
  }, []);

  const toggle = useCallback((idx) => () => {
    setOpen((o) => { const x = o.slice(); x[idx] = !x[idx]; return x; });
  }, []);

  // Position the connector hairlines by MEASURING the live diamond edges, so each
  // spans exactly vertex-to-vertex and is as thick as the rendered border stroke.
  // Re-measured on phase change, glued via rAF through the ~0.7s park slide.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof window === "undefined") return;
    // The rounded-vertex APEX in the 200-unit viewBox: left at 19.29, right at
    // 180.71 (matches the rect's rx=10 corner AND the split paths). Measuring
    // from the seal-frame box × this ratio gives the SAME visible vertex for both
    // rect and split diamonds — getBoundingClientRect on a <rect> reports the
    // sharp-corner box instead, which left an ~8px gap mid-animation.
    const APEX_L = 19.29 / 200, APEX_R = 180.71 / 200;
    const place = () => {
      const sr = stage.getBoundingClientRect();
      const vtxOf = (pos) => {
        const it = stage.querySelector(`.mx-reel__item[data-pos="${pos}"]`);
        const frame = it && it.querySelector(".mx-seal__frame");
        const card = it && it.querySelector(".mx-reel__cardwrap");
        if (!frame || !card) return null;
        const fb = frame.getBoundingClientRect();
        const cb = card.getBoundingClientRect();
        return {
          left: fb.left + APEX_L * fb.width,   // visible left vertex (apex)
          right: fb.left + APEX_R * fb.width,  // visible right vertex (apex)
          midY: cb.top + cb.height / 2,
          sw: 1.6 * (fb.width / 200),          // rendered border stroke width
        };
      };
      const L = vtxOf("left"), C = vtxOf("center"), R = vtxOf("right");
      const sw = C ? C.sw : 2.5;
      const set = (el, from, to) => {
        if (!el) return;
        if (!from || !to || to.left <= from.right) { el.style.width = "0px"; return; }
        const OV = sw / 2; // overlap half a stroke into each apex so the join is seamless
        el.style.left = `${from.right - sr.left - OV}px`;
        el.style.top = `${from.midY - sr.top - sw / 2}px`;
        el.style.width = `${to.left - from.right + 2 * OV}px`;
        el.style.height = `${sw}px`;
      };
      set(linkARef.current, L, C); // left ↔ centre
      set(linkBRef.current, C, R); // centre ↔ right
    };
    place();
    let raf, start = null;
    const loop = (ts) => { if (start == null) start = ts; place(); if (ts - start < 950) raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", place);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", place); };
  }, [phase]);

  const p = PI(phase);
  const mounted = (idx) => idx === 0 ? true : idx === 1 ? p >= PI("d1park") : p >= PI("d2park");
  const playing = (idx) => idx === 0 ? true : idx === 1 ? p >= PI("d2") : p >= PI("d3");
  const posOf = (idx) =>
    idx === 0 ? (p <= PI("d1") ? "center" : "left")
    : idx === 1 ? (p >= PI("d2park") ? "right" : "center")
    : "center";
  const drawOf = (idx) => ["right", "left", "split"][idx] || "default";
  const done = phase === "done" || settled[n - 1];

  return (
    <div
      className="mx-reel"
      data-phase={phase}
      data-link1={p >= PI("link1") ? "1" : undefined}
      data-link2={p >= PI("link2") ? "1" : undefined}
      data-lead={phase === "d1" ? "1" : undefined}
      data-current={current}
      data-done={done ? "1" : undefined}
    >
      {eyebrow}

      <div className="mx-reel__stage" ref={stageRef}>
        {highlights.map((h, idx) => {
          if (!mounted(idx)) return null;
          const revealId = `${baseId}-rv-${idx}`;
          const name = `${h.value}${h.suffix}${h.unit ? " " + h.unit : ""} — ${h.label}`;
          return (
            <div className="mx-reel__item" key={idx} data-idx={idx} data-pos={posOf(idx)} data-settled={settled[idx] ? "1" : undefined}>
              <div className="mx-reel__cardwrap">
                <button
                  type="button"
                  className="mx-reel__card"
                  aria-label={`${name}. Show details`}
                  aria-expanded={open[idx]}
                  aria-controls={revealId}
                  data-mx-seal={started[idx] ? "closed" : "open"}
                  data-open={open[idx] ? "1" : undefined}
                  onClick={toggle(idx)}
                >
                  <DiamondSeal legend="" draw={drawOf(idx)}>
                    <span className="mx-reel__figstack">
                      <span className="mx-reel__num">
                        <MxCountUp value={h.value} suffix={h.suffix} play={playing(idx)} onStart={onStart(idx)} onComplete={onDone(idx)} />
                      </span>
                      {h.unit ? <span className="mx-reel__unit">{h.unit}</span> : null}
                    </span>
                    <span className="mx-reel__label" aria-hidden="true">{h.label}</span>
                  </DiamondSeal>
                </button>
                {/* Reveal lives OUTSIDE the button (clean accessible name) but
                    overlays the diamond; always in the DOM so SR users get it. */}
                <p className="mx-reel__reveal" id={revealId}>{h.reveal}</p>
              </div>
            </div>
          );
        })}

        {/* Connector hairlines (geometry set in JS; growth + origin in v2.css). */}
        <span className="mx-reel__link mx-reel__link--a" aria-hidden="true" ref={linkARef}><i /></span>
        <span className="mx-reel__link mx-reel__link--b" aria-hidden="true" ref={linkBRef}><i /></span>
      </div>

      {/* Phase-d1 lead: long paragraph under the lone centred D1; fades out when
          the line starts moving, and persists as D1's hover/tap reveal. */}
      <p className="mx-reel__lead">{highlights[0]?.reveal}</p>

      {/* Mobile-only: revisit dots (desktop hides this). */}
      {n > 1 && (
        <div className="mx-reel__dots" role="group" aria-label="Choose a lifetime highlight">
          {highlights.map((h, idx) => (
            <button
              key={idx}
              type="button"
              className="mx-reel__dot"
              aria-label={`${h.value}${h.suffix} ${h.label}`}
              aria-pressed={current === idx}
              data-on={current === idx ? "1" : undefined}
              onClick={() => setCurrent(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
