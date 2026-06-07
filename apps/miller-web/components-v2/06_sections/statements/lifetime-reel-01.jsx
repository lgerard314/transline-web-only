"use client";
import { useEffect, useRef, useState } from "react";
import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { LifetimeReel } from "@/components-v2/05_widgets/lifetime-reel/lifetime-reel";
import { sectionProps } from "@/components-v2/section-config";

// L6 · lifetime-reel-01 — the home page's signature "money shot": a full-bleed
// deep-walnut band carrying THREE highlight diamonds joined by one continuous
// "growing line" of seal stroke + measured connector. Each diamond's numeral
// counts up in lockstep with its seal drawing closed; a longer reveal paragraph
// surfaces beneath once the chain has drawn.
//
// PINNED SCROLL SEQUENCE (desktop, motion-OK): the section is wrapped in a tall
// `.mw-lr-track` and made `position: sticky`, so it FREEZES the moment it fully
// fills the viewport. The choreography:
//
//   BACKGROUND MAP — keyed to the EYEBROW:
//     • Before the eyebrow is on screen the map is an invisible dot (scale 0).
//     • Once the eyebrow enters, the map grows from a dot anchored JUST BELOW the
//       eyebrow (transform-origin set to the eyebrow's underside) up to the body-
//       content width (scale 1 — the layer is capped at the content column, so it
//       never gets wider than the copy). Driven by the eyebrow rising to
//       EYE_FULL_FRAC of the viewport height.
//     • Once it reaches full width it stops growing and instead DRIFTS vertically —
//       the same vertical parallax we had before — driven by the pinned scroll so
//       it keeps moving while the section is frozen (reveals more of the map's
//       bottom on scroll down).
//   DIAMONDS — the chain starts drawing just after the diamond row's MIDLINE crosses
//     the bottom of the viewport (DIAMOND_LEAD px past that crossing), then scrubs the
//     draw over DRAW_VH viewport-heights of scroll (continuing through the pin), then
//     HOLDS settled until the track releases.
//
// Mobile and prefers-reduced-motion skip the pin entirely: the track collapses,
// the section flows normally, the map rests static at full content width, and the
// reel self-drives (mobile) or shows fully settled (reduced motion).
//
// Content keys consumed:
//   headingId   — id on the sr-only <h2>; referenced by aria-labelledby on <section>
//   srHeading   — visually-hidden section heading text
//   eyebrow     — mono eyebrow label (rendered inverted for the dark surface)
//   highlights  — [{ value:Number, suffix, unit, label, reveal }] — the three diamonds
// Config: scheme / token overrides via sectionProps.
const EYE_FULL_FRAC = 0.4; // eyebrow top at this fraction of viewport height = map fully grown
const PARALLAX_MAX = 90;   // px of vertical parallax drift once the map is full width
const DIAMOND_LEAD = 40;   // px past the diamond row's MIDLINE crossing the viewport bottom before the chain starts ("just after")
const DRAW_VH = 1.0;       // viewport-heights of scroll over which the chain draws

export function LifetimeReel01({ content, config = {} }) {
  const { headingId, srHeading, eyebrow, highlights } = content;
  const trackRef = useRef(null);
  const bgRef = useRef(null);
  const [reelP, setReelP] = useState(0);
  const [pinned, setPinned] = useState(false);

  // One rAF-coalesced reader maps the sticky track's travel to the master progress P,
  // then drives the background scale directly and hands the chain its slice via state.
  // Only active when the pin is live (wide viewport + motion OK) — matches the CSS
  // media query that supplies the track height + sticky behaviour.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mqWide = window.matchMedia("(min-width: 721px)");
    const mqRM = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canPin = () => mqWide.matches && !mqRM.matches;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const track = trackRef.current, bg = bgRef.current;
      if (!track) return;
      if (!canPin()) {
        setPinned(false);
        if (bg) {
          bg.style.removeProperty("--lr-bg-scale"); // fall back to the CSS default (full, static)
          bg.style.removeProperty("--lr-bg-drift");
          bg.style.removeProperty("transform-origin");
        }
        return;
      }
      setPinned(true);
      const vh = window.innerHeight || document.documentElement.clientHeight || 1;
      const topY = track.getBoundingClientRect().top;
      // BACKGROUND: grow from a dot below the eyebrow (once the eyebrow is on screen)
      // up to the content width, then drift vertically (parallax) once full.
      const sec = track.querySelector(".mw-lr");
      const eyebrow = track.querySelector(".mw-section-tag");
      let G = 0;
      if (bg && eyebrow && sec) {
        const eb = eyebrow.getBoundingClientRect();
        // 0 until the eyebrow's top crosses the viewport bottom; 1 when it has risen
        // to EYE_FULL_FRAC of the viewport height.
        G = Math.min(1, Math.max(0, (vh - eb.top) / (vh * (1 - EYE_FULL_FRAC))));
        // Anchor the growth just below the eyebrow (in the bg layer's own coords —
        // its box top tracks the section top).
        const secTop = sec.getBoundingClientRect().top;
        bg.style.transformOrigin = `center ${(eb.bottom - secTop + 6).toFixed(1)}px`;
        bg.style.setProperty("--lr-bg-scale", G.toFixed(4));
      }
      // Pinned scroll (track top 0 → -total) → 0..1; drives the parallax drift.
      const total = Math.max(1, track.offsetHeight - vh);
      const scrolled = Math.min(Math.max(-topY, 0), total);
      const P = scrolled / total;
      // Vertical parallax once the map is full width — driven by the pinned scroll so
      // it keeps drifting while the section is frozen (negative = reveal more bottom).
      if (bg) bg.style.setProperty("--lr-bg-drift", (G >= 1 ? -(PARALLAX_MAX * P) : 0).toFixed(1) + "px");
      // CHAIN: begin drawing once DIAMOND_LEAD px of space is visible below the diamond
      // row. `triggerTopY` is the track-top value at which (diamonds bottom + lead)
      // reaches the viewport bottom; the diamonds' offset within the section is stable
      // (fixed-height section, content centred), so this is robust before AND during
      // the pin. Driving by topY (which keeps moving through the pin) lets the draw
      // start late in the approach yet still scrub slowly after the section freezes.
      let reel = 0;
      const stage = track.querySelector(".mw-lr-reel__stage");
      if (stage && sec) {
        const sb = stage.getBoundingClientRect();
        const stageMidOff = (sb.top + sb.height / 2) - sec.getBoundingClientRect().top; // diamond row midline vs section top
        const triggerTopY = vh - DIAMOND_LEAD - stageMidOff;
        reel = Math.min(1, Math.max(0, (triggerTopY - topY) / (DRAW_VH * vh)));
      }
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
        {/* Faint Canada outline map wash. Once the eyebrow is on screen it grows
            from a dot below the eyebrow to the content width (--lr-bg-scale), then
            drifts vertically (--lr-bg-drift); unpinned it rests static at full
            content width. Decorative only. */}
        <div className="mw-lr__bg" ref={bgRef} aria-hidden="true" />
        <h2 id={headingId} className="tl-sr-only">{srHeading}</h2>
        <div className="mw-inner mw-lr__inner">
          <Eyebrow01 label={eyebrow} invert reveal />
          <LifetimeReel highlights={highlights} progress={pinned ? reelP : undefined} />
        </div>
      </section>
    </div>
  );
}
