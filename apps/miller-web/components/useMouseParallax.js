"use client";

import { useEffect } from "react";

// Mouse-tracking parallax for NON-LINK photos (logan, 2026-06-12): photos
// that aren't links carry no hover grammar (no zoom, no bar-grow — that
// vocabulary is reserved for linked cards); instead, once rendered, the
// photo drifts a few px after the cursor. The hook writes --mpx/--mpy
// (−1…1, rAF-coalesced) on the tracked element; the consumer's CSS moves
// the img against a small scale headroom with a slow eased transition, so
// the drift reads as a fluid magnetic follow and returns softly on leave.
// Fine-pointer hover surfaces only; never attaches under reduced motion.
export function useMouseParallax(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined" || !window.matchMedia) return undefined;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let raf = 0;
    let last = null;
    const write = () => {
      raf = 0;
      if (!last) return;
      const r = el.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((last.x - r.left) / r.width) * 2 - 1));
      const y = Math.max(-1, Math.min(1, ((last.y - r.top) / r.height) * 2 - 1));
      el.style.setProperty("--mpx", x.toFixed(3));
      el.style.setProperty("--mpy", y.toFixed(3));
    };
    const onMove = (e) => {
      last = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(write);
    };
    const onLeave = () => {
      last = null;
      el.style.setProperty("--mpx", "0");
      el.style.setProperty("--mpy", "0");
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
}
