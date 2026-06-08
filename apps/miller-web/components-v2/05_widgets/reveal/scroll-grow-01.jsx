"use client";
import { useEffect, useRef } from "react";

// ScrollGrow01 — scroll-driven "grow into place" reveal, the same mechanism as
// ImageAccordion01: a progress var --p (0→1) is written on the element and the CSS
// consumer scrubs scale + opacity off it.
//
//   syncTo: a selector — when set, the element MIRRORS that element's live --p each
//           frame (e.g. the first image container `.mw-iacc__panel`), so the two
//           reveal in perfect lockstep (when that container is full, this is full).
//   otherwise: a local rAF driver computes --p from the element's own viewport
//           position (offsetTop chain → transform-independent, recomputed live).
//
// Inline --p:0 start; reduced-motion → rest.
export function ScrollGrow01({ className, children, style, syncTo, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const target = syncTo ? document.querySelector(syncTo) : null;
    let raf = 0;

    const compute = () => {
      raf = 0;
      if (mq.matches) { el.style.setProperty("--p", "1"); return; }
      if (target) {
        // Mirror the first image container's progress exactly.
        el.style.setProperty("--p", target.style.getPropertyValue("--p") || "0");
        return;
      }
      let top = 0, node = el;
      while (node) { top += node.offsetTop; node = node.offsetParent; }
      top -= window.scrollY;
      const vh = window.innerHeight;
      const start = vh * 0.85, end = vh * 0.55;
      let p = (start - top) / (start - end);
      p = p < 0 ? 0 : p > 1 ? 1 : p;
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute); };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    mq.addEventListener("change", compute);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mq.removeEventListener("change", compute);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [syncTo]);

  return (
    <div ref={ref} className={className} style={{ "--p": 0, ...style }} {...rest}>
      {children}
    </div>
  );
}
