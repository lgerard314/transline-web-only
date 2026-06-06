"use client";
// Section-local driver for the "highlights emerge from the banner" effect (replaces
// the old sticky mission/stats block). Each left column's 3-stat highlights start
// tucked up BEHIND the image-banner (which sits at a higher z-index and occludes
// them); once the banner's top half scrolls off the top of the viewport — i.e. its
// vertical middle passes the viewport top — the stats slide down out of the banner's
// bottom edge into their resting place, scrubbed by scroll.
//
// Writes a single 0→1 progress var (--stats-out) onto each .mw-ten3__plate2-stats;
// the CSS composes the translate. 0 = fully tucked, 1 = home. var()'s fallback of 1
// (and not attaching under reduced-motion) leaves the stats at rest for no-JS /
// reduced-motion. Mirrors MillerParallax's rAF/passive-listener shape.

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function TimelineStats() {
  const pathname = usePathname();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cols = [];
    let raf = 0;
    let attached = false;

    const collect = () => {
      cols = Array.from(document.querySelectorAll("[data-stats-reveal]"))
        .map((col) => ({
          banner: col.querySelector(".mw-ten3__banner"),
          stats: col.querySelector(".mw-ten3__plate2-stats"),
          mission: col.querySelector(".mw-ten3__mission-panel"),
          last: -1,
          lastM: -1,
        }))
        .filter((c) => c.banner && c.stats);
    };

    const render = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const c of cols) {
        const r = c.banner.getBoundingClientRect();
        // HIGHLIGHTS slide out: start when the banner's TOP reaches the viewport top
        // (r.top = 0); fully out when its TOP HALF has gone above — its midpoint hits
        // the viewport top (r.top = -height/2). Span = height/2. Fixed large size.
        const p = Math.min(Math.max((0 - r.top) / (r.height / 2), 0), 1);
        if (Math.abs(p - c.last) >= 0.001) {
          c.last = p;
          c.stats.style.setProperty("--stats-out", p.toFixed(3));
        }
        // MISSION card rises straight up from the bottom of the screen. It STARTS once
        // the highlights are fully rendered — i.e. their emerge has completed, which is
        // when the banner's top half is gone (r.top <= -height/2, same point where
        // --stats-out hits 1) — and REACHES its target (rise = 1) when the highlights
        // disappear off the top (their bottom crosses the top, sb <= 0). Guarded to 0
        // until the highlights are fully rendered (r.top > -half).
        if (c.mission) {
          const sb = c.stats.getBoundingClientRect().bottom;
          const half = r.height / 2;
          const num = -half - r.top;          // 0 at fully-rendered, grows after
          const den = (sb - r.top - half) || 1; // window: fully-rendered → highlights gone
          const pm = r.top > -half ? 0 : Math.min(Math.max(num / den, 0), 1);
          if (Math.abs(pm - c.lastM) >= 0.001) {
            c.lastM = pm;
            c.mission.style.setProperty("--mission-rise", pm.toFixed(3));
          }
        }
      }
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(render); };
    const onResize = () => { collect(); onScroll(); };

    // Recompute on ANY reflow (lazy images above loading, font swaps, etc.) — those
    // shift the section without firing a scroll event, which would otherwise leave the
    // card's transform stale and let it flash into view before the banner is gone.
    const ro = new ResizeObserver(() => onScroll());

    const clear = () => cols.forEach((c) => {
      c.stats.style.removeProperty("--stats-out");
      if (c.mission) {
        c.mission.style.removeProperty("--mission-rise");
        c.mission.removeAttribute("data-armed");
      }
      c.last = -1;
      c.lastM = -1;
    });

    const enable = () => {
      if (attached) return;
      collect();
      if (!cols.length) return;
      attached = true;
      // Arm the cards FIRST: while armed, the CSS fallback is "hidden off the bottom",
      // so the card is hidden the instant the driver takes over (before render runs).
      cols.forEach((c) => { if (c.mission) c.mission.setAttribute("data-armed", ""); });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });
      ro.observe(document.body);
      render();
    };

    const disable = () => {
      if (!attached) return;
      attached = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
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
