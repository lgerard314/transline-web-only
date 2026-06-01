"use client";

import { useState } from "react";

const PHOTO_BASE = "/miller/who-we-serve-industries";

// One sector card — hovering (or focusing) a list row swaps the photo above.
export function SectorCard({ title, items }) {
  const [active, setActive] = useState(0);

  return (
    <article className="mw-sec2__card">
      <div className="mw-sec2__card-photo" aria-hidden="true">
        {items.map((item, i) => (
          <img
            key={item.slug}
            className="mw-sec2__card-photo-img"
            src={`${PHOTO_BASE}/${item.slug}.png`}
            alt=""
            data-active={i === active ? "1" : undefined}
            loading="lazy"
          />
        ))}
      </div>
      <div className="mw-sec2__card-body">
        <h3 className="mw-sec2__card-title">{title}</h3>
        <span className="mw-sec2__card-rule" aria-hidden="true" />
        <ul className="mw-sec2__card-list">
          {items.map((item, i) => (
            <li
              key={item.slug}
              className="mw-sec2__entry"
              data-active={i === active ? "1" : undefined}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              tabIndex={0}
            >
              <span className="mw-sec2__entry-name">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
