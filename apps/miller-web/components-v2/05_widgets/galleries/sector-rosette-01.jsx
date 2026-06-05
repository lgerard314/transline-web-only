"use client";
import { useState } from "react";

// One category block for SectorDiamonds01 — a uniform 5×5 DIAMOND GRID where most
// cells are transparent. Live cells: four photo diamonds on the inner X, the
// category's solid walnut diamond on the top/bottom tip (alternating per column to
// make the zig-zag band), and four sub-sector names each sitting in a TRANSPARENT
// corner diamond aligned toward its photo. Every diamond is gapped (see --secd-gap).
//
// Photos carry their sub-sector as alt text and the category is a real <h3>, so the
// block reads as "Industrial: manufacturing, mining, oil & gas, chemical
// distribution" to assistive tech (the visible corner labels are aria-hidden).
const PHOTO_BASE = "/miller/custom";
const SLOTS = ["a", "b", "c", "d"]; // inner-X photo positions; labels share the slot

export function SectorRosette01({ title, items, index = 0 }) {
  const [active, setActive] = useState(null);
  const facets = items.slice(0, 4);
  return (
    <article className="mw-secd__cluster" data-row={index % 2 === 0 ? "low" : "high"}>
      <div className="mw-secd__tiles">
        {/* category — solid rounded walnut diamond on the top/bottom tip, name only */}
        <div className="mw-secd__cat">
          <svg className="mw-secd__cat-svg" viewBox="0 0 200 200" aria-hidden="true">
            <rect className="mw-secd__cat-fill" x="29.3" y="29.3" width="141.4" height="141.4" rx="15" transform="rotate(45 100 100)" />
          </svg>
          <span className="mw-secd__cat-face">
            <h3 className="mw-secd__cat-name">{title}</h3>
          </span>
        </div>

        {/* four photo diamonds on the inner X */}
        {facets.map((it, i) => (
          <div
            className="mw-secd__facet"
            data-slot={SLOTS[i]}
            key={it.slug}
            data-active={active === i ? "1" : undefined}
          >
            <span
              className="mw-secd__facet-clip"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <img className="mw-secd__facet-img" src={`${PHOTO_BASE}/${it.slug}.png`} alt={it.name} loading="lazy" />
            </span>
          </div>
        ))}

        {/* four sub-sector names in transparent corner diamonds, aligned to their photo */}
        {facets.map((it, i) => (
          <div className="mw-secd__label" data-slot={SLOTS[i]} key={`l-${it.slug}`} data-active={active === i ? "1" : undefined} aria-hidden="true">
            <span className="mw-secd__label-text">{it.name}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
