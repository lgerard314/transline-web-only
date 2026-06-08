"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
import { FigureStat01 } from "@/components-v2/04_blocks/stats/figure-stat-01";
import { ImageAccordion01 } from "@/components-v2/05_widgets/galleries/image-accordion-01";
import { sectionProps } from "@/components-v2/section-config";

// MediaSplit01 — the home VBEC (facility) section. A 40/60 split on a section whose DEFAULT
// background is dark walnut (--c-navy), continuous with the LifetimeReel above. Two phases:
//
// ENTRANCE (brown → beige fill, as the section scrolls in to fill the viewport):
//   LEFT  — a CREAM intro panel that slides DOWN into place. Its start is DELAYED until the
//           section has revealed an amount equal to its top padding (then it slides to rest and
//           stays PINNED — it does not reverse).
//   RIGHT — the photo gallery (LOCKED ratio) rising UP from below the screen, on a cream column.
//   By pin-in the brown is fully erased.
//
// PINNED SEQUENCE (once the section fills the viewport; driven by pin progress P):
//   1. HIGHLIGHTS — the 3-figure band GROWS out from under the photos (no container).
//   2. SWIPE — a beat later the MEDIA (photos + highlights) slides RIGHT off the screen and the
//      capabilities "diamond of diamonds" ROLLS in (left→right) in its wake.
//
// Mobile / reduced-motion: no pin, beige section, columns at rest. Styling: app/styles/04-home.css.
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = (x) => 1 - Math.pow(1 - x, 3);            // easeOutCubic

// Pin-sequence breakpoints (fractions of the pin progress P).
const FIG_END = 0.3;        // highlights fully out by P = FIG_END
const SWIPE_START = 0.4;    // the swipe begins a beat after the highlights settle
const SWIPE_END = 0.9;      // …and completes (photos fully off-screen, diamonds in) by here
const CAP_RAMP = 0.42;      // per-diamond roll-in duration (fraction of the photo sweep)
const CAP_LEAD = 0.06;      // each diamond starts rolling a touch BEFORE the photo edge clears it
const CAP_ROT = 150;        // deg each diamond spins through as it rolls in (settles to 0)

// Capabilities "diamond of diamonds" — 8 diamonds on the who-we-serve argyle lattice (6×6 cells,
// each diamond a 2×2 box; (col+row) even keeps them on the lattice). A TITLE diamond crowns the
// top; 7 capability diamonds ring an EMPTY centre.
const CAP_COLS = 6, CAP_ROWS = 6;
const CAP_SX = 100 / CAP_COLS, CAP_SY = 100 / CAP_ROWS;
const CAP_SLOTS = [
  { col: 1, row: 1 }, { col: 3, row: 1 },
  { col: 0, row: 2 }, { col: 4, row: 2 },
  { col: 1, row: 3 }, { col: 3, row: 3 },
  { col: 2, row: 4 },
];
const CAP_TONES = ["#B5642F", "#B5642F", "#A85A2C", "#A85A2C", "#8C4A24", "#8C4A24", "#75401F"];
// Each diamond's horizontal CENTRE as a fraction of the grid width (DOM order: title, then 7).
const CAP_FX = [0.5, ...CAP_SLOTS.map((s) => (s.col + 1) / CAP_COLS)];
const capDiaStyle = (col, row, extra) => ({ left: `${col * CAP_SX}%`, top: `${row * CAP_SY}%`, width: `${2 * CAP_SX}%`, ...extra });
const capSoftWrap = (s) => s.replace(/([/-])/g, "$1" + String.fromCharCode(0x200b));

export function MediaSplit01({ content, config = {} }) {
  const { eyebrow, stage, title, lead, figures, capsTitle, capabilities, primaryCta, aboutLink, headingId, photos } = content;
  const trackRef = useRef(null);
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const mediaRef = useRef(null);
  const figsRef = useRef(null);
  const capsRef = useRef(null);

  // One rAF-coalesced reader. ENTRANCE (E) fills the brown; the PIN sequence (P) grows the
  // highlights then swipes the media right to reveal the diamonds. Active only when the pin is
  // live (wide viewport + motion OK); otherwise everything rests static (beige).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mqWide = window.matchMedia("(min-width: 901px)");
    const mqRM = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canPin = () => mqWide.matches && !mqRM.matches;
    let raf = 0;

    const render = () => {
      const track = trackRef.current, section = sectionRef.current;
      const left = leftRef.current, right = rightRef.current;
      const media = mediaRef.current, figs = figsRef.current, caps = capsRef.current;
      if (!track || !section || !left || !right || !media || !figs || !caps) return;
      if (!canPin()) {
        left.style.removeProperty("--fac2-left-y");
        right.style.removeProperty("--fac2-right-y");
        media.style.removeProperty("--fac2-media-x");
        caps.style.removeProperty("--fac2-cap-y");
        if (figs.parentElement) figs.parentElement.style.removeProperty("--fac2-fig-h");
        track.style.removeProperty("--fac2-head-off");
        const g = caps.querySelector(".mw-cap-dia");
        if (g) g.querySelectorAll(".mw-cap-dia__cell").forEach((c) => { c.style.removeProperty("--cap-sc"); c.style.removeProperty("--cap-op"); c.style.removeProperty("--cap-tx"); c.style.removeProperty("--cap-rot"); });
        return;
      }
      // Pin immediately BELOW the fixed header (read it live — it collapses on scroll).
      const header = document.querySelector(".tl-topbar");
      const headOff = header ? Math.round(header.getBoundingClientRect().bottom) : 115;
      track.style.setProperty("--fac2-head-off", headOff + "px");

      const vh = window.innerHeight || document.documentElement.clientHeight || 1;
      const vw = window.innerWidth || document.documentElement.clientWidth || 1;
      const secTop = section.getBoundingClientRect().top;   // sticky-resolved top
      const trackTop = track.getBoundingClientRect().top;
      const span = Math.max(1, vh - headOff);

      // ENTRANCE E: 0 when the section top is at the screen bottom → 1 at pin-in (fills viewport).
      const E = clamp01((vh - secTop) / span);
      // PIN P: 0 at pin-in → 1 at release.
      const total = Math.max(1, track.offsetHeight - vh + headOff);
      const P = clamp01((headOff - trackTop) / total);

      // LEFT — begins sliding DOWN at the SAME moment as the right (both start at E=0), but it
      // FILLS SLOWER so a brown strip (≈ the top padding at its widest) trails below it as it
      // expands; the lag closes by pin-in. Then it pins (no reverse).
      const padTop = Math.max(64, Math.min(112, 0.065 * vw));
      const eStart = padTop / span;
      const eLeft = clamp01(E - eStart * Math.sin(Math.PI * E));
      const coverL = left.offsetHeight || span;
      left.style.setProperty("--fac2-left-y", (-(1 - eLeft) * coverL).toFixed(1) + "px");

      // RIGHT — the cream column RISES UP from below the screen, so the DEFAULT brown section bg
      // stays visible ABOVE it as it comes up (a complementary fill to the left: top-left cream
      // while the left drops in, top-right brown while the right rises). Both transforms begin at
      // E=0. Stays put on the pin.
      const coverR = right.offsetHeight || span;
      right.style.setProperty("--fac2-right-y", ((1 - E) * coverR).toFixed(1) + "px");

      // PIN 1 — HIGHLIGHTS grow out from under the photos: the figclip GROWS from 0 → the figs'
      // natural height (no reserved space), so they push out from the photos' bottom.
      const figIn = ease(clamp01(P / FIG_END));
      const figclip = figs.parentElement;
      if (figclip) figclip.style.setProperty("--fac2-fig-h", (figs.offsetHeight * figIn).toFixed(1) + "px");

      // PIN 2 — SWIPE the media (photos + highlights) RIGHT off the screen; the diamond grid
      // (parked centred BEHIND, z-index 1) rolls in left→right in its wake.
      const sweep = clamp01((P - SWIPE_START) / Math.max(0.001, SWIPE_END - SWIPE_START));
      const rightRect = right.getBoundingClientRect();
      const rightTop = rightRect.top, mediaLeft = rightRect.left;
      const exitDist = vw - mediaLeft + 28;             // travel to clear the screen's right edge
      media.style.setProperty("--fac2-media-x", (sweep * exitDist).toFixed(1) + "px");

      // Park the diamond grid at its vertically-CENTRED home (aligned to the left intro's middle).
      const intro = section.querySelector(".mw-fac2__intro");
      const capsH = caps.offsetHeight;
      const introRect = intro ? intro.getBoundingClientRect() : null;
      const leftCenter = introRect ? (introRect.top + introRect.height / 2) : (vh / 2);
      caps.style.setProperty("--fac2-cap-y", ((leftCenter - rightTop) - capsH / 2).toFixed(1) + "px");

      // Roll each diamond in as the media's left edge clears it (left→right cascade).
      const grid = caps.querySelector(".mw-cap-dia");
      if (grid) {
        const gridRect = grid.getBoundingClientRect();   // not X-transformed → stable
        const cells = grid.querySelectorAll(".mw-cap-dia__cell");
        for (let i = 0; i < cells.length; i++) {
          const fx = CAP_FX[i] != null ? CAP_FX[i] : 0.5;
          const dcx = gridRect.left + fx * gridRect.width;
          const uncover = clamp01((dcx - mediaLeft) / exitDist);
          const dl = clamp01((sweep - uncover + CAP_LEAD) / CAP_RAMP);
          const e = ease(dl);
          cells[i].style.setProperty("--cap-sc", (0.12 + 0.88 * e).toFixed(3));
          cells[i].style.setProperty("--cap-rot", ((1 - e) * CAP_ROT).toFixed(1) + "deg");
          cells[i].style.setProperty("--cap-tx", ((1 - e) * 48).toFixed(1) + "px");
          cells[i].style.setProperty("--cap-op", clamp01(dl * 2.2).toFixed(3));
        }
      }
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; render(); }); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    mqWide.addEventListener("change", onScroll);
    mqRM.addEventListener("change", onScroll);
    render();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mqWide.removeEventListener("change", onScroll);
      mqRM.removeEventListener("change", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="mw-fac2-track" ref={trackRef}>
      <section className="mw-fac2" aria-labelledby={headingId} ref={sectionRef} {...sectionProps(config)}>
        <div className="mw-inner">
          <div className="mw-fac2__grid">
            {/* LEFT — the cream intro panel. Slides DOWN into place (delayed) then pins. */}
            <div className="mw-fac2__left" ref={leftRef}>
              <div className="mw-fac2__intro">
                <header className="mw-fac2__head">
                  <p className="mw-fac2__field">
                    {stage ? <span>{stage}</span> : null}
                    <span className="mw-fac2__field-rule" />
                    <span>{eyebrow}</span>
                  </p>
                  <h2 id={headingId} className="mw-fac2__title">{title.em}</h2>
                </header>

                <p className="mw-fac2__lead">{lead}</p>

                <div className="mw-fac2__actions">
                  <SolidCta01 href={primaryCta.href}>
                    <span className="mw-fac2__lbl-long">{primaryCta.longLabel}</span>
                    <span className="mw-fac2__lbl-short">{primaryCta.shortLabel}</span>
                    {" "}<ActionArrow01 />
                  </SolidCta01>
                  <Link href={aboutLink.href} className="mw-fac2__about">
                    <span className="mw-fac2__lbl-long">{aboutLink.longLabel}</span>
                    <span className="mw-fac2__lbl-short">{aboutLink.shortLabel}</span>
                    {" "}<span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT — the cream column. Two stacked layers: MEDIA (photos + highlights band) which
                rises in then swipes RIGHT, and CAPS (the diamond cluster) parked centred behind it,
                rolling in as the media uncovers it. */}
            <div className="mw-fac2__right" ref={rightRef}>
              <div className="mw-fac2__media" ref={mediaRef}>
                <ImageAccordion01 photos={photos} reveal={false} label="Vaughn Bullough Environmental Centre photo gallery" />
                {/* Clip band — the 3 highlights grow out from under the photos (no container). */}
                <div className="mw-fac2__figclip">
                  <dl className="mw-fac2__figs" aria-label="Facility figures" ref={figsRef}>
                    {figures.map((f) => (<FigureStat01 key={f.label} label={f.label} num={f.num} unit={f.unit} />))}
                  </dl>
                </div>
              </div>

              {/* Onsite capabilities — the "diamond of diamonds": a title diamond crowning 7 clay
                  capability diamonds on the who-we-serve argyle lattice. Revealed by the swipe. */}
              <div className="mw-fac2__caps" ref={capsRef}>
                <div className="mw-cap-dia" style={{ aspectRatio: `${CAP_COLS} / ${CAP_ROWS}` }} role="group" aria-label={capsTitle}>
                  <div className="mw-cap-dia__cell mw-cap-dia__cell--title" style={capDiaStyle(2, 0)}>
                    <span className="mw-cap-dia__d">
                      <svg className="mw-cap-dia__svg" viewBox="0 0 200 200" aria-hidden="true">
                        <rect className="mw-cap-dia__fill" x="29.3" y="29.3" width="141.4" height="141.4" rx="15" transform="rotate(45 100 100)" />
                      </svg>
                      <span className="mw-cap-dia__face"><span className="mw-cap-dia__title">{capsTitle}</span></span>
                    </span>
                  </div>
                  {capabilities.map((cap, i) => {
                    const s = CAP_SLOTS[i];
                    return (
                      <div className="mw-cap-dia__cell" style={capDiaStyle(s.col, s.row, { "--cap-bg": CAP_TONES[i] })} key={i}>
                        <span className="mw-cap-dia__d">
                          <svg className="mw-cap-dia__svg" viewBox="0 0 200 200" aria-hidden="true">
                            <rect className="mw-cap-dia__fill" x="29.3" y="29.3" width="141.4" height="141.4" rx="15" transform="rotate(45 100 100)" />
                          </svg>
                          <span className="mw-cap-dia__face"><span className="mw-cap-dia__name">{capSoftWrap(cap)}</span></span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
