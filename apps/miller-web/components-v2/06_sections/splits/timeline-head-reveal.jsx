"use client";
// Scroll-driven reveal for the history banner headline + lead. Each part (title line 1,
// title line 2, body paragraph) has its own motion and fires independently the moment
// the WHOLE part + ENTRY_PAD fits above the viewport bottom — same entry rule as
// <TimelineReveal> milestones. Reversible on scroll-up.

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ENTRY_PAD = 40;

export function TimelineHeadReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let banners = [];
    let raf = 0;
    let attached = false;

    const collect = () => {
      banners = Array.from(document.querySelectorAll("[data-history-wipe]")).map((banner) => {
        const head = banner.querySelector(".mw-ten3__head");
        const parts = head
          ? Array.from(head.querySelectorAll("[data-head-part]")).map((el) => ({
              el,
              on: el.hasAttribute("data-in"),
            }))
          : [];
        return { banner, head, parts };
      });
    };

    const render = () => {
      raf = 0;
      const vh = window.innerHeight;
      const writes = [];
      for (const { head, parts } of banners) {
        if (!head || !parts.length) continue;
        for (const part of parts) {
          const rect = part.el.getBoundingClientRect();
          const on = rect.bottom + ENTRY_PAD <= vh;
          if (on !== part.on) writes.push([part, on]);
        }
      }
      for (const [part, on] of writes) {
        part.on = on;
        if (on) part.el.setAttribute("data-in", "1");
        else part.el.removeAttribute("data-in");
      }
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(render); };
    const onResize = () => { collect(); onScroll(); };

    const clear = () => {
      for (const { banner, parts } of banners) {
        banner.removeAttribute("data-head-armed");
        for (const part of parts) {
          part.el.removeAttribute("data-in");
          part.on = false;
        }
      }
    };

    const enable = () => {
      if (attached) return;
      collect();
      if (!banners.length) return;
      attached = true;
      for (const { banner } of banners) banner.setAttribute("data-head-armed", "");
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
