"use client";
// Scroll-linked parallax depth for elements tagged [data-parallax].
//
// Each tagged element drifts vertically at a fraction of scroll speed
// (data-parallax-speed, default 0.12), giving the hero photograph a
// cinematic sense of depth as the content scrolls over it. The drift is
// clamped to a fraction of the element's own height (data-parallax-max,
// default 0.12) so a tagged wrapper that overhangs its clip box can never
// translate far enough to expose a hard edge.
//
// Why transform-only + rAF: translate3d is GPU-composited (no per-frame
// layout/paint), and a single rAF tick coalesces every scroll/resize
// event so we never do work more than once per frame. We read scrollY
// (no per-element getBoundingClientRect on the hot path) and write
// transforms in the same frame.
//
// A11y: prefers-reduced-motion disables parallax entirely — no listener
// is attached and any prior transform is cleared — because scroll-linked
// motion is exactly the kind of vestibular trigger the setting exists to
// suppress.

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MillerParallax() {
  const pathname = usePathname();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    let els = [];
    let raf = 0;
    let attached = false;

    const collect = () => {
      els = Array.from(document.querySelectorAll("[data-parallax]")).map((el) => ({
        el,
        speed: parseFloat(el.getAttribute("data-parallax-speed")) || 0.12,
        maxFrac: parseFloat(el.getAttribute("data-parallax-max")) || 0.12,
      }));
    };

    const render = () => {
      raf = 0;
      const y = window.scrollY;
      for (const item of els) {
        const max = item.el.offsetHeight * item.maxFrac;
        // Drift down as the page scrolls up so the photo lags the content
        // (classic parallax); clamp into the element's headroom.
        const offset = Math.min(Math.max(y * item.speed, -max), max);
        item.el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    const clear = () => {
      for (const item of els) item.el.style.transform = "";
    };

    const enable = () => {
      if (attached) return;
      collect();
      if (!els.length) return;
      attached = true;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      render();
    };

    const disable = () => {
      if (!attached) return;
      attached = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      clear();
    };

    const sync = () => (mq.matches ? disable() : enable());

    // Collect after first paint and again after load (tagged elements may
    // mount in a later tick / change height once images settle).
    const t1 = setTimeout(sync, 60);
    const onLoad = () => { if (attached) { collect(); onScroll(); } else sync(); };
    window.addEventListener("load", onLoad);
    mq.addEventListener("change", sync);

    return () => {
      clearTimeout(t1);
      window.removeEventListener("load", onLoad);
      mq.removeEventListener("change", sync);
      disable();
    };
  }, [pathname]);

  return null;
}
