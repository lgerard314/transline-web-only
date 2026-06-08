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
//     the map begins fading to the faint wash — once the box sits as far from the screen
//     bottom as it is tall (gap-below == box height), and grows (width faster than height)
//     to its FINAL band — spanning from below the header to the bottom of the screen,
//     full-bleed — exactly when the section pins. The GRAPHIC stays fitted (whole map)
//     while it can and grows SLOWER than the box; its FINAL width is the body-content
//     width (cover-cropping vertically once too tall). Once the graphic is at content
//     width, a vertical PARALLAX drifts it on further scroll. The content (eyebrow +
//     diamonds) fades in as the box nears full.
//   DIAMONDS (P: 0 → DRAW_END):
//     Once pinned (box full), the diamond/line chain draws (fed to the reel as
//     `progress`); each numeral counts up in lockstep with its own diamond.
//   HOLD (P: DRAW_END → 1):
//     Everything stays settled; after a brief grace (handled in the widget) hover takes
//     over the active diamond.
//
// Mobile and prefers-reduced-motion skip the pin entirely: the track collapses, the
// panel rests full (symmetric padding), the section flows normally, and the reel
// self-drives (mobile) or shows fully settled (reduced motion).
//
// Content keys consumed:
//   headingId   — id on the sr-only <h2>; referenced by aria-labelledby on <section>
//   srHeading   — visually-hidden section heading text
//   eyebrow     — mono eyebrow label (rendered inverted for the dark surface)
//   highlights  — [{ value:Number, suffix, unit, label, reveal }] — the three diamonds
// Config: scheme / token overrides via sectionProps.
const MAP_ASPECT = 720 / 612; // bg graphic (canada-bg-line-map.svg) intrinsic aspect ≈ 1.176 — the graphic always fits this
const PANEL_H_START = 0.34;   // starting box height as a fraction of the final band height
const DRAW_END = 0.7;         // fraction of the pinned scroll by which the chain finishes (then a hold to 1)
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

  // One rAF-coalesced reader maps the sticky track's travel to the pinned progress P,
  // then drives the panel expansion + content fade directly and hands the chain its
  // slice via state. Only active when the pin is live (wide viewport + motion OK) —
  // matches the CSS media query that supplies the track height + sticky behaviour.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mqWide = window.matchMedia("(min-width: 721px)");
    const mqRM = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canPin = () => mqWide.matches && !mqRM.matches;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const track = trackRef.current, panel = panelRef.current, inner = innerRef.current;
      if (!track) return;
      if (!canPin()) {
        setPinned(false);
        if (panel) { panel.style.removeProperty("--lr-panel-top"); panel.style.removeProperty("--lr-panel-w"); panel.style.removeProperty("--lr-panel-h"); panel.style.removeProperty("--lr-map-w"); panel.style.removeProperty("--lr-map-h"); panel.style.removeProperty("--lr-zoom"); panel.style.removeProperty("--lr-bg-drift"); panel.style.removeProperty("--lr-bg-opacity"); }
        if (inner) inner.style.removeProperty("--lr-content-in");
        return;
      }
      setPinned(true);
      const vh = window.innerHeight || document.documentElement.clientHeight || 1;
      const topY = track.getBoundingClientRect().top;
      const total = Math.max(1, track.offsetHeight - vh);
      const scrolled = Math.min(Math.max(-topY, 0), total);
      const P = scrolled / total; // 0 across the approach; 0 → 1 across the pin

      // PANEL: a RECTANGLE that grows (top-aligned at the top padding) from a small box to
      // the full band — width grows faster than height, so it is NOT a square. Growth begins
      // once the box sits as far from the screen bottom as it is tall (gap-below == box
      // height) and completes as the section pins (so it never overflows). The GRAPHIC fits
      // ENTIRELY inside (contain) with padding, capped at the body-content width — so as the
      // box widens faster than it grows tall, the (height-limited) map grows SLOWER than the
      // box. The map opacity fades from 1 to the faint wash across the growth.
      if (panel) {
        const header = document.querySelector(".tl-topbar");
        const headerH = header ? Math.round(header.getBoundingClientRect().height) : 0; // sticky nav height
        panel.style.setProperty("--lr-panel-top", headerH + "px"); // band starts just BELOW the header
        const vw = window.innerWidth || vh;
        const pad0 = Math.min(34, Math.max(18, 0.022 * vw)); // padding around the graphic
        const contentMax = Math.min(vw - Math.min(144, Math.max(48, 0.08 * vw)), 1560); // body-content width
        const hFull = Math.max(1, vh - headerH); // final band height: below the header → screen bottom
        const wFull = vw;                         // final band width (full-bleed)
        const hSmall = PANEL_H_START * hFull;
        const triggerTop = Math.max(1, vh - headerH - 2 * hSmall); // section-top y where gap-below == box height
        const panelT = Math.min(1, Math.max(0, (triggerTop - topY) / triggerTop));

        // BOX: morph from a small (map-aspect) box to the full band — width outpaces height.
        const boxW = (hSmall * MAP_ASPECT) + (wFull - hSmall * MAP_ASPECT) * panelT;
        const boxH = hSmall + (hFull - hSmall) * panelT;
        panel.style.setProperty("--lr-panel-w", ((boxW / wFull) * 100).toFixed(2) + "%");
        panel.style.setProperty("--lr-panel-h", boxH.toFixed(1) + "px");

        // GRAPHIC: the WHOLE map fits inside the box (CONTAIN — never cut off), preserving its
        // aspect, capped at the body-content width. The box is wider than the map, so the map is
        // height-limited → more space on the left/right than top/bottom. Padding fades to 0 by
        // full size (no top/bottom padding when full).
        const pad = pad0 * (1 - panelT);
        const availW = Math.max(0, boxW - 2 * pad);
        const availH = Math.max(0, boxH - 2 * pad);
        let mapW = (availW / availH > MAP_ASPECT) ? availH * MAP_ASPECT : availW;
        mapW = Math.min(mapW, contentMax);
        const mapH = mapW / MAP_ASPECT;
        panel.style.setProperty("--lr-map-w", mapW.toFixed(1) + "px");
        panel.style.setProperty("--lr-map-h", mapH.toFixed(1) + "px");

        // ZOOM + PARALLAX: the graphic stays FULLY VISIBLE (contain, above) the whole time the
        // section is growing — reaching its fit limit (content width in portrait / screen height
        // in landscape) exactly as the section fills. Once the section is full (pinned, P>0) it
        // keeps going: --lr-zoom scales the map up past its fit (cropping at the box edge) and
        // --lr-bg-drift drifts it vertically (parallax).
        panel.style.setProperty("--lr-zoom", (1 + (ZOOM_MAX - 1) * P).toFixed(3));
        panel.style.setProperty("--lr-bg-drift", (-(PARALLAX_MAX * P)).toFixed(1) + "px");

        panel.style.setProperty("--lr-bg-opacity", (1 - (1 - BG_OPACITY_FULL) * panelT).toFixed(3)); // 1 → faint wash
        if (inner) inner.style.setProperty("--lr-content-in", Math.min(1, Math.max(0, (panelT - 0.6) / 0.4)).toFixed(3));
      }
      // CHAIN: draws over the pinned scroll [0, DRAW_END], then holds settled to 1.
      const reel = Math.min(1, Math.max(0, P / DRAW_END));
      setReelP(reel);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    mqWide.addEventListener("change", onScroll);
    mqRM.addEventListener("change", onScroll);
    compute();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mqWide.removeEventListener("change", onScroll);
      mqRM.removeEventListener("change", onScroll);
      if (raf) cancelAnimationFrame(raf);
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
