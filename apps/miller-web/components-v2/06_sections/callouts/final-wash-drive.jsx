"use client";
// Scroll parallax for the final-CTA truck wash. The section's viewport travel maps to
// two composited image-layer transforms, so the scrub avoids repainting hundreds of
// individual SVG stamps. It runs only while the section is near view and disables
// entirely under reduced motion.

import { useEffect, useRef } from "react";

const LAYER_DRIVE = [
  { selector: ".mw-final__wash-layer--rtl", x: -113, y: 65 },
  { selector: ".mw-final__wash-layer--ltr", x: 113, y: -65 },
];

function translate(x, y, amount) {
  return `translate3d(${(x * amount).toFixed(2)}px, ${(y * amount).toFixed(2)}px, 0)`;
}

export function FinalWashDrive() {
  const markerRef = useRef(null);

  useEffect(() => {
    const host = markerRef.current ? markerRef.current.closest(".mw-final") : null;
    if (!host) return;
    const wash = host.querySelector(".mw-final__wash");
    const layers = LAYER_DRIVE
      .map((lane) => ({ ...lane, el: host.querySelector(lane.selector) }))
      .filter((lane) => lane.el);
    if (!layers.length) return;

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
      layers.forEach((lane) => {
        lane.el.style.transform = translate(lane.x, lane.y, current);
      });
      if (current !== t && listening) raf = requestAnimationFrame(tick);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const listen = (on) => {
      if (on === listening) return;
      listening = on;
      if (on) {
        wash?.setAttribute("data-wash-active", "true");
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        onScroll();
      } else {
        wash?.removeAttribute("data-wash-active");
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
    };
    const disable = () => {
      if (!observing) return;
      observing = false;
      io.unobserve(host);
      listen(false);
      current = 0;
      layers.forEach((lane) => {
        lane.el.style.removeProperty("transform");
      });
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
