"use client";

import { useEffect, useRef } from "react";
import { sectionProps } from "@/components-v2/section-config";

// L3 · creed-band-01 — one panel of the creed diptych (VMV v2 §2/§3): the
// vision or mission sentence as display type with a scroll-scrubbed clay
// MARKER SWEEP behind its key phrase — the page's scroll signature. Used
// twice: vision on cream (content left), mission on dark walnut (content
// right, config.scheme "dark", config.flip true).
//
// Motion contract (playbook §3):
//   progress source — the band's rect vs the viewport;
//   p = 0 when the band's top crosses the viewport bottom; p = 1 EXACTLY
//   when the band's bottom meets the viewport bottom (band fully visible).
//   Single sweep slice: --t = clamp(0, (p − 0.35) / 0.65, 1) — the marker
//   pass is visibly in progress across the approach and lands flush at the
//   anchor frame. Writer: rAF-coalesced passive scroll listener (§4.2) +
//   IO-requeue (§4.3). Reduced motion / no-JS: var(--creed-p, 1) rests the
//   sweep complete; background-size transition additionally gated to
//   (prefers-reduced-motion: no-preference).
//
// The sweep phrase is located in the statement by string match; if absent,
// the whole statement renders unswept (content guards this).
//
// content: { titleId, cap, statement, sweep, note }
// config:  { flip = false } → mirrored layout (content right);
//          scheme passes through sectionProps (data-scheme="dark").
export function CreedBand01({ content, config = {} }) {
  const { flip = false } = config;
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
      sec.style.setProperty("--creed-p", p.toFixed(4));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };

    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    const io = new IntersectionObserver(queue, { rootMargin: "300px 0px" });
    io.observe(band);

    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const i = content.sweep ? content.statement.indexOf(content.sweep) : -1;
  const before = i >= 0 ? content.statement.slice(0, i) : content.statement;
  const after = i >= 0 ? content.statement.slice(i + content.sweep.length) : "";

  return (
    <section
      ref={secRef}
      className={`mw-vmv-creed${flip ? " mw-vmv-creed--flip" : ""}`}
      aria-labelledby={content.titleId}
      {...sectionProps(config)}
    >
      <div className="mw-vmv-creed__inner mw-inner" ref={bandRef}>
        <h2 id={content.titleId} className="mw-vmv-creed__cap" data-reveal>
          <span className="mw-vmv-creed__cap-mark" aria-hidden="true" />
          {content.cap}
        </h2>
        <p className="mw-vmv-creed__statement" data-reveal>
          {before}
          {i >= 0 && <span className="mw-vmv-creed__sweep">{content.sweep}</span>}
          {after}
        </p>
        <p className="mw-vmv-creed__note" data-reveal>{content.note}</p>
      </div>
    </section>
  );
}
