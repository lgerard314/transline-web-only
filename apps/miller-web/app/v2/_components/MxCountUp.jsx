"use client";
import { useEffect, useRef } from "react";

// Count-up numeral for /v2. Ref-based (writes node.textContent — no per-frame
// React re-render), IntersectionObserver-triggered, rAF easeOutCubic. The final
// value is rendered once as an invisible SIZER so the live numeral never
// reflows its frame as digits/commas appear (the seal frame must not pulse).
// Animating digits are aria-hidden; an sr-only span carries the final value so
// screen readers announce it once. prefers-reduced-motion shows the final value
// immediately. Calls onComplete() once when the count settles.
export function MxCountUp({ value, suffix = "", duration = 1600, onComplete, className }) {
  const liveRef = useRef(null);
  const doneRef = useRef(false);
  const fmt = (n) => n.toLocaleString("en-US");
  const finalText = fmt(value) + suffix;

  useEffect(() => {
    const node = liveRef.current;
    if (!node) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finish = () => {
      node.textContent = finalText;
      if (!doneRef.current) { doneRef.current = true; onComplete && onComplete(); }
    };
    if (mq.matches) { finish(); return; }

    let raf = 0;
    let startTs = 0;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (ts) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      node.textContent = fmt(Math.round(ease(p) * value)) + suffix;
      if (p < 1) raf = requestAnimationFrame(step);
      else finish();
    };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { io.unobserve(e.target); raf = requestAnimationFrame(step); }
      }
    }, { threshold: 0.4 });
    io.observe(node);
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [value, suffix, duration, finalText, onComplete]);

  return (
    <span className={`mx-cu ${className || ""}`}>
      <span className="mx-cu__sizer" aria-hidden="true">{finalText}</span>
      <span className="mx-cu__live" ref={liveRef} aria-hidden="true">{"0" + suffix}</span>
      <span className="tl-sr-only">{finalText}</span>
    </span>
  );
}
