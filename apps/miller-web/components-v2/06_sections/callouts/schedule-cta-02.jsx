"use client";

import { useEffect, useRef, useState } from "react";
import { ScheduleForm } from "@/components/ScheduleForm";
import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · schedule-cta-02 — light closing CTA (CWC v2 §6). The page's dark
// anchor lives in the fleet section (§4), so the conversion close is a warm
// split panel per §12 ("the last section before the footer is never dark" —
// the related rail follows, also light): pitch + what-happens-next steps
// beside a white form card with a clay top edge. Reuses the shared
// ScheduleForm (composed, not forked; its dark-card label colors are
// re-bound for the light card in this page's CSS). The card's focus-within
// lift lives on the inner card, never on the scrubbed wrapper.
//
// Motion contract (logan 2026-06-12, rev 2 — centered destination): the
// form card SHIFTS UP ON SCROLL into a VERTICALLY CENTERED pose against
// the left column — the base layout carries the destination (align-self:
// center on the form column, so formColCenterY == leftColCenterY at rest);
// p = clamp01((viewportBottom − gridTop) / gridHeight); the card column
// rides translateY = (1 − p) · clamp(64px, 8vw, 112px) BELOW that centered
// slot and lands AT it EXACTLY when the grid's bottom meets the viewport
// bottom. Writer: rAF-coalesced passive scroll listener (§4.2) +
// IO-requeue (§4.3). The wrapper's old data-reveal is retired (the scrub
// IS its entrance — a reveal's fill-mode would fight the var-driven
// transform). No-JS / reduced motion: var(--cwcs-p, 1) defaults rest
// CENTERED + settled; the transform is gated to
// (prefers-reduced-motion: no-preference).
//
// content: { titleId, eyebrow, title, titleEm, body, formTitle, nextEyebrow,
//            next[{ num, name, text }] }
// config:  standard sectionProps passthrough.
export function ScheduleCta02({ content, config = {} }) {
  const secRef = useRef(null);
  const gridRef = useRef(null);
  const stepRefs = useRef([]);
  const [stepsIn, setStepsIn] = useState([]);

  useEffect(() => {
    const sec = secRef.current;
    const grid = gridRef.current;
    if (!sec || !grid) return undefined;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return undefined; // CSS default rests aligned

    let raf = 0;
    const write = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = grid.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh - r.top) / r.height));
      sec.style.setProperty("--cwcs-p", p.toFixed(4));
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

  // Per-step appear reveal — the "what happens next" list fades + rises in as
  // each step reaches full view (reversible), so the list animates instead of
  // sitting static (logan 2026-06-13 motion rule: every list gets a per-item
  // appear-reveal). Rests settled for no-JS / reduced motion.
  useEffect(() => {
    let raf = 0;
    const same = (a, b) => (a.length === b.length && a.every((v, i) => v === b[i]) ? a : b);
    const resolve = (prev, i, enter, below) => (enter ? true : below ? false : !!prev[i]);
    const update = () => {
      raf = 0;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      setStepsIn((prev) =>
        same(
          prev,
          stepRefs.current.map((el, i) => {
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
    <section ref={secRef} className="mw-cwc-sched" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-cwc-sched__inner mw-inner">
        <div className="mw-cwc-sched__grid" ref={gridRef}>
          <div className="mw-cwc-sched__panel">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{content.eyebrow}</span>
            </p>
            <h2 id={content.titleId} className="mw-section-title mw-cwc-sched__title" data-reveal>
              {content.title}{" "}
              <em className="mw-cwc-sched__title-em"><StopText>{content.titleEm}</StopText></em>
            </h2>
            <p className="mw-cwc-sched__body" data-reveal>{content.body}</p>

            {/* Mono caps label only — a diamond here made the section read
                as opening twice (consult, 2026-06-12). */}
            <p className="mw-cwc-sched__next-cap" data-reveal aria-hidden="true">
              {content.nextEyebrow}
            </p>
            <ol className="mw-cwc-sched__steps">
              {content.next.map((n, i) => (
                <li
                  key={n.name}
                  ref={(el) => { stepRefs.current[i] = el; }}
                  className={`mw-cwc-sched__step${stepsIn[i] ? " is-revealed" : ""}`}
                >
                  <span className="mw-cwc-sched__step-mark" aria-hidden="true" />
                  <div className="mw-cwc-sched__step-body">
                    <h3 className="mw-cwc-sched__step-name">{n.name}</h3>
                    <p className="mw-cwc-sched__step-text">{n.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* No data-reveal: the rise-into-center scrub IS this column's
              entrance. The focus-within lift stays on the inner card. */}
          <div className="mw-cwc-sched__form-col">
            <div className="mw-cwc-sched__card">
              <p className="mw-cwc-sched__form-title">{content.formTitle}</p>
              <ScheduleForm />
            </div>
            {/* Quiet mono microcopy, no diamond (consult, 2026-06-12). */}
            {content.formNote && (
              <p className="mw-cwc-sched__card-note">{content.formNote}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
