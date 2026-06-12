"use client";

import { useEffect, useRef } from "react";
import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · delivery-schedule-01 — the delivery arc as a drafting-board gantt
// (PM v2 §3, the page's scroll-tied signature). Four overlapping phase bars
// draw left-to-right across a week-tick lane grid as the board scrolls in;
// each phase's milestone diamond sets in the last stretch of its own bar,
// and the handover marker at the lane's 100% line fills exactly at p = 1.
//
// Motion contract (playbook §3):
//   progress source — the board's rect vs the viewport;
//   p = 0 when the board's top crosses the viewport bottom;
//   p = 1 EXACTLY when the board's bottom meets the viewport bottom (board
//   fully visible). Four per-bar slices: thr = 0.07 + i·0.20, length 0.33 —
//   completions land at 0.40 / 0.60 / 0.80 / 1.00, so drawing is visibly in
//   progress the whole approach and the last bar + handover settle at the
//   anchor frame. Writer: rAF-coalesced passive scroll listener (§4.2) +
//   IO-requeue (§4.3). Reduced motion / no-JS: var(--pmg-p, 1) rests the
//   board fully drawn, and the scaleX transforms are additionally gated to
//   (prefers-reduced-motion: no-preference).
//
// content: { titleId, eyebrow, title, lead, caption, handoverLabel,
//            phases[{ name, body, start, span }] }   start/span in lane %
// config:  standard sectionProps passthrough.
const SLICE_START = 0.07;
const SLICE_STEP = 0.2;

export function DeliverySchedule01({ content, config = {} }) {
  const secRef = useRef(null);
  const boardRef = useRef(null);

  useEffect(() => {
    const sec = secRef.current;
    const board = boardRef.current;
    if (!sec || !board) return undefined;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return undefined; // CSS default rests settled

    let raf = 0;
    const write = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = board.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh - r.top) / r.height));
      sec.style.setProperty("--pmg-p", p.toFixed(4));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };

    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    const io = new IntersectionObserver(queue, { rootMargin: "300px 0px" });
    io.observe(board);

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
      className="mw-pm-gantt"
      aria-labelledby={content.titleId}
      {...sectionProps(config)}
    >
      <div className="mw-pm-gantt__inner mw-inner">
        <header className="mw-pm-gantt__head">
          <div className="mw-pm-gantt__head-main">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{content.eyebrow}</span>
            </p>
            <h2 id={content.titleId} className="mw-section-title mw-pm-gantt__title" data-reveal>
              <StopText>{content.title}</StopText>
            </h2>
          </div>
          <p className="mw-pm-gantt__lead" data-reveal>{content.lead}</p>
        </header>

        <div className="mw-pm-gantt__board" ref={boardRef}>
          <ol className="mw-pm-gantt__rows">
            {content.phases.map((ph, i) => (
              <li
                key={ph.name}
                className="mw-pm-gantt__row"
                style={{ "--thr": (SLICE_START + i * SLICE_STEP).toFixed(2), "--bar-l": `${ph.start}%`, "--bar-w": `${ph.span}%` }}
              >
                <div className="mw-pm-gantt__label">
                  <h3 className="mw-pm-gantt__name">{ph.name}</h3>
                  <p className="mw-pm-gantt__body">{ph.body}</p>
                </div>
                <div className="mw-pm-gantt__lane" aria-hidden="true">
                  <span className="mw-pm-gantt__bar">
                    <span className="mw-pm-gantt__bar-fill" />
                  </span>
                  <span className="mw-pm-gantt__milestone" />
                </div>
              </li>
            ))}
          </ol>

          <div className="mw-pm-gantt__foot" aria-hidden="true">
            <p className="mw-pm-gantt__cap">
              <span className="mw-pm-gantt__cap-mark" />
              {content.caption}
            </p>
            <p className="mw-pm-gantt__handover">
              <span className="mw-pm-gantt__handover-mark" />
              {content.handoverLabel}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
