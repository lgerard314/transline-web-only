"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Page-local scroll parallax for /v2. Keys off data-mx-parallax /
// data-mx-parallax-speed ONLY (the global MillerParallax reads the shared
// attribute and stays inert here). Transform-only (GPU-composited), rAF-
// coalesced, passive listeners. prefers-reduced-motion disables it and clears
// any applied transform. Drift is clamped to a fraction of the element's own
// height so an overhang wrapper never exposes a hard edge.
export function MxParallax() {
  const pathname = usePathname();
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let els = [];
    let raf = 0;
    let attached = false;

    const collect = () => {
      els = Array.from(document.querySelectorAll("[data-mx-parallax]")).map((el) => ({
        el,
        speed: parseFloat(el.getAttribute("data-mx-parallax-speed")) || 0.12,
        maxFrac: parseFloat(el.getAttribute("data-mx-parallax-max")) || 0.14,
      }));
    };
    const render = () => {
      raf = 0;
      const y = window.scrollY;
      for (const it of els) {
        const max = it.el.offsetHeight * it.maxFrac;
        const off = Math.min(Math.max(y * it.speed, -max), max);
        it.el.style.transform = `translate3d(0, ${off.toFixed(2)}px, 0)`;
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(render); };
    const clear = () => { for (const it of els) it.el.style.transform = ""; };

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

    const t1 = setTimeout(sync, 80);
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
