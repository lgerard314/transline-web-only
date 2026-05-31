"use client";
// Coverage & readiness gallery. The capability list on the left doubles as a
// picker: hovering (or focusing) a row swaps the large image on the right and
// the row's far-right thumbnail. The last-hovered row stays locked — its image
// and active styling persist until another row is hovered — so the panel never
// flickers back to a default. Row height and type sizes are fixed; the
// thumbnail is absolutely positioned so it can't grow the row.
//
// Layout: the eyebrow sits in its own grid row so the photo (col 2) spans only
// the content row — its top meets the header top and its bottom meets the
// actions row (button + 24/7 phone) bottom.

import { Fragment, useState } from "react";
import Link from "next/link";

export function CoverageGallery({
  eyebrow,
  title,
  lead,
  items,
  cta,
  titleId,
  phoneHref,
  phoneDisplay,
}) {
  const [active, setActive] = useState(() =>
    Math.max(0, items.findIndex((it) => it.default))
  );

  return (
    <div className="mw-svc-cov__grid">
      <p className="mw-section-tag mw-svc-cov__eyebrow" aria-hidden="true" data-reveal>
        <span className="mw-section-tag-mark" />
        <span className="mw-section-tag-label">{eyebrow}</span>
      </p>

      <div className="mw-svc-cov__content" data-reveal>
        <h2 id={titleId} className="mw-section-title mw-svc-cov__heading">
          {title.split("\n").map((line, i, arr) => (
            <Fragment key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </Fragment>
          ))}
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
                <img src={it.photo} alt="" loading="lazy" style={{ objectPosition: it.thumbAnchor }} />
              </span>
            </li>
          ))}
        </ul>

        {(cta || phoneDisplay) && (
          <div className="mw-svc-cov__actions">
            {cta && (
              <Link href={cta.href} className="mw-cta mw-cta--solid mw-svc-cov__cta">
                {cta.label} <span aria-hidden="true">→</span>
              </Link>
            )}
            {phoneDisplay && (
              <a
                href={phoneHref}
                className="mw-svc-cov__phone"
                aria-label={`Call 24/7 emergency: ${phoneDisplay}`}
              >
                <span className="mw-svc-cov__phone-sup">24/7 emergency</span>
                <span className="mw-svc-cov__phone-num">{phoneDisplay}</span>
              </a>
            )}
          </div>
        )}
      </div>

      <figure className="mw-svc-photo mw-svc-cov__media" data-reveal>
        {/* Keyed by active so it remounts on every item change, replaying the
            top-border wipe each time a different capability is hovered. */}
        <span key={active} className="mw-svc-cov__topbar" aria-hidden="true" />
        {items.map((it, i) => (
          <img
            key={it.photo}
            className="mw-svc-cov__photo"
            src={it.photo}
            alt=""
            data-active={i === active ? "1" : undefined}
            loading="lazy"
            style={{ objectPosition: it.bigAnchor }}
          />
        ))}
        <figcaption className="mw-svc-cov__cap" aria-live="polite">
          <span className="mw-svc-cov__cap-mark" aria-hidden="true" />
          {items[active].caption}
        </figcaption>
      </figure>
    </div>
  );
}
