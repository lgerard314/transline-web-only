"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { StopText } from "@/components/StopText";
import { useMouseParallax } from "@/components/useMouseParallax";
import { sectionProps } from "@/components-v2/section-config";

// L3 · stream-index-02 — "who we collect from" as a manifest-style sector
// index (CWC v2 §5). Nine document rows (diamond mark · condensed name ·
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
  // Non-link photo → mouse-tracking parallax, no hover grammar (logan
  // 2026-06-12). The figure tracks; CSS drifts whichever img is active.
  const mediaRef = useRef(null);
  useMouseParallax(mediaRef);

  // Per-row scroll reveal — the SAME rise-out-of-mask effect as the home
  // services roster rows (logan 2026-06-13: the §5 list items must reveal like
  // the home services list, not just sit there). Each row rises out of its <li>
  // mask the moment it is FULLY on screen, and re-arms once scrolled fully past
  // (reversible top-down cascade). Bespoke on purpose: the house data-reveal
  // fires at the viewport BOTTOM edge, so its motion plays in the user's
  // periphery and is already settled by the time the row reaches center. Rests
  // settled for no-JS / reduced motion (CSS base state has no transform).
  const [revealed, setRevealed] = useState([]);
  const rowRefs = useRef([]);
  useEffect(() => {
    let raf = 0;
    const same = (a, b) => (a.length === b.length && a.every((v, i) => v === b[i]) ? a : b);
    const resolve = (prev, i, enter, below) => (enter ? true : below ? false : !!prev[i]);
    const update = () => {
      raf = 0;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      setRevealed((prev) =>
        same(
          prev,
          rowRefs.current.map((el, i) => {
            if (!el) return false;
            const r = el.getBoundingClientRect();
            return resolve(prev, i, r.top >= 0 && r.bottom <= vh, r.top >= vh);
          }),
        ),
      );
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

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
            <ol className="mw-cwc-index__list">
              {sectors.map((s, i) => (
                <li
                  key={s.name}
                  ref={(el) => { rowRefs.current[i] = el; }}
                  className={`mw-cwc-index__row${revealed[i] ? " is-revealed" : ""}`}
                  data-active={i === active ? "1" : undefined}
                >
                  <button
                    type="button"
                    className="mw-cwc-index__row-btn"
                    aria-pressed={i === active}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                  >
                    <span className="mw-cwc-index__mark" aria-hidden="true" />
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

          <figure className="mw-cwc-index__media" data-reveal ref={mediaRef}>
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
