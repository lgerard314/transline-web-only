"use client";
import { useState, useEffect } from "react";

/* Vertical expanding photo reel — a stack of team photos where the active row
   grows to fill the column and reveals a mono caption. Hover/focus or click
   sets the active row. Adapted from the horizontal "interactive selector"
   pattern to fit the careers section's tall right-hand photo column. */
export function CareerReel01({ photos }) {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(false);

  // Staggered mount reveal — panels slide up into place one after another.
  useEffect(() => {
    const t = setTimeout(() => setShown(true), 60);
    return () => clearTimeout(t);
  }, []);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="mw-creel" role="group" aria-label="Life on the Miller crew" data-shown={shown ? "1" : undefined}>
      {photos.map((photo, i) => (
        <button
          key={photo.src}
          type="button"
          className="mw-creel__panel"
          style={{ "--i": i, backgroundImage: `url('${photo.src}')` }}
          data-active={i === active ? "1" : undefined}
          aria-pressed={i === active}
          aria-label={photo.caption || `Team photo ${i + 1}`}
          onMouseEnter={() => setActive(i)}
          onFocus={() => setActive(i)}
          onClick={() => setActive(i)}
        >
          <span className="mw-creel__shade" aria-hidden="true" />
          {photo.caption && (
            <span className="mw-creel__cap">
              <span className="mw-creel__cap-mark" aria-hidden="true" />
              <span className="mw-creel__cap-text">{photo.caption}</span>
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
