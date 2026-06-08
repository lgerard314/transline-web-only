"use client";
// Scroll-linked parallax depth for tagged elements. Two modes share one rAF tick:
//
//   [data-parallax]      — ABSOLUTE mode (the hero). Drifts by scrollY * speed,
//                          clamped to a fraction of its own height. Anchored to
//                          the top of the document, so it only reads naturally
//                          for an element that starts at the top of the page.
//
//   [data-parallax-img]  — VIEWPORT mode (every other photo). Drifts by how far
//                          the element's centre sits from the viewport centre, so
//                          each photo lags as it scrolls THROUGH the viewport
//                          (the same "photo moving a little" feel as the hero, but
//                          correct for elements anywhere down the page). The JS
//                          writes only a CSS var (--px-y); the element's transform
//                          (translate + a base scale that gives the drift its
//                          headroom) is composed in CSS so hover scales can stack.
//
// Why transform-only + rAF: translate3d/scale are GPU-composited (no per-frame
// layout/paint), and one rAF tick coalesces every scroll/resize event. Viewport
// metrics come from offsetTop/offsetHeight (layout-based, transform-independent)
// so the written transform never feeds back into the next read.
//
// A11y: prefers-reduced-motion disables everything — no listener is attached, any
// prior transform/var is cleared, and the CSS drops the base scale too.

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MillerParallax() {
  const pathname = usePathname();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    let absEls = [];
    let imgEls = [];
    let raf = 0;
    let attached = false;

    // Document-absolute top via the offset chain — ignores transforms, so the
    // element's own scale/translate can't perturb the measurement.
    const docTop = (el) => {
      let y = 0, n = el;
      while (n) { y += n.offsetTop; n = n.offsetParent; }
      return y;
    };

    const collect = () => {
      absEls = Array.from(document.querySelectorAll("[data-parallax]")).map((el) => ({
        el,
        speed: parseFloat(el.getAttribute("data-parallax-speed")) || 0.12,
        maxFrac: parseFloat(el.getAttribute("data-parallax-max")) || 0.12,
      }));
      imgEls = Array.from(document.querySelectorAll("[data-parallax-img]")).map((el) => ({
        el,
        speed: parseFloat(el.getAttribute("data-parallax-speed")) || 0.06,
        // drift capped a hair under the base scale's headroom (1.12 → 6%) so a
        // clipped edge is never exposed even at the scroll extremes
        maxFrac: parseFloat(el.getAttribute("data-parallax-max")) || 0.05,
        // optional sideways drift (data-parallax-x) — card photos get a touch of
        // horizontal travel keyed to the vertical so they drift on a diagonal
        // (up-left ↔ down-right) instead of straight up/down like backgrounds.
        xRatio: parseFloat(el.getAttribute("data-parallax-x")) || 0,
        base: docTop(el),
        h: el.offsetHeight,
        w: el.offsetWidth,
      }));
    };

    const render = () => {
      raf = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;
      for (const it of absEls) {
        const max = it.el.offsetHeight * it.maxFrac;
        const offset = Math.min(Math.max(y * it.speed, -max), max);
        it.el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      }
      for (const it of imgEls) {
        // VBEC pin: leave last --px-* in place while highlights scrub / hold so the
        // photos don't drift or appear to zoom as the figclip band grows.
        if (it.el.closest("[data-fig-reveal], [data-fig-done]")) continue;
        const elCenter = it.base + it.h / 2 - y; // centre, relative to viewport top
        const delta = vh / 2 - elCenter;         // + when the photo is above centre
        const max = it.h * it.maxFrac;
        const offset = Math.min(Math.max(delta * it.speed, -max), max);
        it.el.style.setProperty("--px-y", `${offset.toFixed(2)}px`);
        if (it.xRatio) {
          // sideways drift tracks the vertical (same sign → left when it rises),
          // clamped to its own horizontal headroom.
          const maxX = it.w * it.maxFrac;
          const ox = Math.min(Math.max(offset * it.xRatio, -maxX), maxX);
          it.el.style.setProperty("--px-x", `${ox.toFixed(2)}px`);
        }
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    // Layout changed → viewport-mode anchors (base/h) are stale; re-measure.
    const onResize = () => {
      collect();
      onScroll();
    };

    const clear = () => {
      for (const it of absEls) it.el.style.transform = "";
      for (const it of imgEls) { it.el.style.removeProperty("--px-y"); it.el.style.removeProperty("--px-x"); }
    };

    const enable = () => {
      if (attached) return;
      collect();
      if (!absEls.length && !imgEls.length) return;
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

    // Collect after first paint and again after load (tagged elements may mount
    // later / change height once images settle).
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
