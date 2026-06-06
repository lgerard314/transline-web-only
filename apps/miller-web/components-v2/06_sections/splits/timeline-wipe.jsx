"use client";
// Scroll-linked diagonal wipe for the history banner photo. Writes a single
// 0→1 progress var (--wipe) onto each [data-history-wipe] container as it
// scrolls through the viewport; the CSS mask on .mw-ten3__plate2-img reveals
// the photo top-left → bottom-right in step with scroll position (reversible —
// scroll back up through the entry band and it un-wipes). Mirrors MillerParallax's
// rAF/CSS-var idiom: the JS only writes a var, the visual is composed in CSS, and
// geometry is read via getBoundingClientRect (layout-based) so the mask never
// feeds back into the next read.
//
// Why a section-local driver rather than extending the shared MillerParallax:
// this effect belongs only to the history banner, so it ships self-contained with
// the template — no edit to a shared driver other agents may be mid-change on, and
// it self-mounts wherever TimelineSplit01 renders.
//
// A11y: prefers-reduced-motion → no listener is attached and --wipe is cleared,
// so the CSS var() fallback (1 = full photo) stands; a CSS reduced-motion rule
// also drops the mask entirely as a belt-and-suspenders. Pre-hydration / no-JS
// fall back to the full photo for the same reason.

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function TimelineWipe() {
  const pathname = usePathname();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let els = [];
    let raf = 0;
    let attached = false;

    const collect = () => {
      els = Array.from(document.querySelectorAll("[data-history-wipe]")).map((el) => ({
        el,
        // How many viewport-heights of scrolling the wipe spans (smaller =
        // snappier). Reveal starts as the container's top edge enters from the
        // bottom and completes once it has risen ~55% of the viewport.
        span: parseFloat(el.getAttribute("data-history-wipe-span")) || 0.55,
        last: -1,
      }));
    };

    const render = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const it of els) {
        const rect = it.el.getBoundingClientRect();
        // 0 when the container's top sits at the viewport bottom; 1 after it has
        // travelled up by span*vh. Clamped both ends so it parks at full reveal
        // once scrolled past and stays hidden while still below the fold.
        const p = Math.min(Math.max((vh - rect.top) / (vh * it.span), 0), 1);
        // Skip the write when nothing meaningfully changed (parked at 0 or 1, or
        // sub-pixel motion) — keeps the per-frame paint off the idle extremes.
        if (Math.abs(p - it.last) < 0.001) continue;
        it.last = p;
        it.el.style.setProperty("--wipe", p.toFixed(3));
      }
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(render); };
    const onResize = () => { onScroll(); };

    const clear = () => {
      for (const it of els) { it.el.style.removeProperty("--wipe"); it.last = -1; }
    };

    const enable = () => {
      if (attached) return;
      collect();
      if (!els.length) return;
      attached = true;
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });
      render();
    };

    const disable = () => {
      if (!attached) return;
      attached = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      clear();
    };

    const sync = () => (mq.matches ? disable() : enable());

    // Collect after first paint and again after load (the banner may settle once
    // its lazy image and fonts land, shifting its top).
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
