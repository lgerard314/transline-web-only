"use client";
import { useState } from "react";

// ImageAccordion01 — a hover-expand image accordion (horizontal on desktop,
// vertical on mobile). One panel is open at a time (hover / focus / tap); the
// open panel fills the band with the full photo + a horizontal mono caption, the
// rest collapse to clay slivers carrying a vertical caption spine. Placed full-bleed
// so the row runs from the content column to the RIGHT edge of the screen. CSS-only
// motion (flex-grow / min-height) — no carousel library. Styling: app/styles/04-home.css (.mw-iacc*).
//
// Props: photos — [{ src, alt, caption }]
export function ImageAccordion01({ photos, label = "Facility photo gallery" }) {
  const [open, setOpen] = useState(0);
  if (!photos || photos.length === 0) return null;

  return (
    <div className="mw-iacc" role="group" aria-label={label}>
      {/* data-reveal-stagger: each panel fades up (mw-rv) as the row scrolls in.
          --iacc-count lets the CSS invert the shared stagger to RIGHT-TO-LEFT;
          data-reveal-repeat on each panel resets + replays every re-entry. */}
      <div className="mw-iacc__track" data-reveal-stagger style={{ "--iacc-count": photos.length }}>
        {photos.map((photo, i) => {
          const isOpen = i === open;
          const num = String(i + 1).padStart(2, "0");
          const cap = photo.caption || photo.alt || `Photo ${num}`;
          return (
            <button
              key={i}
              type="button"
              className={"mw-iacc__panel" + (isOpen ? " is-open" : "")}
              data-reveal-repeat
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
                    data-parallax-max="0.06"
                  />
                </span>
              </span>
              <span className="mw-iacc__veil" aria-hidden="true" />
              <span className="mw-iacc__bar" aria-hidden="true" />
              <span className="mw-iacc__num" aria-hidden="true">{num}</span>
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
