"use client";

import { useEffect, useRef } from "react";
import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · container-lineup-02 — the "any volume" story as a freight spec sheet
// (CWC v2 §2). Four generated container photos stand on a shared baseline rule
// at proportional heights (pail → drum → tote → van load), each with a
// drafting-legend meta block below the line. Replaces capacity-ladder-01 on
// this page only (the v1 template still serves nothing else, but is left
// untouched per the template-change protocol).
//
// Motion contract (playbook §3, this page's one scroll-tied moment):
//   progress source — the band's rect vs the viewport;
//   p = 0 when the band's top crosses the viewport bottom (band entering);
//   p = 1 EXACTLY when the band's bottom meets the viewport bottom (band fully
//   visible). Four per-item slices spread across the VISIBLE runway — slices
//   start at thr = 0.07 + i·0.20 and run 0.33 long, so completions land at
//   0.40 / 0.60 / 0.80 / 1.00: assembly is visibly in progress the whole
//   approach and the last container settles exactly at p = 1.000. Containers rise from behind the
//   baseline (media zone clips). Writer: rAF-coalesced passive scroll listener
//   (recipe §4.2) + IO-requeue (§4.3). Reduced motion / no-JS: var(--cwcl-p, 1)
//   defaults rest everything settled, and the CSS transform is additionally
//   gated to (prefers-reduced-motion: no-preference).
//
// content: { titleId, eyebrow, title, lead, tiers[{ num, name, spec, image, note }] }
// config:  standard sectionProps passthrough.
const SLICE_START = 0.07;
const SLICE_STEP = 0.2;

export function ContainerLineup02({ content, config = {} }) {
  const secRef = useRef(null);
  const bandRef = useRef(null);

  useEffect(() => {
    const sec = secRef.current;
    const band = bandRef.current;
    if (!sec || !band) return undefined;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return undefined; // CSS default rests settled

    let raf = 0;
    const write = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = band.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh - r.top) / r.height));
      sec.style.setProperty("--cwcl-p", p.toFixed(4));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };

    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);

    // IO-requeue: survive programmatic jumps / var clears (recipe §4.3).
    const io = new IntersectionObserver(queue, { rootMargin: "300px 0px" });
    io.observe(band);

    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={secRef}
      className="mw-cwc-line"
      aria-labelledby={content.titleId}
      {...sectionProps(config)}
    >
      <div className="mw-cwc-line__inner mw-inner">
        <header className="mw-cwc-line__head">
          <div className="mw-cwc-line__head-main">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{content.eyebrow}</span>
            </p>
            <h2 id={content.titleId} className="mw-section-title mw-cwc-line__title" data-reveal>
              <StopText>{content.title}</StopText>
            </h2>
          </div>
          <p className="mw-cwc-line__lead" data-reveal>{content.lead}</p>
        </header>

        <div className="mw-cwc-line__band" ref={bandRef}>
          <ol className="mw-cwc-line__row">
            {content.tiers.map((t, i) => (
              <li
                key={t.num}
                className="mw-cwc-line__tier"
                style={{ "--thr": (SLICE_START + i * SLICE_STEP).toFixed(2) }}
              >
                <div className="mw-cwc-line__media" data-size={t.num} aria-hidden="true">
                  <img src={t.image} alt="" loading="lazy" />
                  {t.height && (
                    <span className="mw-cwc-line__dim">
                      <span className="mw-cwc-line__dim-rule" />
                      {t.height}
                    </span>
                  )}
                </div>
                <div className="mw-cwc-line__meta">
                  <p className="mw-cwc-line__id">
                    <span className="mw-cwc-line__num" aria-hidden="true">{t.num}</span>
                    <span className="mw-cwc-line__spec">{t.spec}</span>
                  </p>
                  <h3 className="mw-cwc-line__name">{t.name}</h3>
                  <p className="mw-cwc-line__note">{t.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
