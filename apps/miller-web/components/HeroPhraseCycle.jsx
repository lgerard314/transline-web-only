"use client";

import { useEffect, useState } from "react";

// Accepts strings or `{ text, tone }` objects. Tone "accent" renders the phrase
// in the terracotta brand color.
function normalize(p) {
  return typeof p === "string" ? { text: p } : p;
}

// Cycles through a list of phrases on a steady interval. Renders inline-block
// so it can sit on the same line as static text (e.g. "in <cycle>"). A hidden
// sizer reserves the width of the longest phrase so the line doesn't reflow
// mid-cycle. Pauses when prefers-reduced-motion is on — the static first
// phrase remains.
export function HeroPhraseCycle({ phrases, interval = 4160 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!phrases || phrases.length <= 1) return;
    const mql = typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    if (mql && mql.matches) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, interval);
    return () => clearInterval(id);
  }, [phrases, interval]);

  if (!phrases || phrases.length === 0) return null;

  const items = phrases.map(normalize);
  const sizer = items.reduce((a, b) => (a.text.length >= b.text.length ? a : b));

  return (
    <span className="mw-hero__cycle" aria-label={items[index].text}>
      <span className="mw-hero__cycle-sizer" aria-hidden="true">{sizer.text}</span>
      {items.map((p, i) => (
        <span
          key={i}
          className={
            "mw-hero__cycle-item" +
            (i === index ? " is-active" : "") +
            (p.tone === "accent" ? " mw-hero__cycle-item--accent" : "")
          }
          aria-hidden={i !== index}
        >
          {p.text}
        </span>
      ))}
      <span className="tl-sr-only" aria-live="polite" aria-atomic="true">
        {items[index].text}
      </span>
    </span>
  );
}
