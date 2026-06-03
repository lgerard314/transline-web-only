"use client";
// L5 · count-up-01 — animates a number from 0 to `value` once it scrolls into
// view (IntersectionObserver + rAF, easeOutCubic). Writes straight to the DOM
// node's textContent so there are no per-frame React re-renders. The visible
// digits are aria-hidden; a visually-hidden span carries the final value so
// screen readers announce "49M+" once, never the ticking intermediates. Under
// prefers-reduced-motion the final value is set immediately with no animation.
import { useEffect, useRef } from "react";

export function CountUp01({ value, suffix = "", duration = 1600, className = "" }) {
  const numRef = useRef(null);
  useEffect(() => {
    const node = numRef.current;
    if (!node) return;
    const fmt = (n) => Math.round(n).toLocaleString("en-US");
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      node.textContent = fmt(value) + suffix;
      return;
    }
    node.textContent = "0" + suffix;
    let raf = 0;
    let start = 0;
    const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic — fast in, gentle settle
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      node.textContent = fmt(ease(p) * value) + suffix;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          start = 0;
          raf = requestAnimationFrame(tick);
          io.unobserve(e.target);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, suffix, duration]);

  return (
    <span className={"mw-countup" + (className ? " " + className : "")}>
      <span ref={numRef} aria-hidden="true">0{suffix}</span>
      <span className="tl-sr-only">{value.toLocaleString("en-US")}{suffix}</span>
    </span>
  );
}
