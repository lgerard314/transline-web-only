"use client";
import { useRef, useState, useEffect, useId } from "react";
import { DiamondCard01 } from "@/components-v2/03_cards/note/diamond-card-01";

// The two careers diamonds joined by ONE drawn chain: a line in from the left
// edge of the screen → diamond 1's outline → connector → diamond 2's outline.
// On scroll into view the whole chain wipes in left→right (once), with a gold
// "charge" band riding the growing edge that fades to the settled terracotta —
// the same signature as the lifetime-reel section. The diamond fills + hover
// reveals live in DiamondCard01; this widget only owns the layout + the chain.
const SWEEP_MS = 1700;

// Rounded-apex diamond outline (viewBox-200 geometry, same as the seal) mapped
// into a stage-pixel box f = {x, y, w, h}. Returned as a closed loop.
function closed(f) {
  const u = (vx, vy) => `${(f.x + (vx / 200) * f.w).toFixed(2)} ${(f.y + (vy / 200) * f.h).toFixed(2)}`;
  const r = ((10 / 200) * f.w).toFixed(2);
  return `M ${u(19.29, 100)} A ${r} ${r} 0 0 1 ${u(22.22, 92.93)} L ${u(92.93, 22.22)} A ${r} ${r} 0 0 1 ${u(107.07, 22.22)} L ${u(177.78, 92.93)} A ${r} ${r} 0 0 1 ${u(177.78, 107.07)} L ${u(107.07, 177.78)} A ${r} ${r} 0 0 1 ${u(92.93, 177.78)} L ${u(22.22, 107.07)} A ${r} ${r} 0 0 1 ${u(19.29, 100)} Z`;
}

export function CareersDiamonds01({ cards }) {
  const rowRef = useRef(null);
  const gid = useId().replace(/[:]/g, "");
  const [geom, setGeom] = useState(null); // { d, left, w, h, sw }
  const [phase, setPhase] = useState("idle"); // idle → draw → done

  // Measure the two diamond boxes against a full-viewport-width stage (so the
  // lead-in line can start at x=0 = the left screen edge). Rebuilds on resize.
  useEffect(() => {
    const row = rowRef.current;
    if (!row || typeof window === "undefined") return;
    const measure = () => {
      const rr = row.getBoundingClientRect();
      const dias = [...row.querySelectorAll(".mw-cdia")];
      if (dias.length < 2 || !rr.width) return;
      // apex fractions of the .mw-cdia box: left 7.58% / right 92.42% / mid 50%
      const box = (el) => {
        const b = el.getBoundingClientRect();
        return { x: b.left, y: b.top - rr.top, w: b.width, h: b.height };
      };
      const f1 = box(dias[0]);
      const f2 = box(dias[1]);
      const apexL = (f) => f.x + 0.0758 * f.w;
      const apexR = (f) => f.x + 0.9242 * f.w;
      const midY = (f) => f.y + 0.5 * f.h;
      const leadLine = `M 0 ${midY(f1).toFixed(2)} L ${apexL(f1).toFixed(2)} ${midY(f1).toFixed(2)}`;
      const conn = `M ${apexR(f1).toFixed(2)} ${midY(f1).toFixed(2)} L ${apexL(f2).toFixed(2)} ${midY(f2).toFixed(2)}`;
      const d = `${leadLine} ${closed(f1)} ${conn} ${closed(f2)}`;
      // Stage spans viewport-left (x=0) → diamond 2's right apex. The SVG is
      // shifted left by the row's offset so x=0 sits at the screen edge.
      setGeom({ d, left: rr.left, w: apexR(f2), h: rr.height, sw: 2 });
    };
    let raf, n = 0;
    const loop = () => { measure(); if (n++ < 8) raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", measure);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", measure); };
  }, []);

  // Trigger the wipe once when the row scrolls into view (reduced motion → jump
  // straight to the settled state).
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setPhase("done"); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        setPhase("draw");
        const t = setTimeout(() => setPhase("done"), SWEEP_MS + 80);
        row.__t = t;
      }
    }, { threshold: 0.35 });
    io.observe(row);
    return () => { io.disconnect(); if (row.__t) clearTimeout(row.__t); };
  }, [geom]);

  return (
    <div className="mw-cdia-row" ref={rowRef} data-phase={phase} style={{ "--cdia-sweep": `${SWEEP_MS}ms` }}>
      {geom && (
        <>
          <svg className="mw-cdia-chain mw-cdia-chain--base" style={{ left: -geom.left, width: geom.w, height: geom.h }} viewBox={`0 0 ${geom.w} ${geom.h}`} preserveAspectRatio="none" aria-hidden="true">
            <path d={geom.d} fill="none" strokeWidth={geom.sw} />
          </svg>
          <svg className="mw-cdia-chain mw-cdia-chain--gold" style={{ left: -geom.left, width: geom.w, height: geom.h }} viewBox={`0 0 ${geom.w} ${geom.h}`} preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id={`g-${gid}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#d8ac5e" />
                <stop offset="0.5" stopColor="#ffe6ab" />
                <stop offset="1" stopColor="#d8ac5e" />
              </linearGradient>
            </defs>
            <path d={geom.d} fill="none" strokeWidth={geom.sw + 1.6} stroke={`url(#g-${gid})`} />
          </svg>
        </>
      )}
      <div className="mw-cdia-grid">
        {cards.map((card) => (
          <DiamondCard01 key={card.tag} tag={card.tag} title={card.title} text={card.text} cta={card.cta} />
        ))}
      </div>
    </div>
  );
}
