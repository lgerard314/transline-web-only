"use client";
import { useEffect, useRef, useState } from "react";
import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { LifetimeReel } from "@/components-v2/05_widgets/lifetime-reel/lifetime-reel";
import { sectionProps } from "@/components-v2/section-config";

// L6 · lifetime-reel-01 — the home page's signature "money shot": THREE highlight
// diamonds joined by one continuous "growing line", over a warm surface.
//
// PINNED SCROLL SEQUENCE (desktop, motion-OK): the section is wrapped in a tall
// `.mw-lr-track` and made `position: sticky`, so it FREEZES the moment it fully
// fills the viewport. The pinned scroll (P = 0 → 1) drives the choreography:
//
//   EXPANDING PANEL (approach → pin):
//     The dark walnut box that holds the background map is a RECTANGLE, TOP-ALIGNED just
//     BELOW the sticky header, square corners, map fully OPAQUE. It begins growing — and
//     the map begins fading to the faint wash — once the box is vertically CENTERED in the
//     viewport (its centre at vh/2), and grows (width faster than height)
//     to its FINAL band — spanning from below the header to the bottom of the screen,
//     full-bleed — exactly when the section pins. The GRAPHIC stays fitted (whole map)
//     while it can and grows SLOWER than the box; its FINAL width is the body-content
//     width (cover-cropping vertically once too tall). Once the graphic is at content
//     width, a vertical PARALLAX drifts it on further scroll. The content (eyebrow +
//     diamonds) fades in as the box nears full.
//   DIAMONDS (SCROLL-SCRUBBED): once pinned, the pinned scroll [0, DRAW_END] draws the
//     diamond/line chain + gradient build + count-ups (fed to the reel as `progress`);
//     each numeral counts in lockstep with its own diamond, then a HOLD [DRAW_END, 1].
//
// AUTO-SCROLL (careers-style, see zoom-collage-01): the WHOLE effect above — box
// expansion AND the chain gradient build — is one continuous scroll effect, but a rAF
// loop AUTO-ADVANCES the page (window.scrollBy) so it plays itself with an animation
// feel. It is active from the moment the box starts expanding (panelT > 0) until the
// last diamond is rendered (reel == 1), paced over AUTO_MS. The user can scroll FASTER
// to speed it up (a wheel/touch pauses the auto-nudge for USER_IDLE_MS so their input
// wins); scrolling UP hands control fully back (cancels until they leave the start) AND
// the reverse is AMPLIFIED REVERSE_SPEED× — each up-pixel becomes REVERSE_SPEED px while
// there is still reveal to undo — so the effect rewinds twice as fast on the way up only
// (down scroll is never amplified). After the last diamond renders the auto-scroll stops —
// the HOLD + exit are manual (the bg keeps zooming / parallaxing on scroll; hover then
// takes over a diamond).
//
// Mobile and prefers-reduced-motion skip the pin + auto-scroll entirely: the track
// collapses, the panel rests full (symmetric padding), the section flows normally, and
// the reel self-drives (mobile) or shows fully settled (reduced motion).
//
// Content keys consumed:
//   headingId   — id on the sr-only <h2>; referenced by aria-labelledby on <section>
//   srHeading   — visually-hidden section heading text
//   eyebrow     — mono eyebrow label (rendered inverted for the dark surface)
//   highlights  — [{ value:Number, suffix, unit, label, reveal }] — the three diamonds
// Config: scheme / token overrides via sectionProps.
const MAP_ASPECT = 720 / 612; // bg graphic (canada-bg-line-map.svg) intrinsic aspect ≈ 1.176 — the graphic always fits this
const PANEL_H_START = 0.34;   // starting box height as a fraction of the final band height
const DRAW_END = 0.7;         // fraction of the pinned scroll over which the chain draws (then a HOLD to 1)
const AUTO_MS = 3600;         // auto-scroll pace: traverse the whole expand+draw span in roughly this long
const USER_IDLE_MS = 160;     // pause the auto-nudge for this long after a wheel/touch so the user's scroll wins
const REVERSE_SPEED = 2;      // scroll-UP only: amplify the user's upward scroll by this factor (each up-pixel becomes REVERSE_SPEED px) so the reverse plays this many × faster. Down scroll is untouched.
const BG_OPACITY_FULL = 0.07; // map opacity once fully grown (the faint wash); it starts fully opaque (1)
const PARALLAX_MAX = 90;      // px of vertical parallax drift on the graphic once the section is full
const ZOOM_MAX = 1.4;        // how far the graphic zooms in (scales past its fit) once the section is full

export function LifetimeReel01({ content, config = {} }) {
  const { headingId, srHeading, eyebrow, highlights } = content;
  const trackRef = useRef(null);
  const panelRef = useRef(null);
  const innerRef = useRef(null);
  const [reelP, setReelP] = useState(0);
  const [pinned, setPinned] = useState(false);

  // ONE continuous rAF loop (careers-style, see zoom-collage-01) drives the WHOLE
  // choreography from scroll position — the box expansion AND the diamond/line/number
  // gradient build are both scroll-scrubbed. On top of that it AUTO-SCROLLS: while the
  // effect is active and the user isn't actively scrolling, it nudges window.scrollBy
  // each frame so the reveal plays itself at AUTO_MS pace. The user can scroll faster to
  // speed it up (a wheel/touch pauses the nudge for USER_IDLE_MS so their scroll wins);
  // scrolling UP cancels the auto-scroll (hand control back) until they leave the start.
  // Only active when the pin is live (wide viewport + motion OK); mobile/reduced-motion
  // clears the inline geometry and the reel self-drives.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const track = trackRef.current, panel = panelRef.current, inner = innerRef.current;
    if (!track) return;
    const mqWide = window.matchMedia("(min-width: 721px)");
    const mqRM = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canPin = () => mqWide.matches && !mqRM.matches;

    let raf = 0, running = false, inView = false;
    let lastTs = 0, lastY = window.scrollY, cancelled = false, lastUserTs = -1e9;
    let pinnedState = false, reelState = 0;
    const setPin = (v) => { if (v !== pinnedState) { pinnedState = v; setPinned(v); } };
    const setReel = (v) => { if (v !== reelState) { reelState = v; setReelP(v); } };

    const clearReduced = () => {
      setPin(false);
      if (panel) ["--lr-panel-top", "--lr-panel-w", "--lr-panel-h", "--lr-map-w", "--lr-map-h", "--lr-zoom", "--lr-bg-drift", "--lr-bg-opacity"].forEach((p) => panel.style.removeProperty(p));
      if (inner) inner.style.removeProperty("--lr-content-in");
    };

    // Read scroll position → set the panel geometry + reel progress for this frame.
    // Returns the metrics the auto-scroll decision needs. Pure scroll-scrubbed: scrolling
    // up reverses it, exactly like the careers dive.
    const measure = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight || 1;
      const topY = track.getBoundingClientRect().top;
      const pinTotal = Math.max(1, track.offsetHeight - vh);
      const P = Math.min(1, Math.max(0, -topY / pinTotal)); // 0 across the approach; 0 → 1 across the pin
      setPin(true);

      // PANEL: a RECTANGLE that grows (top-aligned below the header) from a small box to the
      // full band — width faster than height. Growth begins once the box is vertically
      // CENTERED in the viewport (centre at vh/2 → topY == vh/2 - headerH - hSmall/2) and
      // completes as the section pins. The GRAPHIC fits ENTIRELY inside (contain) with
      // padding, capped at the body-content width, so it grows slower than the box; its
      // opacity fades 1 → faint wash across the growth.
      const header = document.querySelector(".tl-topbar");
      const headerH = header ? Math.round(header.getBoundingClientRect().height) : 0;
      const vw = window.innerWidth || vh;
      const hFull = Math.max(1, vh - headerH);
      const hSmall = PANEL_H_START * hFull;
      const triggerTop = Math.max(1, vh / 2 - headerH - hSmall / 2); // section-top y where the box centre sits at vh/2
      const panelT = Math.min(1, Math.max(0, (triggerTop - topY) / triggerTop));
      if (panel) {
        panel.style.setProperty("--lr-panel-top", headerH + "px");
        const pad0 = Math.min(34, Math.max(18, 0.022 * vw));
        const contentMax = Math.min(vw - Math.min(144, Math.max(48, 0.08 * vw)), 1560);
        const wFull = vw;
        const boxW = (hSmall * MAP_ASPECT) + (wFull - hSmall * MAP_ASPECT) * panelT;
        const boxH = hSmall + (hFull - hSmall) * panelT;
        panel.style.setProperty("--lr-panel-w", ((boxW / wFull) * 100).toFixed(2) + "%");
        panel.style.setProperty("--lr-panel-h", boxH.toFixed(1) + "px");
        const pad = pad0 * (1 - panelT);
        const availW = Math.max(0, boxW - 2 * pad);
        const availH = Math.max(0, boxH - 2 * pad);
        let mapW = (availW / availH > MAP_ASPECT) ? availH * MAP_ASPECT : availW;
        mapW = Math.min(mapW, contentMax);
        panel.style.setProperty("--lr-map-w", mapW.toFixed(1) + "px");
        panel.style.setProperty("--lr-map-h", (mapW / MAP_ASPECT).toFixed(1) + "px");
        panel.style.setProperty("--lr-zoom", (1 + (ZOOM_MAX - 1) * P).toFixed(3));
        panel.style.setProperty("--lr-bg-drift", (-(PARALLAX_MAX * P)).toFixed(1) + "px");
        panel.style.setProperty("--lr-bg-opacity", (1 - (1 - BG_OPACITY_FULL) * panelT).toFixed(3));
        if (inner) inner.style.setProperty("--lr-content-in", Math.min(1, Math.max(0, (panelT - 0.6) / 0.4)).toFixed(3));
      }

      // CHAIN: scroll-scrubbed — draws over the pinned scroll [0, DRAW_END], then HOLDs to 1.
      const reel = Math.min(1, Math.max(0, P / DRAW_END));
      setReel(reel);

      return { topY, panelT, reel, triggerTop, pinTotal };
    };

    const onUserScroll = (e) => { lastUserTs = e.timeStamp; };

    const loop = (ts) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      const dt = lastTs ? Math.min(50, ts - lastTs) : 16.7; // clamp big gaps (tab switches)
      lastTs = ts;

      const { topY, panelT, reel, triggerTop, pinTotal } = measure();

      // AUTO-SCROLL: active from the moment the box starts expanding (panelT > 0) until the
      // last diamond is rendered (reel == 1). Pace the whole expand+draw span over AUTO_MS.
      const span = triggerTop + DRAW_END * pinTotal; // approach px + draw px
      const active = panelT > 0 && reel < 1;
      const userActive = ts - lastUserTs < USER_IDLE_MS;
      const y = window.scrollY;
      if (topY >= triggerTop) cancelled = false;               // re-arm once scrolled back above the start
      if (!cancelled && active && y < lastY - 1) cancelled = true; // scroll UP → hand control back
      if (active && !cancelled && !userActive) {
        window.scrollBy({ top: (span / AUTO_MS) * dt, behavior: "instant" });
      } else {
        // REVERSE AMPLIFY (scroll-up only): while there is still reveal to undo (the box is
        // expanded and/or the chain is drawn), every pixel the user scrolls UP this frame gets
        // an extra (REVERSE_SPEED-1) px upward, so the reverse plays REVERSE_SPEED× faster.
        // Down scroll is never amplified (movedUp ≤ 0). Skipped during the down auto-nudge.
        const movedUp = lastY - y; // > 0 when the user scrolled up since last frame
        const reverseZone = reel > 0 || panelT > 0;
        if (movedUp > 0 && reverseZone) {
          window.scrollBy({ top: -movedUp * (REVERSE_SPEED - 1), behavior: "instant" });
        }
      }
      lastY = window.scrollY;
    };

    const startLoop = () => { if (running) return; running = true; lastTs = 0; lastY = window.scrollY; raf = requestAnimationFrame(loop); };
    const stopLoop = () => { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; };
    const evaluate = () => {
      if (!canPin()) { stopLoop(); clearReduced(); return; }
      if (inView) startLoop();
      else { stopLoop(); measure(); } // off-screen: set the at-rest frame once, no loop / no auto-scroll
    };

    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; evaluate(); }, { threshold: 0 });
    io.observe(track);
    window.addEventListener("wheel", onUserScroll, { passive: true });
    window.addEventListener("touchmove", onUserScroll, { passive: true });
    mqWide.addEventListener("change", evaluate);
    mqRM.addEventListener("change", evaluate);
    evaluate();
    return () => {
      io.disconnect();
      stopLoop();
      window.removeEventListener("wheel", onUserScroll);
      window.removeEventListener("touchmove", onUserScroll);
      mqWide.removeEventListener("change", evaluate);
      mqRM.removeEventListener("change", evaluate);
    };
  }, []);

  return (
    <div className="mw-lr-track" ref={trackRef}>
      <section className="mw-lr" aria-labelledby={headingId} {...sectionProps(config)}>
        {/* Expanding panel: the dark walnut box that holds the bg map. It starts as a
            small square-cornered box (top-aligned below the header) and grows (width +
            height) to the final band — below the header to the screen bottom, full-bleed —
            as the section pins (--lr-panel-top / --lr-panel-w / --lr-panel-h, set in JS). */}
        <div className="mw-lr__panel" ref={panelRef} aria-hidden="true">
          {/* Faint Canada outline map — whole map while it fits, then content-width
              (cover) with a vertical parallax drift once full. */}
          <div className="mw-lr__bg" />
        </div>
        <h2 id={headingId} className="tl-sr-only">{srHeading}</h2>
        <div className="mw-inner mw-lr__inner" ref={innerRef}>
          <Eyebrow01 label={eyebrow} invert reveal />
          <LifetimeReel highlights={highlights} progress={pinned ? reelP : undefined} />
        </div>
      </section>
    </div>
  );
}
