"use client";

import { useState } from "react";

// Facility photo switcher — a main photo with a row of thumbnails
// underneath. Clicking a thumb swaps the main photo (cross-fade via
// key={index}). Honors prefers-reduced-motion through globals.css.
export function FacilityGallery({ photos }) {
  const [index, setIndex] = useState(0);
  if (!photos || photos.length === 0) return null;
  const active = photos[index];

  return (
    <div className="mw-fac2__media" data-reveal>
      <figure className="mw-fac2__photo-frame">
        <img
          key={index}
          className="mw-fac2__photo-main"
          src={active.src}
          alt={active.alt || ""}
          loading="lazy"
        />
        {active.caption && (
          <figcaption className="mw-fac2__photo-cap" key={`cap-${index}`}>
            <span className="mw-fac2__photo-cap-mark" aria-hidden="true" />
            <span>{active.caption}</span>
          </figcaption>
        )}
      </figure>
      <div className="mw-fac2__thumbs" role="group" aria-label="Switch facility photo">
        {photos.map((photo, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-pressed={i === index}
            aria-label={photo.alt || `Photo ${i + 1}`}
            className={"mw-fac2__thumb" + (i === index ? " is-active" : "")}
          >
            <img src={photo.src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}
