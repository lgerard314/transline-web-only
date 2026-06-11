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

// Mission rise starts once the timeline top reaches the header line; then holds briefly before
// scrubbing up from the banner bottom over ~two mouse-wheel clicks of scroll.
const MISSION_PAUSE_PX = 90;
const MISSION_RANGE_PX = 220;
// Pinned-layout gate — the EXACT complement of history.css's single-column collapse
// query `(max-width: 1200px), (orientation: portrait)`. When this is false the section
// is the stacked flow layout and the same vars are written from flow-geometry
// contracts instead (counts complete when the stats band is fully on-screen; mission
// settles when its panel is fully on-screen). Portrait never pins (house rule).
const PIN_MQS = ["(min-width: 1201px)", "(orientation: landscape)"];
export function TimelineStats() {
  const pathname = usePathname();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pinMqs = PIN_MQS.map((q) => window.matchMedia(q));
    const pinned = () => pinMqs.every((m) => m.matches);
    let cols = [];
    let raf = 0;
    let attached = false;

    const collect = () => {
      cols = Array.from(document.querySelectorAll(".mw-ten3__col"))
        .map((col) => {
          const grid = col.closest(".mw-ten3__grid");
          return {
            stack: col.querySelector(".mw-ten3__stack"),
            banner: col.querySelector(".mw-ten3__banner"),
            // Flow surfaces show the mission in the flow-only sibling (the in-banner
            // bmission is display:none there) — that's the element the flow branch
            // measures and writes --mflow-rev onto.
            mission: col.querySelector(".mw-ten3__mission-flow"),
            stats: col.querySelector(".mw-ten3__aside"),
            timeline: grid ? grid.querySelector(".mw-ten3__line") : null,
            lastItem: grid ? ([...grid.querySelectorAll(".mw-ten3__item")].pop() || null) : null,
            vals: [...col.querySelectorAll(".mw-ten3__plate2-val")].map((el) => {
              const raw = el.getAttribute("data-val") || el.textContent || "0";
              return { el, target: parseFloat(raw) || 0, dec: (raw.split(".")[1] || "").length };
            }),
            last: -1,
            lastNum: -1,
            numTlStart: -1,
            lastMission: -1,
            missionGateY: -1,
            lastUnpin: false,
            tailFadeStartTop: -1,
            lastTailFade: -1,
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
      const redgePx = slope * hH;
      c.stats.style.setProperty("--stats-tinset", ang.toFixed(1) + "px");
      c.stats.style.setProperty("--stats-redge", redgePx.toFixed(1) + "px");
      const row = c.stats.querySelector(".mw-ten3__plate2-stats");
      if (row) {
        c.stats.style.setProperty("--stats-row-end", (row.offsetTop + row.offsetHeight) + "px");
      }
    };

    const render = () => {
      raf = 0;
      const vh = window.innerHeight || document.documentElement.clientHeight || 1;
      // FLOW (single-column / portrait): geometric contracts, no pin machinery.
      if (!pinned()) {
        for (const c of cols) {
          // Counts complete exactly when the stats band is fully on-screen
          // ((vh − top)/height is 1 at precisely bottom == vh); rows cascade on
          // per-row CSS slices of the same var. Reversible both ways.
          const sr = c.stats.getBoundingClientRect();
          const numRev = Math.min(Math.max((vh - sr.top) / Math.max(1, sr.height), 0), 1);
          if (Math.abs(numRev - c.lastNum) >= 0.001) {
            c.lastNum = numRev;
            c.stats.style.setProperty("--num-rev", numRev.toFixed(3));
            for (const v of c.vals) v.el.textContent = (numRev * v.target).toFixed(v.dec);
          }
          // Mission settles (rise + fade scrub in CSS) when its panel is fully on-screen.
          // Written as the UNREGISTERED --mflow-rev on the flow panel itself, so the CSS
          // fallback of 1 rests it for no-JS / reduced motion (the registered
          // --mission-rev would pin the fallback to its initial 0).
          if (c.mission) {
            const mr = c.mission.getBoundingClientRect();
            const missionRev = Math.min(Math.max((vh - mr.top) / Math.max(1, mr.height), 0), 1);
            if (Math.abs(missionRev - c.lastMission) >= 0.001) {
              c.lastMission = missionRev;
              c.mission.style.setProperty("--mflow-rev", missionRev.toFixed(3));
            }
          }
        }
        return;
      }
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
        // Highlight numbers scrub 0→target while the timeline rises; finish when its top hits the header.
        const tlTop = c.timeline ? c.timeline.getBoundingClientRect().top : Infinity;
        const tlAtHeader = c.timeline && tlTop <= HDR + 0.5;
        let numRev = 0;
        if (c.timeline && p > 0) {
          if (c.numTlStart < 0) c.numTlStart = tlTop;
          const span = c.numTlStart - HDR;
          numRev = span > 1
            ? Math.min(Math.max((c.numTlStart - tlTop) / span, 0), 1)
            : (tlAtHeader ? 1 : 0);
        } else {
          c.numTlStart = -1;
        }
        if (Math.abs(numRev - c.lastNum) >= 0.001) {
          c.lastNum = numRev;
          c.stats.style.setProperty("--num-rev", numRev.toFixed(3));
          for (const v of c.vals) v.el.textContent = (numRev * v.target).toFixed(v.dec);
        }
        // Mission overlay — starts once the timeline top reaches the header, then the same short
        // scroll hold + rise span as before (clip + translate in CSS).
        let missionRev = 0;
        if (!tlAtHeader) {
          c.missionGateY = -1;
        } else {
          if (c.missionGateY < 0) c.missionGateY = window.scrollY;
          missionRev = Math.min(Math.max((window.scrollY - c.missionGateY - MISSION_PAUSE_PX) / MISSION_RANGE_PX, 0), 1);
        }
        if (Math.abs(missionRev - c.lastMission) >= 0.001) {
          c.lastMission = missionRev;
          c.banner.style.setProperty("--mission-rev", missionRev.toFixed(3));
        }
        // Release the pinned stack once the last timeline item's bottom passes the highlights
        // caption line — mission + stats then scroll up together. Re-pins on scroll back up.
        if (c.lastItem && c.stack) {
          const labels = c.stats.querySelectorAll(".mw-ten3__plate2-label");
          let captionsBottom = 0;
          for (const el of labels) {
            captionsBottom = Math.max(captionsBottom, el.getBoundingClientRect().bottom);
          }
          if (!labels.length) {
            const row = c.stats.querySelector(".mw-ten3__plate2-stats");
            captionsBottom = row ? row.getBoundingClientRect().bottom : 0;
          }
          const lastBottom = c.lastItem.getBoundingClientRect().bottom;
          const unpin = lastBottom <= captionsBottom;
          if (unpin !== c.lastUnpin) {
            c.lastUnpin = unpin;
            const col = c.stack.parentElement;
            const colTop = col ? col.getBoundingClientRect().top : 0;
            if (unpin) {
              const stackTop = c.stack.getBoundingClientRect().top - colTop;
              c.stack.style.marginTop = "0px";
              c.stack.style.top = Math.round(stackTop) + "px";
              c.stack.style.left = "0";
              c.stack.style.width = "100%";
              c.stack.style.position = "absolute";
              c.stack.style.zIndex = "2";
              c.stack.dataset.unpinned = "1";
              c.tailFadeStartTop = c.stats.getBoundingClientRect().top;
            } else {
              c.stack.style.position = "";
              c.stack.style.top = "";
              c.stack.style.left = "";
              c.stack.style.width = "";
              c.stack.style.marginTop = "";
              c.stack.style.zIndex = "";
              delete c.stack.dataset.unpinned;
              c.tailFadeStartTop = -1;
              c.lastTailFade = -1;
              c.stats.style.removeProperty("--stats-tail-fade");
            }
          }
          // Tail runway fades bottom-up in step with the highlights climbing to the header line.
          if (c.lastUnpin) {
            const asideTop = c.stats.getBoundingClientRect().top;
            const span = c.tailFadeStartTop - HDR;
            const tailFade = span > 1
              ? Math.min(Math.max((c.tailFadeStartTop - asideTop) / span, 0), 1)
              : (asideTop <= HDR ? 1 : 0);
            if (Math.abs(tailFade - c.lastTailFade) >= 0.001) {
              c.lastTailFade = tailFade;
              c.stats.style.setProperty("--stats-tail-fade", tailFade.toFixed(3));
            }
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
      c.stats.style.removeProperty("--num-rev");
      c.stats.style.removeProperty("--stats-tinset");
      c.stats.style.removeProperty("--stats-redge");
      c.stats.style.removeProperty("--stats-row-end");
      c.stats.style.removeProperty("--stats-tail-fade");
      c.banner.style.removeProperty("--mission-rev");
      if (c.mission) c.mission.style.removeProperty("--mflow-rev");
      if (c.stack) {
        c.stack.style.position = "";
        c.stack.style.top = "";
        c.stack.style.left = "";
        c.stack.style.width = "";
        c.stack.style.marginTop = "";
        c.stack.style.zIndex = "";
        delete c.stack.dataset.unpinned;
      }
      c.last = -1;
      c.lastNum = -1;
      c.numTlStart = -1;
      c.lastMission = -1;
      c.missionGateY = -1;
      c.lastUnpin = false;
      c.tailFadeStartTop = -1;
      c.lastTailFade = -1;
      for (const v of c.vals) v.el.textContent = v.dec ? v.target.toFixed(v.dec) : String(v.target);
    });

    const enable = () => {
      if (attached) return;
      collect();
      if (!cols.length) return;
      attached = true;
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
    // Pin↔flow flips (rotation, window resize across 1200px) must drop the other
    // mode's leftovers — the pinned branch writes inline styles (frozen stack) and
    // vars the flow branch never manages, and vice versa.
    const onModeChange = () => { if (attached) { clear(); collect(); onScroll(); } };

    const t1 = setTimeout(sync, 60);
    const onLoad = () => { if (attached) { collect(); onScroll(); } else sync(); };
    window.addEventListener("load", onLoad);
    mq.addEventListener("change", sync);
    pinMqs.forEach((m) => m.addEventListener("change", onModeChange));

    return () => {
      clearTimeout(t1);
      window.removeEventListener("load", onLoad);
      mq.removeEventListener("change", sync);
      pinMqs.forEach((m) => m.removeEventListener("change", onModeChange));
      disable();
    };
  }, [pathname]);

  return null;
}
