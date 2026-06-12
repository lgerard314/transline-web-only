"use client";

import { useEffect, useRef } from "react";
import { StopText } from "@/components/StopText";
import { useMouseParallax } from "@/components/useMouseParallax";
import { sectionProps } from "@/components-v2/section-config";

// Non-link photo: no hover grammar (no zoom, no bar-grow — reserved for
// linked cards); instead a mouse-tracking parallax drift once rendered
// (logan 2026-06-12). The clay top bar stays as a static plate accent.
function ParallaxPhoto({ src }) {
  const ref = useRef(null);
  useMouseParallax(ref);
  return (
    <figure className="mw-cwc-fleet__photo" ref={ref}>
      <span className="mw-cwc-fleet__photo-bar" aria-hidden="true" />
      <img src={src} alt="" loading="lazy" />
    </figure>
  );
}

// L3 · fleet-showcase-02 — the page's single dark-walnut anchor (CWC v2 §4):
// the real fleet, shown off. Three generated unit photos (matched to the
// miller-env-* reference trucks) over equipment-plate meta blocks on walnut.
// Dark text colors follow the §12 rule (home Careers values); the photo
// top-bar-grows-on-hover motif is the house photo grammar adapted to dark.
// The grid is the page's EDGE-SPANNING element: it bleeds off the LEFT
// viewport edge and stops at the content-right boundary (design-language
// "break the column" rule; the bleed direction mirrors home's capability
// rail). The hover lift lives on the inner card, never on a reveal element.
//
// Motion contract (M2, playbook §3 — the page's flagship medium):
//   p = clamp01((viewportBottom − gridTop) / gridHeight) — p hits 1.000
//   EXACTLY when the grid's bottom meets the viewport bottom (grid fully
//   visible). The three cards rise (36px + fade) on 0.50-long slices
//   completing left→right at 0.40 / 0.70 / 1.000 (thr_i = −0.10 + 0.30i) —
//   assembly is visibly in progress the whole approach and the last unit
//   settles exactly at the anchor frame. Writer: rAF-coalesced passive
//   scroll listener (§4.2) + IO-requeue (§4.3). No-JS / reduced motion:
//   var(--cwcft-p, 1) defaults rest settled; transforms gated to
//   (prefers-reduced-motion: no-preference).
//
// content: { titleId, eyebrow, title, titleEm, lead,
//            units[{ num, name, role, body, image }] }
// config:  standard sectionProps passthrough.
const SLICE_LEN = 0.5;
const SLICE_C0 = 0.4;
const SLICE_STEP = 0.3;

export function FleetShowcase02({ content, config = {} }) {
  const secRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const sec = secRef.current;
    const grid = gridRef.current;
    if (!sec || !grid) return undefined;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return undefined; // CSS default rests settled

    let raf = 0;
    const write = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = grid.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh - r.top) / r.height));
      sec.style.setProperty("--cwcft-p", p.toFixed(4));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };

    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    const io = new IntersectionObserver(queue, { rootMargin: "300px 0px" });
    io.observe(grid);

    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={secRef} className="mw-cwc-fleet" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-cwc-fleet__inner mw-inner">
        <header className="mw-cwc-fleet__head">
          <div className="mw-cwc-fleet__head-main">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label mw-section-tag-label--invert">{content.eyebrow}</span>
            </p>
            <h2 id={content.titleId} className="mw-section-title mw-cwc-fleet__title" data-reveal>
              {content.title}{" "}
              <em className="mw-cwc-fleet__title-em"><StopText>{content.titleEm}</StopText></em>
            </h2>
          </div>
          <p className="mw-cwc-fleet__lead" data-reveal>{content.lead}</p>
        </header>

        {/* The edge-spanning surface ships INSIDE a container — the VBEC
            photos-container chrome (warm panel + hairline + deep shadow),
            per logan's 2026-06-12 rule; the panel carries the left bleed.
            No data-reveal-stagger: the M2 assembly scrub IS the arrival
            (cells rise from behind the panel's clipped edge). */}
        <div className="mw-cwc-fleet__panel">
          <ul className="mw-cwc-fleet__grid" ref={gridRef}>
            {content.units.map((u, i) => (
              <li
                key={u.num}
                className="mw-cwc-fleet__cell"
                style={{ "--thr": (SLICE_C0 + i * SLICE_STEP - SLICE_LEN).toFixed(2) }}
              >
                <article className="mw-cwc-fleet__card">
                  <ParallaxPhoto src={u.image} />
                  <div className="mw-cwc-fleet__plate">
                    {/* Drafting leader drawing into the role tag — fills the
                        old marker slot with purpose and draws in with the
                        cell's own scrub slice (logan 2026-06-12: the emptied
                        slot read hollow; leaders echo the datum callouts). */}
                    <p className="mw-cwc-fleet__plate-row">
                      <span className="mw-cwc-fleet__plate-leader" aria-hidden="true" />
                      <span className="mw-cwc-fleet__role">{u.role}</span>
                    </p>
                    <h3 className="mw-cwc-fleet__name">{u.name}</h3>
                    <p className="mw-cwc-fleet__body">{u.body}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
