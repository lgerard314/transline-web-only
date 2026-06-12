"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · service-hero-02 — light masthead with a chain-of-custody strip (CWC v2,
// the first interior v2 page). Distinct from service-hero-01: the photo bleed
// runs the full hero height on the right, and a manifest-style custody strip
// (your dock → Miller truck → VBEC gate) closes the hero base — the page's
// "documented route" signature. §12 rules hold: light surface, ONE eyebrow,
// no breadcrumb, and a SINGLE primary CTA (the 24/7 emergency pair is
// home + emergency-page-only per the locked hero rule, logan 2026-06-12).
//
// content: { titleId, eyebrow, title, titleEm, lead, photo,
//            cta { label, href },
//            custody { nodes[{ num, label }] } }
// config:  { reveal = true } — standard data-reveal entrances on/off.

// Truck glyph — the same inline SVG as process-flow-02's TruckGlyph (copied
// inline per template isolation; cab on the right, so it faces the direction
// of travel for the dock→gate run).
const TruckGlyph = (
  <svg viewBox="0 0 48 30" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
    <path d="M3 6 H27 V22 H3 Z" />
    <path d="M27 11 H35 L41 17 V22 H27 Z" />
    <path d="M1 22 H46" />
    <circle cx="11" cy="23.5" r="3" />
    <circle cx="35" cy="23.5" r="3" />
  </svg>
);

export function ServiceHero02({ content, config = {} }) {
  const { reveal = true } = config;
  const rv = reveal ? { "data-reveal": true } : {};

  const custodyRef = useRef(null);
  const dockLabelRef = useRef(null);
  const gateMarkRef = useRef(null);

  // MOTION CONTRACT — custody truck scrub (§4.2 rAF-coalesced passive writer).
  // The truck makes the strip's SEMANTIC journey (your dock → VBEC gate) as the
  // page scrolls: p = clamp01(scrollY / (custodyStripTopDocY − fixedChromeH)),
  // so it DEPARTS the dock at page top (scrollY 0 → p 0) and ARRIVES at the
  // gate EXACTLY when the strip's top edge meets the bottom of the fixed
  // header chrome — the strip's LAST fully-visible frame, so arrival is
  // visible. (The owner's anchor was "strip top reaches the viewport top";
  // with the site's 116px fixed topbar+nav that exact frame is occluded —
  // perceptible-or-it-doesn't-exist moves the anchor up by the chrome height.
  // Clamp keeps p = 1.000 from there through strip-top == viewport-top, and
  // with no fixed header the formula degrades to the original.) Truck x
  // interpolates from the dock LABEL's center to the gate DIAMOND's center —
  // both measured from live rects (gap-aware; re-measured on resize), never
  // eyeballed percentages. The element is aria-hidden and absolutely positioned
  // (zero layout shift). Defaults are journey-complete: the CSS rests the truck
  // AT the gate (--cwch-p: 1), so no-JS renders it settled, and under
  // prefers-reduced-motion: reduce the writer never attaches — same settled
  // pose, no motion.
  useEffect(() => {
    const strip = custodyRef.current;
    const dock = dockLabelRef.current;
    const gate = gateMarkRef.current;
    if (!strip || !dock || !gate) return undefined;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return undefined; // truck rests at the gate (CSS default p = 1)

    let raf = 0;
    const measure = () => {
      // Same-frame viewport rects — the difference is the document-space
      // distance between the dock label center and the gate diamond center.
      const d = dock.getBoundingClientRect();
      const g = gate.getBoundingClientRect();
      const dist = g.left + g.width / 2 - (d.left + d.width / 2);
      strip.style.setProperty("--cwch-d", `${dist.toFixed(2)}px`);
    };
    // Bottom edge of the fixed site chrome (read-only measurement) — 0 when
    // the header isn't fixed, restoring the plain viewport-top anchor.
    const chromeBottom = () => {
      const h = document.querySelector("header");
      if (!h) return 0;
      const pos = getComputedStyle(h).position;
      return pos === "fixed" || pos === "sticky" ? Math.max(0, h.getBoundingClientRect().bottom) : 0;
    };
    const write = () => {
      raf = 0;
      const y = window.scrollY;
      const stripTopDoc = strip.getBoundingClientRect().top + y;
      const runway = stripTopDoc - chromeBottom();
      const p = runway > 0 ? Math.min(1, Math.max(0, y / runway)) : 1;
      strip.style.setProperty("--cwch-p", p.toFixed(4));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };
    const onResize = () => {
      measure();
      queue();
    };

    measure();
    write();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const last = content.custody.nodes.length - 1;

  return (
    <section className="mw-cwc-hero" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-cwc-hero__main">
        <div className="mw-cwc-hero__inner mw-inner">
          <div className="mw-cwc-hero__content">
            <p className="mw-section-tag" {...rv} aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{content.eyebrow}</span>
            </p>
            <h1 id={content.titleId} className="mw-cwc-hero__title" {...rv}>
              {content.title}
              <br />
              <span className="mw-cwc-hero__title-em"><StopText>{content.titleEm}</StopText></span>
            </h1>
            <p className="mw-cwc-hero__lead" {...rv}>{content.lead}</p>
            <div className="mw-cwc-hero__ctas" {...rv}>
              <Link href={content.cta.href} className="mw-cta mw-cta--solid">
                {content.cta.label} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mw-cwc-hero__bleed" aria-hidden="true">
          <img className="mw-cwc-hero__photo" src={content.photo} alt="" />
        </div>
      </div>

      <div ref={custodyRef} className="mw-cwc-hero__custody">
        <div className="mw-cwc-hero__custody-inner mw-inner">
          {/* Stagger on the route list: the three custody nodes cascade
              left→right (the strip's surface stays put; only the nodes
              arrive) — a SMALL per the page's motion budget. */}
          <ol
            className="mw-cwc-hero__custody-route"
            aria-label="Chain of custody"
            {...(reveal ? { "data-reveal-stagger": true } : {})}
          >
            {/* No sequential mono numerals (banned in the eyebrow register,
                logan 2026-06-12) — the diamond + label carry each node. */}
            {content.custody.nodes.map((n, i) => (
              <li key={n.num} className="mw-cwc-hero__custody-node">
                <span
                  ref={i === last ? gateMarkRef : undefined}
                  className="mw-cwc-hero__custody-mark"
                  aria-hidden="true"
                />
                <span
                  ref={i === 0 ? dockLabelRef : undefined}
                  className="mw-cwc-hero__custody-label"
                >
                  {n.label}
                </span>
                {i === last ? (
                  <span className="mw-cwc-hero__custody-truck" aria-hidden="true">{TruckGlyph}</span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
