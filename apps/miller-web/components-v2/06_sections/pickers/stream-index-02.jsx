"use client";

import { useState } from "react";
import Link from "next/link";
import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · stream-index-02 — "who we collect from" as a manifest-style sector
// index (CWC v2 §5). Nine numbered document rows (mono num · condensed name ·
// example streams) act as a picker for a large photo that swaps on
// hover/focus/select, with a default-selected row (the CoverageGallery
// interaction grammar rebuilt as an accessible document index — rows are real
// <button>s, so keyboard users can drive the swap; the photo is decorative
// and the caption mirrors via aria-live). The last-picked row stays locked.
//
// content: { titleId, eyebrow, title, lead, cta { label, href },
//            sectors[{ num, name, streams, photo, caption, default? }] }
// config:  standard sectionProps passthrough.
export function StreamIndex02({ content, config = {} }) {
  const sectors = content.sectors;
  const [active, setActive] = useState(() =>
    Math.max(0, sectors.findIndex((s) => s.default))
  );

  return (
    <section className="mw-cwc-index" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-cwc-index__inner mw-inner">
        <header className="mw-cwc-index__head">
          <p className="mw-section-tag" data-reveal aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">{content.eyebrow}</span>
          </p>
          <h2 id={content.titleId} className="mw-section-title mw-cwc-index__title" data-reveal>
            <StopText>{content.title}</StopText>
          </h2>
          <p className="mw-cwc-index__lead" data-reveal>{content.lead}</p>
        </header>

        <div className="mw-cwc-index__grid">
          <div className="mw-cwc-index__list-col">
            <ol className="mw-cwc-index__list" data-reveal-stagger>
              {sectors.map((s, i) => (
                <li key={s.num} className="mw-cwc-index__row" data-active={i === active ? "1" : undefined}>
                  <button
                    type="button"
                    className="mw-cwc-index__row-btn"
                    aria-pressed={i === active}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                  >
                    <span className="mw-cwc-index__num" aria-hidden="true">{s.num}</span>
                    <span className="mw-cwc-index__name">{s.name}</span>
                    <span className="mw-cwc-index__leader" aria-hidden="true" />
                    <span className="mw-cwc-index__streams">{s.streams}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="mw-cwc-index__actions" data-reveal>
              <Link href={content.cta.href} className="mw-cta mw-cta--solid">
                {content.cta.label} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <figure className="mw-cwc-index__media" data-reveal>
            {/* Keyed by active so the clay top bar replays its wipe per swap. */}
            <span key={active} className="mw-cwc-index__topbar" aria-hidden="true" />
            {sectors.map((s, i) => (
              <img
                key={s.photo}
                className="mw-cwc-index__photo"
                src={s.photo}
                alt=""
                data-active={i === active ? "1" : undefined}
                loading="lazy"
              />
            ))}
            <figcaption className="mw-cwc-index__cap" aria-live="polite">
              <span className="mw-cwc-index__cap-mark" aria-hidden="true" />
              {sectors[active].caption}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
