"use client";
import { useEffect, useRef, useState } from "react";

// ImageAccordion01 — a hover-expand image accordion (horizontal on desktop,
// vertical on mobile). One panel is open at a time (hover / focus / tap); the
// open panel fills the band with the full photo + a horizontal mono caption, the
// rest collapse to clay slivers carrying a vertical caption spine. Placed full-bleed
// so the row runs from the content column to the RIGHT edge of the screen.
// Styling: app/styles/04-home.css (.mw-iacc*).
//
// Entrance is SCROLL-DRIVEN (the home page's hero / "our history" plate gesture): each
// photo panel reveals as a clay plate whose window opens — a clip-path inset opening to
// 0, a zoom layer that settles (scale 1.22 -> 1), and the panel rising + fading in —
// staggered LEFT-TO-RIGHT across the row, the image carrying its diagonal parallax. Once
// the photos are in, the sibling intro text mask-rises (this widget sets --p on
// .mw-fac2__intro). All scrubbed by one scroll timeline; reduced-motion rests everything.
//
// Props: photos — [{ src, alt, caption }]
export function ImageAccordion01({ photos, label = "Facility photo gallery" }) {
  const [open, setOpen] = useState(0);
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const panels = Array.from(root.querySelectorAll(".mw-iacc__panel"));
    if (!panels.length) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // The intro text lives in the sibling left column; its four masked parts rise after.
    const grid = root.closest(".mw-fac2__grid");
    const intro = grid ? grid.querySelector(".mw-fac2__intro") : null;
    const risers = intro ? Array.from(intro.querySelectorAll(".mw-fac2__rise")) : [];

    const setAll = (v) => {
      for (const p of panels) p.style.setProperty("--p", v);
      for (const el of risers) el.style.setProperty("--p", v);
    };
    if (mq.matches) { setAll("1"); return; }
    setAll("0");

    // TIMED plate-window cascade, TRIGGERED when the gallery scrolls into view (like the
    // page's data-reveal / hero) so it ALWAYS plays out fully — even if you stop scrolling
    // (a position-scrubbed reveal would finish off-screen, since the photos are tall and
    // top-aligned). Photos cascade left-to-right (window opens + zoom-settles + rises +
    // fades); then the intro text mask-rises top-down. Replays each time it re-enters view.
    const ease = (x) => 1 - Math.pow(1 - x, 3);          // easeOutCubic
    const PHOTO_DUR = 640, PHOTO_STAG = 130;             // per-photo duration / stagger (ms)
    const TEXT_GAP = 120, TEXT_DUR = 600, TEXT_STAG = 110;
    const photoTotal = (panels.length - 1) * PHOTO_STAG + PHOTO_DUR;
    let raf = 0, t0 = 0, playing = false;

    const frame = (now) => {
      if (!t0) t0 = now;
      const elapsed = now - t0;
      let done = true;
      for (let i = 0; i < panels.length; i++) {
        const l = (elapsed - i * PHOTO_STAG) / PHOTO_DUR;
        const v = l <= 0 ? 0 : l >= 1 ? 1 : ease(l);
        if (v < 1) done = false;
        panels[i].style.setProperty("--p", v.toFixed(4));
      }
      for (let i = 0; i < risers.length; i++) {
        const l = (elapsed - photoTotal - TEXT_GAP - i * TEXT_STAG) / TEXT_DUR;
        const v = l <= 0 ? 0 : l >= 1 ? 1 : ease(l);
        if (v < 1) done = false;
        risers[i].style.setProperty("--p", v.toFixed(4));
      }
      raf = done ? 0 : requestAnimationFrame(frame);
      if (done) playing = false;
    };
    const play = () => { if (playing) return; playing = true; t0 = 0; raf = requestAnimationFrame(frame); };
    const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0; playing = false; setAll("0"); };

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) play();
        else stop();   // reset so it replays the next time it scrolls back into view
      }
    }, { threshold: 0.25 });
    io.observe(root);

    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [photos]);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="mw-iacc" role="group" aria-label={label} ref={rootRef}>
      <div className="mw-iacc__track">
        {photos.map((photo, i) => {
          const isOpen = i === open;
          const num = String(i + 1).padStart(2, "0");
          const cap = photo.caption || photo.alt || `Photo ${num}`;
          return (
            <button
              key={i}
              type="button"
              className={"mw-iacc__panel" + (isOpen ? " is-open" : "")}
              style={{ "--p": 0 }}
              aria-pressed={isOpen}
              aria-label={cap}
              onMouseEnter={() => setOpen(i)}
              onFocus={() => setOpen(i)}
              onClick={() => setOpen(i)}
            >
              {/* media → zoom → img: clip window, entrance zoom layer, and the
                  photo with its own diagonal parallax drift (hero/history technique). */}
              <span className="mw-iacc__media">
                <span className="mw-iacc__zoom">
                  <img
                    className="mw-iacc__img"
                    src={photo.src}
                    alt={isOpen ? (photo.alt || "") : ""}
                    loading="lazy"
                    draggable="false"
                    data-parallax-img
                    data-parallax-x="1"
                    data-parallax-max="0.14"
                  />
                </span>
              </span>
              <span className="mw-iacc__spine" aria-hidden="true">{cap}</span>
              <span className="mw-iacc__cap">
                <span className="mw-iacc__cap-mark" aria-hidden="true" />
                <span className="mw-iacc__cap-text">{cap}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
