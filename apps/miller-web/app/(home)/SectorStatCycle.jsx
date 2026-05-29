"use client";

import { useEffect, useState } from "react";

// Cycles through a list of stats with a fade-in animation on each change and
// a per-dot progress fill that matches the cycle interval. Pauses when
// prefers-reduced-motion is on — the first stat stays put.
export function SectorStatCycle({ stats, interval = 5500 }) {
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
    <div className="mw-stat-cycle">
      <div className="mw-stat-cycle__inner" key={index}>
        <span className="mw-stat-cycle__label">{current.label}</span>
        <span className="mw-stat-cycle__value">
          {current.value}
          {current.unit && <span className="mw-stat-cycle__unit">{current.unit}</span>}
        </span>
        <p className="mw-stat-cycle__text">{current.text}</p>
      </div>
      <div className="mw-stat-cycle__dots" aria-hidden="true">
        {stats.map((_, i) => (
          <span
            key={`${index}-${i}`}
            className={"mw-stat-cycle__dot" + (i === index ? " is-active" : "") + (i < index ? " is-past" : "")}
            style={i === index ? { "--cycle-duration": `${interval}ms` } : undefined}
          />
        ))}
      </div>
      <span className="tl-sr-only" aria-live="polite" aria-atomic="true">
        {`${current.label}: ${current.value}${current.unit ? " " + current.unit : ""}. ${current.text}`}
      </span>
    </div>
  );
}
