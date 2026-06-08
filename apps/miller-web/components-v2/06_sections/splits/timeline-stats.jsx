"use client";
// Section-local driver for the "highlights grow out of the banner's bottom" effect. The
// stats band sits tucked one band-height UP behind the image-banner (which is at a higher
// z-index and occludes it); as the banner APPROACHES its pin line (the header bottom) and
// settles onto it, the band slides down out of the banner's bottom edge into its resting
// slot (which now spans from the banner's bottom to the bottom of the screen), scrubbed by
// scroll. Writes a single 0→1 progress var (--stats-out) onto the band; the
// CSS composes the translate (0 = tucked, 1 = home). var()'s fallback of 1 (and not
// attaching under reduced-motion) leaves the band at rest for no-JS / reduced-motion.
//
// Geometry is read from the BANNER's getBoundingClientRect (never the band's own — the
// band is transformed, so reading it would feed back into the next frame). Mirrors the
// rAF / passive-listener shape of the other section-local drivers.

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
      cols = Array.from(document.querySelectorAll(".mw-ten3__col"))
        .map((col) => {
          const grid = col.closest(".mw-ten3__grid");
          return {
            banner: col.querySelector(".mw-ten3__banner"),
            stats: col.querySelector(".mw-ten3__aside"),
            lastItem: grid ? ([...grid.querySelectorAll(".mw-ten3__item")].pop() || null) : null,
            bmission: col.querySelector(".mw-ten3__bmission"),
            timeline: grid ? grid.querySelector(".mw-ten3__line") : null,
            grid,
            last: -1,
            lastRev: -1,
            lastHl: -1,
            lastUnpin: false,
            lastSettled: false,
            hlIdx: -1,
            hlBase: -1,
          };
        })
        .filter((c) => c.banner && c.stats);
      cols.forEach(setRedge);
    };

    // The band's RIGHT edge is the SAME line as the banner's bottom-half chevron, continued
    // downward: the banner edge runs `ang` horizontally over bh/2 vertically → slope =
    // ang/(bh/2). The band butts directly against the banner's bottom, so its top-right
    // inset = ang (the banner's bottom-right corner) and its bottom-right continues that
    // slope a further slope·height. ang mirrors the banner's clamp(36px, 7%, 100px) of its
    // width. Layout-only (offset metrics), so the band's own transform can't perturb it.
    const setRedge = (c) => {
      const bw = c.banner.offsetWidth;
      const bh = c.banner.offsetHeight;
      if (!bw || !bh) return;
      const ang = Math.min(Math.max(36, 0.07 * bw), 100);
      const slope = ang / (bh / 2);
      const hH = c.stats.offsetHeight;
      c.stats.style.setProperty("--stats-tinset", ang.toFixed(1) + "px");
      c.stats.style.setProperty("--stats-redge", (slope * hH).toFixed(1) + "px");
    };

    const render = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const c of cols) {
        const r = c.banner.getBoundingClientRect();
        // The banner pins to the header line (--hdr), so it never scrolls its middle past
        // the top any more. Instead the band grows out as the banner APPROACHES the pin: 0
        // while the banner's top is a band-fraction above the pin, rising to 1 as it settles
        // onto the line (and stays 1 while pinned, since r.top then holds at HDR).
        const HDR = 56;
        const RANGE = (r.height * 0.6) || 1;
        const p = Math.min(Math.max(1 - (r.top - HDR) / RANGE, 0), 1);
        if (Math.abs(p - c.last) >= 0.001) {
          c.last = p;
          c.stats.style.setProperty("--stats-out", p.toFixed(3));
        }
        // Highlights → cream wipe. The band stays LOCKED in place (pinned, never scrolls up); only its
        // white background colour and its content shift up inside it. The white's bottom (the gradient
        // colour line) sits exactly at the BOTTOM of the last timeline item: --hl-rev = 1 − (lastItem
        // bottom − band pinned-top) / band height. 0 when the last item's bottom is at the band's
        // bottom edge (all white); 1 once it has risen to the band's top (all cream). The container's
        // pinned top is fixed (HDR + banner height), so this is independent of any band movement. The
        // cream lives in the band's ONE fixed chevron clip (cream below the line, white above), so it
        // is always inside the white's silhouette — never a pixel of cream to the right of the white.
        if (c.lastItem) {
          const ah = c.stats.offsetHeight || 1;
          const pinnedTop = HDR + (c.banner ? c.banner.offsetHeight : 0);
          const liBot = c.lastItem.getBoundingClientRect().bottom;
          const hl = Math.min(Math.max(1 - (liBot - pinnedTop) / ah, 0), 1);
          if (Math.abs(hl - c.lastHl) >= 0.001) {
            c.lastHl = hl;
            c.stats.style.setProperty("--hl-rev", hl.toFixed(3));
          }
          // Once the highlights are 100% gone (wipe complete), RELEASE the whole pinned stack — the
          // mission banner AND the highlights band — by freezing them as absolutely-positioned
          // elements at the EXACT spots they currently occupy, so further scrolling carries them
          // smoothly UP and out of view together. Freezing only the banner would leave the still-
          // pinned highlights behind and open a gap between them. Reverts (re-pins) on scroll back up.
          const unpin = hl >= 0.999;
          if (unpin !== c.lastUnpin) {
            c.lastUnpin = unpin;
            if (unpin) {
              // Freeze the stack at its DETERMINISTIC pinned positions — banner top at the header line
              // (HDR), highlights one banner-height below (HDR + bh) — computed relative to the column.
              // Reading the LIVE rects instead would, on a FAST scroll, capture the band where it has
              // already released/scrolled off, freezing it misaligned or off-screen (the bug). The
              // column is in normal flow, so its top is stable to read at any scroll speed.
              const col = (c.banner || c.stats).parentElement;
              const colTop = col ? col.getBoundingClientRect().top : 0;
              const bh = c.banner ? c.banner.offsetHeight : 0;
              if (c.banner) { c.banner.style.marginTop = "0px"; c.banner.style.top = (HDR - colTop).toFixed(1) + "px"; c.banner.style.position = "absolute"; }
              if (c.stats) { c.stats.style.marginTop = "0px"; c.stats.style.top = (HDR + bh - colTop).toFixed(1) + "px"; c.stats.style.position = "absolute"; }
            } else {
              for (const el of [c.banner, c.stats]) if (el) { el.style.position = ""; el.style.top = ""; el.style.marginTop = ""; }
            }
          }
        }
        // Mission reveal — STARTS a touch after the timeline's midpoint passes the bottom of
        // the screen (REV_DELAY past the crossing), then ramps 0→1 over the next ~40% of
        // viewport scroll. Written onto the banner so the in-banner mission layer reads it.
        if (c.timeline) {
          const lr = c.timeline.getBoundingClientRect();
          const mid = lr.top + lr.height / 2;
          const REV_DELAY = vh * 0.15; // hold a beat past the midpoint before it begins
          const REV_RANGE = vh * 0.15 || 1; // quick — ramps 0→1 over a short scroll span
          const rev = Math.min(Math.max((vh - mid - REV_DELAY) / REV_RANGE, 0), 1);
          if (Math.abs(rev - c.lastRev) >= 0.001) {
            c.lastRev = rev;
            c.banner.style.setProperty("--mission-rev", rev.toFixed(3));
          }
          // Fire the "settle" pop on the heading the moment the reveal locks in (and re-arm
          // if you scroll back out, so it replays on re-entry).
          const settled = rev >= 0.999;
          if (settled !== c.lastSettled) {
            c.lastSettled = settled;
            if (c.bmission) c.bmission.toggleAttribute("data-settled", settled);
          }
          // Single-highlight cycle: only ONE of the three track-record stats shows at a time,
          // cross-fading in place. Highlight 1 on reveal; swap to 2 the moment the mission
          // container appears (--mission-rev past its midpoint); swap to 3 once two MORE
          // milestone items have rendered past that point (baseline = the revealed count when
          // the mission appeared). Scrolling back out (mission gone) resets to highlight 1.
          const missionShown = rev >= 0.5;
          let idx = 0;
          if (missionShown) {
            const revealed = c.grid ? c.grid.querySelectorAll(".mw-ten3__item[data-in]").length : 0;
            if (c.hlBase < 0) c.hlBase = revealed;
            idx = revealed >= c.hlBase + 2 ? 2 : 1;
          } else {
            c.hlBase = -1;
          }
          if (idx !== c.hlIdx) {
            c.hlIdx = idx;
            c.stats.setAttribute("data-hl", String(idx));
          }
        }
      }
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(render); };
    const onResize = () => { collect(); onScroll(); };

    // Recompute on any reflow (lazy images above settling, font swaps) — those shift the
    // banner without a scroll event, which would otherwise leave the band's translate stale.
    const ro = new ResizeObserver(() => onScroll());

    const clear = () => cols.forEach((c) => {
      c.stats.style.removeProperty("--stats-out");
      c.stats.style.removeProperty("--stats-tinset");
      c.stats.style.removeProperty("--stats-redge");
      c.stats.style.removeProperty("--hl-rev");
      c.stats.removeAttribute("data-hl");
      c.banner.style.removeProperty("--mission-rev");
      if (c.bmission) { c.bmission.removeAttribute("data-settled"); c.bmission.removeAttribute("data-rev-armed"); }
      for (const el of [c.banner, c.stats]) if (el) { el.style.position = ""; el.style.top = ""; el.style.marginTop = ""; }
      c.last = -1;
      c.lastRev = -1;
      c.lastHl = -1;
      c.lastUnpin = false;
      c.lastSettled = false;
      c.hlIdx = -1;
      c.hlBase = -1;
    });

    const enable = () => {
      if (attached) return;
      collect();
      if (!cols.length) return;
      attached = true;
      // Arm the mission heading's mask-rise: the heading is parked below its clip only while this
      // flag is present, so with JS off / before this runs the heading stays visible.
      cols.forEach((c) => { if (c.bmission) c.bmission.setAttribute("data-rev-armed", ""); });
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
