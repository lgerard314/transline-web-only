"use client";
// Coverage & readiness gallery. The capability list on the left doubles as a
// picker: hovering (or focusing) a row swaps the large image on the right and
// the row's far-right thumbnail. The last-hovered row stays locked — its image
// and active styling persist until another row is hovered — so the panel never
// flickers back to a default. Row height and type sizes are fixed; the
// thumbnail is absolutely positioned so it can't grow the row.

import { useState } from "react";
import Link from "next/link";

export function CoverageGallery({ eyebrow, title, lead, items, cta, titleId }) {
  const [active, setActive] = useState(0);

  return (
    <div className="mw-svc-cov__grid">
      <div className="mw-svc-cov__content" data-reveal>
        <p className="mw-section-tag" aria-hidden="true">
          <span className="mw-section-tag-mark" />
          <span className="mw-section-tag-label">{eyebrow}</span>
        </p>
        <h2 id={titleId} className="mw-section-title">
          {title}
          <span className="mw-stop" aria-hidden="true" />
        </h2>
        <p className="mw-svc-cov__lead">{lead}</p>

        <ul className="mw-svc-cov__list">
          {items.map((it, i) => (
            <li
              key={it.text}
              className="mw-svc-cov__item"
              data-active={i === active ? "1" : undefined}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="mw-svc-cov__item-text">{it.text}</span>
              <span className="mw-svc-cov__item-thumb" aria-hidden="true">
                <img src={it.photo} alt="" loading="lazy" />
              </span>
            </li>
          ))}
        </ul>

        {cta && (
          <Link href={cta.href} className="mw-cta mw-cta--solid mw-svc-cov__cta">
            {cta.label} <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>

      <figure className="mw-svc-photo mw-svc-cov__media" data-reveal>
        {items.map((it, i) => (
          <img
            key={it.photo}
            className="mw-svc-cov__photo"
            src={it.photo}
            alt=""
            data-active={i === active ? "1" : undefined}
            loading="lazy"
          />
        ))}
        <figcaption className="mw-svc-cov__cap" aria-live="polite">
          {items[active].caption}
        </figcaption>
      </figure>
    </div>
  );
}
