"use client";
// Scroll-linked diagonal wipe for the history banner. Writes two 0→1 progress vars
// onto each [data-history-wipe] container:
//   --wipe-box — the brown chevron container; fully revealed once the banner's
//     vertical midpoint (top half of the chip) reaches the viewport bottom.
//   --wipe     — the photo window-open + zoom (unchanged timing; lags the box in CSS).
// Reversible on scroll-up. Mirrors MillerParallax's
// rAF/CSS-var idiom: the JS only writes a var, the visual is composed in CSS, and
// geometry is read via getBoundingClientRect (layout-based) so the mask never
// feeds back into the next read.
//
// Why a section-local driver rather than extending the shared MillerParallax:
// this effect belongs only to the history banner, so it ships self-contained with
// the template — no edit to a shared driver other agents may be mid-change on, and
// it self-mounts wherever TimelineSplit01 renders.
//
// A11y: prefers-reduced-motion → no listener is attached and --wipe / --wipe-box are cleared,
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
        // Photo timing — read from the inner header so the image reveal doesn't begin
        // until the title/lead block crosses the viewport bottom (unchanged).
        head: el.querySelector(".mw-ten3__head") || el,
        imgSpan: parseFloat(el.getAttribute("data-history-wipe-span")) || 0.55,
        lastImg: -1,
        lastBox: -1,
      }));
    };

    const render = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const it of els) {
        const bannerRect = it.el.getBoundingClientRect();
        const headRect = it.head.getBoundingClientRect();
        // Container — 0 when the banner top is at the viewport bottom; 1 once the
        // banner midpoint (top half of the chip) reaches the viewport bottom.
        const halfH = Math.max(1, bannerRect.height * 0.5);
        const pBox = Math.min(Math.max((vh - bannerRect.top) / halfH, 0), 1);
        // Photo — unchanged: header top at vh → 0; rises span*vh → 1.
        const pImg = Math.min(Math.max((vh - headRect.top) / (vh * it.imgSpan), 0), 1);
        if (Math.abs(pBox - it.lastBox) >= 0.001) {
          it.lastBox = pBox;
          it.el.style.setProperty("--wipe-box", pBox.toFixed(3));
        }
        if (Math.abs(pImg - it.lastImg) >= 0.001) {
          it.lastImg = pImg;
          it.el.style.setProperty("--wipe", pImg.toFixed(3));
        }
        // Hero-style head/body entrance once the brown chevron container is fully on.
        it.el.toggleAttribute("data-head-settled", pBox >= 0.999);
      }
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(render); };
    const onResize = () => { onScroll(); };

    const clear = () => {
      for (const it of els) {
        it.el.style.removeProperty("--wipe");
        it.el.style.removeProperty("--wipe-box");
        it.el.removeAttribute("data-head-armed");
        it.el.removeAttribute("data-head-settled");
        it.lastImg = -1;
        it.lastBox = -1;
      }
    };

    const enable = () => {
      if (attached) return;
      collect();
      if (!els.length) return;
      for (const it of els) it.el.setAttribute("data-head-armed", "");
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
