"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
import { FigureStat01 } from "@/components-v2/04_blocks/stats/figure-stat-01";
import { ImageAccordion01 } from "@/components-v2/05_widgets/galleries/image-accordion-01";
import { sectionProps } from "@/components-v2/section-config";

// MediaSplit01 — the home VBEC (facility) section. A 40/60 split on a cream section. Two phases:
//
// ENTRANCE (as the section scrolls in to fill the viewport):
//   LEFT  — intro rests in final alignment; a bottom clip-path opens top→bottom so copy pushes
//           out of the section above without ever sitting below its settled bottom padding.
//           Eyebrow / title / lead / CTA / text-link mask-rise in stagger with the same curve.
//   RIGHT — rises UP from below on easeInOut(E) so the media column finishes with pin-in.
//
// PINNED SEQUENCE (once the section fills the viewport):
//   1. HIGHLIGHTS — scroll-scrubbed (FIG_START_P → FIG_END_P on pin P) after a short hold;
//      the 3-figure band grows out from under the photos (reverses on scroll-up).
//   2. SWIPE — after highlights finish, SWIPE_HOLD_P of extra scroll before the media exit
//      scrubs; that nudge arms a
//      careers-style auto-advance (zoom-collage-01: one rAF loop, window.scrollBy while
//      pinned, accelerating pace) that scroll-drives the photo exit → SWIPE_END.
//      Remaining track height below SWIPE_END is release scroll after the sequence.
//
// Mobile / reduced-motion: no pin, beige section, columns at rest. Styling: app/styles/04-home.css.
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = (x) => 1 - Math.pow(1 - x, 3);            // easeOutCubic (highlights)
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

const FIG_START_P = 0.24;   // pin P past settle before highlights begin scrubbing (breathing room after entrance)
const FIG_END_P = 0.33;     // pin P where the highlights band is fully grown (same 0.09 scrub span as before)
const SWIPE_HOLD_P = 0.10;  // pin P hold after highlights land before the media exit scrubs
const EXIT_MS = 1200;       // base auto-advance pace for the photo exit (careers DIVE_MS pattern)
const USER_IDLE_MS = 160;   // pause auto-nudge while the user is actively scrolling
const SWIPE_END = 0.9;      // pin P where media is fully off-screen and diamonds are in
const EXIT_PAD = 32;        // px past the viewport right edge once exit completes
const CAP_TIP = 0.5 - Math.SQRT1_2 / 2; // left vertex of a 45° diamond in its inner box
const CAP_ROT = 210;        // deg base spin as each diamond rotates in (settles to 0)
const CAP_SPIN = 120;       // extra rotation added on top of CAP_ROT at enter
const CAP_LAUNCH_OVERLAP = 0.32; // fraction of a diamond covered by the media edge at launch
const CAP_START_SCALE = 0.25;

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
const capDiaStyle = (col, row, extra) => ({ left: `${col * CAP_SX}%`, top: `${row * CAP_SY}%`, width: `${2 * CAP_SX}%`, ...extra });
const capSoftWrap = (s) => s.replace(/([/-])/g, "$1" + String.fromCharCode(0x200b));

const INTRO_RISE_SEL = [".mw-fac2__field", ".mw-fac2__title", ".mw-fac2__lead", ".mw-fac2__cta-rise", ".mw-fac2__about-rise"];
const INTRO_RISE_U = [0.22, 0.4, 0.56, 0.74, 0.88]; // mask-rise gates keyed to entrance u (top → bottom)

export function MediaSplit01({ content, config = {} }) {
  const { eyebrow, stage, title, lead, figures, capsTitle, capabilities, primaryCta, aboutLink, headingId, photos } = content;
  const autoScroll = config.autoScroll !== false;
  const trackRef = useRef(null);
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const mediaRef = useRef(null);
  const figsRef = useRef(null);
  const capsRef = useRef(null);
  const [highlightsDone, setHighlightsDone] = useState(false);
  const highlightsDoneRef = useRef(false);

  // Careers-style driver (zoom-collage-01): one continuous rAF loop while the track is in
  // view reads scroll → writes the scene, auto-advances the exit once the user nudges past
  // the highlights hold. Wide viewport + motion OK only; otherwise columns rest static.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const track = trackRef.current;
    if (!track) return;
    const mqWide = window.matchMedia("(min-width: 901px)");
    const mqRM = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canPin = () => mqWide.matches && !mqRM.matches;
    let raf = 0, running = false, lastTs = 0, lastY = window.scrollY;
    let exitArmed = false, cancelled = false;
    let lastUserTs = -1e9;

    const onUserInput = (e) => { lastUserTs = e.timeStamp; };

    const resetPinClocks = () => {
      exitArmed = false;
      cancelled = false;
    };

    const idleState = () => ({
      entranceDone: false,
      P: 0,
      sweep: 0,
      figDone: false,
      swipeGate: FIG_END_P + SWIPE_HOLD_P,
      total: 1,
      pinned: false,
    });

    const showAllIntroRises = (leftEl) => {
      if (!leftEl) return;
      for (const sel of INTRO_RISE_SEL) {
        const el = leftEl.querySelector(sel);
        if (el) el.setAttribute("data-in", "1");
      }
    };

    const gateIntroRises = (leftEl, progress) => {
      if (!leftEl) return;
      for (let i = 0; i < INTRO_RISE_SEL.length; i++) {
        const el = leftEl.querySelector(INTRO_RISE_SEL[i]);
        if (!el) continue;
        if (progress >= INTRO_RISE_U[i]) el.setAttribute("data-in", "1");
        else el.removeAttribute("data-in");
      }
    };

    const render = () => {
      const track = trackRef.current, section = sectionRef.current;
      const left = leftRef.current, right = rightRef.current;
      const media = mediaRef.current, figs = figsRef.current, caps = capsRef.current;
      if (!track || !section || !left || !right || !media || !figs || !caps) {
        return idleState();
      }
      if (!canPin()) {
        const introOff = left.querySelector(".mw-fac2__intro");
        if (introOff) {
          introOff.style.removeProperty("--fac2-intro-y");
          introOff.style.removeProperty("clip-path");
        }
        right.style.removeProperty("--fac2-right-y");
        media.style.removeProperty("--fac2-media-x");
        media.style.removeProperty("--fac2-media-op");
        media.style.removeProperty("visibility");
        delete media.dataset.figDone;
        caps.style.removeProperty("--fac2-cap-y");
        if (figs.parentElement) figs.parentElement.style.removeProperty("--fac2-fig-h");
        track.style.removeProperty("--fac2-head-off");
        const g = caps.querySelector(".mw-cap-dia");
        if (g) g.querySelectorAll(".mw-cap-dia__cell").forEach((c) => { c.style.removeProperty("--cap-sc"); c.style.removeProperty("--cap-op"); c.style.removeProperty("--cap-tx"); c.style.removeProperty("--cap-ty"); c.style.removeProperty("--cap-rot"); });
        if (highlightsDoneRef.current) {
          highlightsDoneRef.current = false;
          setHighlightsDone(false);
        }
        resetPinClocks();
        showAllIntroRises(left);
        return idleState();
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

      // ENTRANCE — intro stays in final alignment; bottom clip opens top→bottom (never dips below
      // settled padding). Right column rises UP on the same curve.
      const u = easeInOut(E);
      const intro = left.querySelector(".mw-fac2__intro");
      if (intro) {
        intro.style.removeProperty("--fac2-intro-y");
        const hidden = (1 - u) * 100;
        intro.style.clipPath = hidden > 0.05 ? `inset(0 0 ${hidden.toFixed(3)}% 0)` : "none";
      }

      const coverR = right.offsetHeight || span;
      right.style.setProperty("--fac2-right-y", ((1 - u) * coverR).toFixed(1) + "px");

      gateIntroRises(left, u);

      // PIN 1 — HIGHLIGHTS: scroll-scrubbed figclip growth (FIG_START_P → FIG_END_P on pin P).
      const entranceDone = E >= 0.999;
      const figSpan = Math.max(0.001, FIG_END_P - FIG_START_P);
      const figIn = entranceDone && P >= FIG_START_P
        ? ease(clamp01((P - FIG_START_P) / figSpan))
        : 0;
      const figDone = entranceDone && P >= FIG_END_P;
      const swipeGate = FIG_END_P + SWIPE_HOLD_P;
      const figclip = figs.parentElement;
      if (figclip) figclip.style.setProperty("--fac2-fig-h", (figs.offsetHeight * figIn).toFixed(1) + "px");

      // Freeze scroll parallax on the photos while highlights scrub (same scroll also
      // grows the figclip — MillerParallax must not rewrite --px-* on the images).
      if (figIn > 0) media.dataset.figReveal = "1";
      else delete media.dataset.figReveal;

      media.dataset.figDone = figDone ? "1" : "";
      if (figDone !== highlightsDoneRef.current) {
        highlightsDoneRef.current = figDone;
        setHighlightsDone(figDone);
      }

      // PIN 2 — SWIPE (scroll-scrubbed): only after highlights AND SWIPE_HOLD_P extra scroll
      // past FIG_END_P — so the band can rest before the media exit begins.
      const sweep = figDone && P > swipeGate
        ? clamp01((P - swipeGate) / Math.max(0.001, SWIPE_END - swipeGate))
        : 0;
      const exitT = sweep;
      const exitDone = figDone && sweep >= 1;

      const rightRect = right.getBoundingClientRect();
      const rightTop = rightRect.top;
      const mediaRect = media.getBoundingClientRect();
      const exitDist = (vw - mediaRect.left) + mediaRect.width + EXIT_PAD;
      media.style.setProperty("--fac2-media-x", (exitT * exitDist).toFixed(1) + "px");
      const mediaFade = ease(clamp01((exitT - 0.72) / 0.28));
      media.style.setProperty("--fac2-media-op", (1 - mediaFade).toFixed(3));
      if (exitDone) media.style.visibility = "hidden";
      else media.style.removeProperty("visibility");
      const containerLeft = media.getBoundingClientRect().left;
      // Shared body-content right edge (.mw-inner): width min(100% - clamp(48px, 8vw, 144px), 1560px), centred.
      const bodyGutter = Math.max(Math.min(72, Math.max(24, 0.04 * vw)), (vw - 1560) / 2);
      const bodyContentRight = vw - bodyGutter;

      // Park the diamond grid at the right column's vertical centre (matches flex-centred media).
      const capsH = caps.offsetHeight;
      const rightCenter = rightRect.top + rightRect.height / 2;
      caps.style.setProperty("--fac2-cap-y", ((rightCenter - rightTop) - capsH / 2).toFixed(1) + "px");

      // 8 diamonds × 1 rule: each diamond starts one width above-left, already tucked
      // under the moving media edge, then falls down-right on a straight 45° path into
      // its final lattice slot. The first diamond to launch settles first; each later
      // launch follows, with the final diamond settled once the media clears the body
      // content width.
      const grid = caps.querySelector(".mw-cap-dia");
      if (grid) {
        const gridLeft = grid.getBoundingClientRect().left;
        const cells = grid.querySelectorAll(".mw-cap-dia__cell");
        const metrics = Array.from(cells, (cell) => {
          const inner = cell.querySelector(".mw-cap-dia__d");
          const boxLeft = gridLeft + cell.offsetLeft + (inner?.offsetLeft || 0);
          const boxW = inner?.offsetWidth || cell.offsetWidth;
          const diamondLeft = boxLeft + boxW * CAP_TIP;
          const startX = -boxW;
          const startRight = boxLeft + boxW * (1 - CAP_TIP) + startX;
          const launchEdge = startRight - boxW * CAP_LAUNCH_OVERLAP;
          return { cell, boxW, startX, launchEdge };
        });
        const edge = containerLeft;
        const lastLaunchEdge = Math.max(...metrics.map((m) => m.launchEdge));
        const settleSpan = Math.max(1, bodyContentRight - lastLaunchEdge);
        const spinTotal = -(CAP_ROT + CAP_SPIN);
        for (const { cell, boxW, startX, launchEdge } of metrics) {
          const travelPx = edge - launchEdge;
          const raw = travelPx <= 0
              ? 0
              : clamp01(travelPx / settleSpan);
          const spin = ease(raw);
          const scale = CAP_START_SCALE + (1 - CAP_START_SCALE) * ease(raw);
          const startY = -boxW * 0.5;
          const pathX = (1 - raw) * startX;
          const pathY = (1 - raw) * startY;
          if (raw <= 0) {
            cell.style.setProperty("--cap-sc", CAP_START_SCALE.toFixed(3));
            cell.style.setProperty("--cap-rot", spinTotal + "deg");
            cell.style.setProperty("--cap-tx", startX.toFixed(1) + "px");
            cell.style.setProperty("--cap-ty", startY.toFixed(1) + "px");
            cell.style.setProperty("--cap-op", "0");
            continue;
          }
          cell.style.setProperty("--cap-sc", scale.toFixed(3));
          cell.style.setProperty("--cap-rot", ((1 - spin) * spinTotal).toFixed(1) + "deg");
          cell.style.setProperty("--cap-tx", pathX.toFixed(1) + "px");
          cell.style.setProperty("--cap-ty", pathY.toFixed(1) + "px");
          cell.style.setProperty("--cap-op", ease(clamp01(raw / 0.08)).toFixed(3));
        }
      }

      const pinned = entranceDone && P < 1 && secTop <= headOff + 4 && track.getBoundingClientRect().bottom > vh;
      return {
        entranceDone,
        P,
        sweep,
        figDone,
        swipeGate,
        total,
        pinned,
      };
    };

    const loop = (ts) => {
      if (!canPin()) { stop(); render(); return; }
      raf = requestAnimationFrame(loop);
      const dt = lastTs ? Math.min(50, ts - lastTs) : 16.7;
      lastTs = ts;

      const state = render();

      if (autoScroll) {
        const y = window.scrollY;
        const userActive = ts - lastUserTs < USER_IDLE_MS;
        if (state.figDone && state.P > state.swipeGate) exitArmed = true;
        if (state.P <= state.swipeGate) {
          cancelled = false;
          exitArmed = false;
        }
        if (!cancelled && state.pinned && exitArmed && state.sweep < 1 && y < lastY - 1) cancelled = true;

        // Careers auto-advance: real scroll, animation feel — accelerating pace, instant steps.
        // Only honour USER_IDLE_MS once the exit is visibly underway so the arming nudge does
        // not stall the self-run (careers never has a separate arm step).
        const userBlocks = userActive && state.sweep > 0.05;
        if (exitArmed && state.pinned && state.sweep < 1 && !cancelled && !userBlocks) {
          const exitDist = Math.max(1, (SWIPE_END - state.swipeGate) * state.total);
          const v = (exitDist / EXIT_MS) * 0.924 * (1 + 3 * state.sweep);
          window.scrollBy({ top: v * dt, behavior: "instant" });
        }
        lastY = window.scrollY;
      }
    };

    const start = () => {
      if (running || !canPin()) return;
      running = true;
      lastTs = 0;
      lastY = window.scrollY;
      if (autoScroll) {
        window.addEventListener("wheel", onUserInput, { passive: true });
        window.addEventListener("touchmove", onUserInput, { passive: true });
      }
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      if (autoScroll) {
        window.removeEventListener("wheel", onUserInput);
        window.removeEventListener("touchmove", onUserInput);
      }
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      render();
    };
    const evaluate = () => { if (canPin()) start(); else { stop(); render(); } };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) start();
      else stop();
    }, { threshold: 0 });
    io.observe(track);
    mqWide.addEventListener("change", evaluate);
    mqRM.addEventListener("change", evaluate);
    evaluate();
    return () => {
      io.disconnect();
      stop();
      mqWide.removeEventListener("change", evaluate);
      mqRM.removeEventListener("change", evaluate);
    };
  }, [autoScroll]);

  return (
    <div className="mw-fac2-track" ref={trackRef}>
      <section className="mw-fac2" aria-labelledby={headingId} ref={sectionRef} {...sectionProps(config)}>
        <div className="mw-inner">
          <div className="mw-fac2__grid">
            {/* LEFT — intro rests in final alignment; clip-path reveals top→bottom on entrance. */}
            <div className="mw-fac2__left" ref={leftRef}>
              <div className="mw-fac2__intro">
                <header className="mw-fac2__head">
                  <p className="mw-fac2__field" data-fac2-rise>
                    <span className="mw-fac2__rise">
                      {stage ? <span>{stage}</span> : null}
                      <span className="mw-fac2__field-rule" />
                      <span>{eyebrow}</span>
                    </span>
                  </p>
                  <h2 id={headingId} className="mw-fac2__title" data-fac2-rise>
                    <span className="mw-fac2__rise">{title.em}</span>
                  </h2>
                </header>

                <p className="mw-fac2__lead" data-fac2-rise>
                  <span className="mw-fac2__rise">{lead}</span>
                </p>

                <div className="mw-fac2__actions">
                  <div className="mw-fac2__cta-rise" data-fac2-rise>
                    <span className="mw-fac2__rise">
                      <SolidCta01 href={primaryCta.href}>
                        <span className="mw-fac2__lbl-long">{primaryCta.longLabel}</span>
                        <span className="mw-fac2__lbl-short">{primaryCta.shortLabel}</span>
                        {" "}<ActionArrow01 />
                      </SolidCta01>
                    </span>
                  </div>
                  <div className="mw-fac2__about-rise" data-fac2-rise>
                    <span className="mw-fac2__rise">
                      <Link href={aboutLink.href} className="mw-fac2__about">
                        <span className="mw-fac2__lbl-long">{aboutLink.longLabel}</span>
                        <span className="mw-fac2__lbl-short">{aboutLink.shortLabel}</span>
                        {" "}<span aria-hidden="true">→</span>
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT — two stacked layers: MEDIA (photos + highlights band) which
                rises in then swipes RIGHT, and CAPS (the diamond cluster) parked centred behind it,
                rolling in as the media uncovers it. */}
            <div className="mw-fac2__right" ref={rightRef}>
              <div className="mw-fac2__media" ref={mediaRef}>
                <ImageAccordion01 photos={photos} reveal={false} highlightsDone={highlightsDone} label="Vaughn Bullough Environmental Centre photo gallery" />
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
