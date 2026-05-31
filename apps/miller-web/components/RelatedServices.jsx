"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { SERVICES } from "../lib/services";

// Splits a title so the last word drops to its own line — matches the
// home service-tile treatment so the arrow renders inline on line two.
function splitTitle(title) {
  const parts = String(title).trim().split(/\s+/);
  if (parts.length <= 1) return { line1: title, line2: null };
  return { line1: parts.slice(0, -1).join(" "), line2: parts[parts.length - 1] };
}

// Three identical copies let the rail scroll endlessly in either direction:
// scrollLeft is parked in the middle copy and silently jumps by one
// copy-width when it drifts out of band — invisible because the copies are
// pixel-identical. Only the middle copy is exposed to keyboard / AT.
const COPIES = 3;
const MIDDLE = 1;

// Reusable related-services rail. Renders every service (minus the current
// page) as a home mw-svcs-tile picture card in an infinite-loop scroll
// track with prev/next controls. Drop it in on any service page:
// <RelatedServices currentSlug="emergency-response" />.
export function RelatedServices({
  currentSlug,
  label = "Other services",
  heading = "We've got you covered...",
  titleId,
  allHref = "/industrial-services/",
  allLabel = "All services",
}) {
  const LabelTag = titleId ? "h2" : "p";
  const services = SERVICES.filter((s) => s.slug !== currentSlug);
  const n = services.length;
  const trackRef = useRef(null);
  const setWidthRef = useRef(0);

  // Pixel distance of one full copy (first card of copy 1 minus first of copy 0).
  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el || el.children.length < n + 1) return;
    setWidthRef.current = el.children[n].offsetLeft - el.children[0].offsetLeft;
  }, [n]);

  // Park in the middle copy; wrap whenever scroll leaves the [0.5w, 1.5w) band.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || n === 0) return undefined;

    const init = () => {
      measure();
      if (setWidthRef.current) el.scrollLeft = setWidthRef.current;
    };
    init();
    const raf = requestAnimationFrame(init); // re-measure after first paint

    const onScroll = () => {
      const w = setWidthRef.current;
      if (!w) return;
      if (el.scrollLeft < w * 0.5) el.scrollLeft += w;
      else if (el.scrollLeft >= w * 1.5) el.scrollLeft -= w;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [measure, n]);

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
        <div className="mw-rel__head-text">
          <LabelTag id={titleId} className="mw-section-tag mw-rel__label">
            <span className="mw-section-tag-mark" aria-hidden="true" />
            <span className="mw-section-tag-label">{label}</span>
          </LabelTag>
          <h3 className="mw-rel__heading">{heading}</h3>
        </div>
        <Link href={allHref} className="mw-rel__all">
          {allLabel} <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      <div className="mw-rel__viewport">
        <button
          type="button"
          className="mw-rel__nav mw-rel__nav--prev"
          aria-label="Scroll to previous services"
          onClick={() => scrollByDir(-1)}
        >
          <span aria-hidden="true">&larr;</span>
        </button>
        <ul className="mw-rel__track" ref={trackRef} aria-label={label}>
          {Array.from({ length: COPIES }).flatMap((_, copy) =>
            services.map((s) => {
              const { line1, line2 } = splitTitle(s.title);
              const clone = copy !== MIDDLE;
              return (
                <li
                  key={`${copy}-${s.slug}`}
                  className="mw-rel__item"
                  data-rel-card
                  aria-hidden={clone ? "true" : undefined}
                >
                  <Link
                    href={`/industrial-services/${s.slug}/`}
                    className="mw-svcs-tile"
                    tabIndex={clone ? -1 : undefined}
                  >
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
            })
          )}
        </ul>
        <button
          type="button"
          className="mw-rel__nav mw-rel__nav--next"
          aria-label="Scroll to next services"
          onClick={() => scrollByDir(1)}
        >
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </div>
  );
}
