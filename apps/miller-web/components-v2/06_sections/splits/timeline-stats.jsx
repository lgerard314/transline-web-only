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
            items: grid ? [...grid.querySelectorAll(".mw-ten3__item")] : [],
            vals: [...col.querySelectorAll(".mw-ten3__plate2-val")].map((el) => {
              const raw = el.getAttribute("data-val") || el.textContent || "0";
              return { el, target: parseFloat(raw) || 0, dec: (raw.split(".")[1] || "").length };
            }),
            countRaf: 0,
            y1: -1,
            last: -1,
            lastRev: -1,
            lastHl: -1,
            lastUnpin: false,
            lastSettled: false,
            lastBandIn: false,
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

    // Count-up for the three highlight numbers — runs when the band reveals (data-band-in),
    // ticking each 0→target with easeOutCubic. Decimals are preserved (4.5 keeps one place).
    const startCount = (c) => {
      if (!c.vals.length) return;
      cancelAnimationFrame(c.countRaf);
      for (const v of c.vals) v.el.textContent = (0).toFixed(v.dec); // zero immediately — no flash of the final number
      const dur = 1400;
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      let start = 0;
      const step = (ts) => {
        if (!start) start = ts;
        const e = ease(Math.min(1, (ts - start) / dur));
        for (const v of c.vals) v.el.textContent = (e * v.target).toFixed(v.dec);
        if (e < 1) c.countRaf = requestAnimationFrame(step);
      };
      c.countRaf = requestAnimationFrame(step);
    };
    const resetCount = (c) => {
      cancelAnimationFrame(c.countRaf);
      for (const v of c.vals) v.el.textContent = (0).toFixed(v.dec); // park at 0 so it replays on re-entry
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
        // Highlight #1 (the 25+yrs stat) reveals — as an automated, timed slide/fade — the moment
        // the white container is FULLY rendered (the band has finished growing out, --stats-out≈1),
        // rather than being shown from the start. Toggled via data-band-in; CSS does the rest.
        const bandIn = p >= 0.99;
        if (bandIn !== c.lastBandIn) {
          c.lastBandIn = bandIn;
          c.stats.toggleAttribute("data-band-in", bandIn);
          if (bandIn) startCount(c); else resetCount(c);
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
          // The wipe (content shifts up + bg recolours to cream) is now an AUTOMATED, timed reveal
          // instead of being scrubbed: --hl-rev flips 0→1 at the SAME starting point it used to
          // begin (the last timeline item's bottom rising to the band's bottom edge) and CSS
          // transitions it over its own duration (--hl-rev is a registered @property). Reverses on
          // scroll back up.
          const wipeOn = liBot - pinnedTop <= ah;
          const target = wipeOn ? 1 : 0;
          if (target !== c.lastHl) {
            c.lastHl = target;
            c.stats.style.setProperty("--hl-rev", String(target));
          }
          // The un-pin/freeze stays tied to SCROLL — the band's sticky range is one band-height of
          // scroll past the wipe start, so we release exactly as the sticky range ends (the original
          // scroll-based progress hitting 1). Decoupling this from the now-timed visual wipe would
          // let the band un-stick and scroll up before the freeze, then snap back — a visible jump.
          const hl = Math.min(Math.max(1 - (liBot - pinnedTop) / ah, 0), 1);
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
        // Mission reveal — now an AUTOMATED, timed reveal fired at a single breakpoint rather than
        // scrubbed by scroll: --mission-rev flips 0→1 the moment the scroll crosses the START of the
        // old effect (the timeline midpoint reaching REV_DELAY above the fold), and CSS transitions
        // it over its own duration (--mission-rev is a registered @property). The heading mask-rise
        // (data-settled) fires at the same breakpoint. Both reverse if you scroll back past it.
        if (c.timeline) {
          const lr = c.timeline.getBoundingClientRect();
          const mid = lr.top + lr.height / 2;
          const REV_DELAY = vh * 0.15; // hold a beat past the midpoint before it begins
          const REV_RANGE = vh * 0.15 || 1; // (still used to anchor the highlight-3 scroll target)
          const missionOn = (vh - mid - REV_DELAY) >= 0; // crossed the reveal breakpoint
          const mrev = missionOn ? 1 : 0;
          if (mrev !== c.lastRev) {
            c.lastRev = mrev;
            c.banner.style.setProperty("--mission-rev", String(mrev));
          }
          if (missionOn !== c.lastSettled) {
            c.lastSettled = missionOn;
            if (c.bmission) c.bmission.toggleAttribute("data-settled", missionOn);
          }
          // Highlight reveals, expressed as actual SCROLL positions so #2 lands exactly midway
          // between #1 and #3 (event triggers on different scales can't define a midpoint).
          //   y1 = scroll where the band pins (banner top reaches the header line).
          //   y3 = UNCHANGED — scroll where #3 fires: one milestone item past the mission
          //        appearing. Item k reveals when its rest-bottom rises 40px above the fold;
          //        the mission appears (--mission-rev==0.5) when the timeline midpoint hits its
          //        target — both solved to a scroll value from the current frame's geometry.
          //   y2 = (y1 + y3) / 2 — the exact midpoint.
          const HDRc = HDR;
          const bt = c.banner ? c.banner.getBoundingClientRect().top : HDRc;
          if (bt > HDRc + 0.5 || c.y1 < 0) c.y1 = window.scrollY + (bt - HDRc); // capture before it pins
          const revealY = (el) => window.scrollY + (lr.top + el.offsetTop + el.offsetHeight + 40 - vh);
          const midTarget = vh - REV_DELAY - 0.5 * REV_RANGE; // timeline-mid value when rev==0.5
          const yMission = window.scrollY + (mid - midTarget);
          let hlBase = 0;
          for (const el of c.items) if (revealY(el) <= yMission) hlBase++;
          const y3 = c.items[hlBase] ? Math.max(yMission, revealY(c.items[hlBase])) : yMission;
          const y2 = (c.y1 + y3) / 2;
          const sy = window.scrollY;
          let idx = 0;
          if (c.y1 >= 0 && sy >= y2) idx = 1;
          if (c.y1 >= 0 && sy >= y3) idx = 2;
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
      c.stats.removeAttribute("data-band-in");
      c.banner.style.removeProperty("--mission-rev");
      if (c.bmission) { c.bmission.removeAttribute("data-settled"); c.bmission.removeAttribute("data-rev-armed"); }
      for (const el of [c.banner, c.stats]) if (el) { el.style.position = ""; el.style.top = ""; el.style.marginTop = ""; }
      c.last = -1;
      c.lastRev = -1;
      c.lastHl = -1;
      c.lastUnpin = false;
      c.lastSettled = false;
      c.lastBandIn = false;
      cancelAnimationFrame(c.countRaf);
      for (const v of c.vals) v.el.textContent = v.dec ? v.target.toFixed(v.dec) : String(v.target); // restore final value
      c.hlIdx = -1;
      c.hlBase = -1;
      c.y1 = -1;
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
