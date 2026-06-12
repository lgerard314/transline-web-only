"use client";
// Scroll parallax for the final-CTA truck wash. The section's viewport travel maps to
// ONE var (--wash-drive, −1..1, 0 when the section is centred on screen); CSS slides
// the two lane groups in OPPOSITE local-x directions inside the rotated wash group, so
// every truck advances toward its own nose along the 30° heading as the page scrolls —
// two-way traffic scrubbed by scroll, reversible both ways, on EVERY viewport (scroll
// exists everywhere, unlike the mouse-tracking version this replaced). Standard
// rAF-coalesced writer, runs only while the section is in view (IO), never attaches
// under reduced motion (CSS rests the lanes at 0).

import { useEffect, useRef } from "react";

export function FinalWashDrive() {
  const markerRef = useRef(null);

  useEffect(() => {
    const host = markerRef.current ? markerRef.current.closest(".mw-final") : null;
    if (!host) return;
    const mqRM = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let listening = false;
    let observing = false;
    let current = 0;

    // LERPED scrub — a raw write per scroll event was extremely choppy on wheel mice:
    // a ~120px wheel notch maps to an instant ~18px lane jump (36px relative between
    // the opposing lanes), one visible snap per notch. Each frame eases the applied
    // value toward the geometric target (≈300ms settle) and the loop keeps itself
    // alive until converged, so notches glide and continuous scroll stays glued.
    const target = () => {
      const r = host.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight || 1;
      // 0 → section top at the viewport bottom; 1 → section bottom at the viewport
      // top; 0.5 → centred. Re-mapped to −1..1 so the lanes rest at 0 mid-pass.
      const p = (vh - r.top) / Math.max(1, vh + r.height);
      return Math.max(-1, Math.min(1, (p - 0.5) * 2));
    };
    const tick = () => {
      raf = 0;
      const t = target();
      current += (t - current) * 0.14;
      if (Math.abs(t - current) < 0.0005) current = t;
      host.style.setProperty("--wash-drive", current.toFixed(4));
      if (current !== t && listening) raf = requestAnimationFrame(tick);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const listen = (on) => {
      if (on === listening) return;
      listening = on;
      if (on) {
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        onScroll();
      } else {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
      }
    };
    const io = new IntersectionObserver(([e]) => listen(e.isIntersecting), { rootMargin: "120px 0px" });

    const enable = () => {
      if (observing) return;
      observing = true;
      io.observe(host);
      onScroll();
    };
    const disable = () => {
      if (!observing) return;
      observing = false;
      io.unobserve(host);
      listen(false);
      host.style.removeProperty("--wash-drive");
    };
    const sync = () => (mqRM.matches ? disable() : enable());

    sync();
    mqRM.addEventListener("change", sync);
    return () => {
      mqRM.removeEventListener("change", sync);
      disable();
      io.disconnect();
    };
  }, []);

  return <span ref={markerRef} hidden />;
}
