"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SERVICES } from "../lib/services";

// Splits a title so the last word drops to its own line — matches the
// home service-tile treatment so the arrow renders inline on line two.
function splitTitle(title) {
  const parts = String(title).trim().split(/\s+/);
  if (parts.length <= 1) return { line1: title, line2: null };
  return { line1: parts.slice(0, -1).join(" "), line2: parts[parts.length - 1] };
}

// Reusable related-services rail. Renders every service (minus the
// current page) as a home mw-svcs-tile picture card in a scroll-snap
// track with prev/next controls. Drop it in on any service page:
// <RelatedServices currentSlug="emergency-response" />.
export function RelatedServices({
  currentSlug,
  label = "Related services",
  titleId,
  allHref = "/industrial-services/",
  allLabel = "All services",
}) {
  const LabelTag = titleId ? "h2" : "p";
  const services = SERVICES.filter((s) => s.slug !== currentSlug);
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setAtStart(scrollLeft <= 2);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 2);
  }, []);

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return undefined;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollByDir = useCallback((dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-rel-card]");
    const styles = window.getComputedStyle(el);
    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 16;
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  }, []);

  return (
    <div className="mw-rel" data-reveal>
      <div className="mw-rel__head">
        <LabelTag id={titleId} className="mw-section-tag mw-rel__label">
          <span className="mw-section-tag-mark" aria-hidden="true" />
          <span className="mw-section-tag-label">{label}</span>
        </LabelTag>
        <Link href={allHref} className="mw-rel__all">
          {allLabel} <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      <div className="mw-rel__viewport">
        <button
          type="button"
          className="mw-rel__nav mw-rel__nav--prev"
          aria-label="Scroll to previous services"
          disabled={atStart}
          onClick={() => scrollByDir(-1)}
        >
          <span aria-hidden="true">&larr;</span>
        </button>
        <ul className="mw-rel__track" ref={trackRef} aria-label={label}>
        {services.map((s) => {
          const { line1, line2 } = splitTitle(s.title);
          return (
            <li key={s.slug} className="mw-rel__item" data-rel-card>
              <Link href={`/industrial-services/${s.slug}/`} className="mw-svcs-tile">
                <span
                  className="mw-svcs-tile__photo"
                  style={{ backgroundImage: `url(${s.photo})` }}
                  aria-hidden="true"
                />
                <div className="mw-svcs-tile__body">
                  <div className="mw-svcs-tile__title-row">
                    <h3 className="mw-svcs-tile__title">
                      {line1}
                      {line2 && (
                        <>
                          <br />
                          {line2}
                        </>
                      )}
                    </h3>
                    <span className="mw-svcs-tile__arr" aria-hidden="true">&rarr;</span>
                  </div>
                  <p className="mw-svcs-tile__text">{s.summary}</p>
                </div>
              </Link>
            </li>
          );
        })}
        </ul>
        <button
          type="button"
          className="mw-rel__nav mw-rel__nav--next"
          aria-label="Scroll to next services"
          disabled={atEnd}
          onClick={() => scrollByDir(1)}
        >
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </div>
  );
}
