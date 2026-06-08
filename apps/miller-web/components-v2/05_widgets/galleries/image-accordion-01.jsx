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
    // The intro text lives in the sibling left column; we drive its mask-rise reveal
    // (--p) from the SAME scroll timeline so it sequences strictly AFTER the photos.
    const grid = root.closest(".mw-fac2__grid");
    const intro = grid ? grid.querySelector(".mw-fac2__intro") : null;
    // The intro's four masked parts (eyebrow → header → body → buttons) rise top-down.
    const risers = intro ? Array.from(intro.querySelectorAll(".mw-fac2__rise")) : [];
    const RSTAG = 0.13;
    const rden = 1 - (risers.length > 1 ? (risers.length - 1) * RSTAG : 0);
    const cell = root.closest(".mw-fac2__right") || root;
    const n = panels.length;
    const STAG = 0.09;                 // left-to-right stagger in progress space
    const denom = 1 - (n - 1) * STAG;  // normalize so the last panel still finishes at 1
    const PHOTO_END = 0.62;            // photos done by here; the text rises after
    let raf = 0;

    const compute = () => {
      raf = 0;
      if (mq.matches) {
        for (const p of panels) p.style.setProperty("--p", "1");
        for (const el of risers) el.style.setProperty("--p", "1");
        return;
      }
      const vh = window.innerHeight;
      // The cell isn't transformed, so its live rect is accurate (survives lazy-load
      // reflow above). One section-travel value t (0 → 1) drives everything.
      const top = cell.getBoundingClientRect().top;
      const start = vh * 0.88; // gallery entering — the reveal begins
      const end = vh * 0.2;    //   photos settled AND the text has risen
      let t = (start - top) / (start - end);
      t = t < 0 ? 0 : t > 1 ? 1 : t;

      // Photos — each panel's clip window opens + zoom-settles + rises, staggered L→R.
      const raw = t / PHOTO_END;
      for (let i = 0; i < n; i++) {
        let pp = (raw - i * STAG) / denom;
        pp = pp < 0 ? 0 : pp > 1 ? 1 : pp;
        panels[i].style.setProperty("--p", pp.toFixed(4));
      }

      // Text — each part (eyebrow → header → body → buttons) mask-rises once the photos
      // are in, staggered top-down (mirrors the hero's headline-line stagger).
      let p = (t - PHOTO_END) / (1 - PHOTO_END);
      p = p < 0 ? 0 : p > 1 ? 1 : p;
      for (let i = 0; i < risers.length; i++) {
        let rp = (p - i * RSTAG) / rden;
        rp = rp < 0 ? 0 : rp > 1 ? 1 : rp;
        risers[i].style.setProperty("--p", rp.toFixed(4));
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute); };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    mq.addEventListener("change", compute);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mq.removeEventListener("change", compute);
      if (raf) cancelAnimationFrame(raf);
    };
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
