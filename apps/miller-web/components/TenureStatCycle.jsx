"use client";

import { useEffect, useState } from "react";

// Cycles the colossal big-numeral anchor in the Tenure section. The
// outer wrapper is stable (so it can be position: sticky without
// React unmounting it on each tick); the inner element gets a fresh
// key per tick so the fade-in keyframe re-runs. Pauses on
// prefers-reduced-motion — the first stat just stays put.
export function TenureStatCycle({ stats, interval = 6000 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!stats || stats.length <= 1) return;
    const mql = typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    if (mql && mql.matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % stats.length), interval);
    return () => clearInterval(id);
  }, [stats, interval]);

  if (!stats || stats.length === 0) return null;
  const current = stats[index];

  return (
    <div className="mw-tenure__anchor">
      <div className="mw-tenure__anchor-inner" key={index}>
        <span className="mw-tenure__big">{current.value}</span>
        <span className="mw-tenure__big-suffix">{current.suffix}</span>
        <span className="mw-tenure__big-label">{current.label}</span>
      </div>
      <div className="mw-tenure__anchor-dots" aria-hidden="true">
        {stats.map((_, i) => (
          <span
            key={`${index}-${i}`}
            className={"mw-tenure__anchor-dot" + (i === index ? " is-active" : "")}
            style={i === index ? { "--cycle-duration": `${interval}ms` } : undefined}
          />
        ))}
      </div>
      <span className="tl-sr-only" aria-live="polite" aria-atomic="true">
        {`${current.value}${current.suffix ? " " + current.suffix : ""} — ${current.label}`}
      </span>
    </div>
  );
}
