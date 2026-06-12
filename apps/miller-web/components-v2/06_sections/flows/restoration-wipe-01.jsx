"use client";

import { useEffect, useRef } from "react";
import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · restoration-wipe-01 — the REM v2 scroll signature (§2): one site,
// before and after, on the same locked-off framing. The "after" (closed,
// graded, verified) wipes in left→right over the "before" (impacted
// excavation) as the stage scrolls in; a clay seam line rides the wipe
// front. Datum labels sit in a header rail ABOVE the stage (left:
// impacted / right: closed) so they never float over the wrong half.
//
// Motion contract (playbook §3):
//   progress source — the stage's rect vs the viewport;
//   p = 0 when the stage's top crosses the viewport bottom; p = 1 EXACTLY
//   when the stage's bottom meets the viewport bottom (stage fully
//   visible). Wipe slice: --t = clamp(0, (p − 0.25) / 0.75, 1) — the
//   restoration is visibly crossing the frame the whole approach and the
//   seam reaches the right edge AT the anchor. Writer: rAF-coalesced
//   passive scroll listener (§4.2) + IO-requeue (§4.3). Reduced motion /
//   no-JS: var(--remw-p, 1) rests on the CLOSED state (the standard we
//   close to); clip-path additionally gated to no-preference.
//
// content: { titleId, eyebrow, title, lead,
//            before { src, label }, after { src, label }, caption }
// config:  standard sectionProps passthrough.
export function RestorationWipe01({ content, config = {} }) {
  const secRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const sec = secRef.current;
    const stage = stageRef.current;
    if (!sec || !stage) return undefined;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return undefined;

    let raf = 0;
    const write = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = stage.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh - r.top) / r.height));
      sec.style.setProperty("--remw-p", p.toFixed(4));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };

    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    const io = new IntersectionObserver(queue, { rootMargin: "300px 0px" });
    io.observe(stage);

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
      className="mw-rem2-wipe"
      aria-labelledby={content.titleId}
      {...sectionProps(config)}
    >
      <div className="mw-rem2-wipe__inner mw-inner">
        <header className="mw-rem2-wipe__head">
          <div className="mw-rem2-wipe__head-main">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{content.eyebrow}</span>
            </p>
            <h2 id={content.titleId} className="mw-section-title mw-rem2-wipe__title" data-reveal>
              <StopText>{content.title}</StopText>
            </h2>
          </div>
          <p className="mw-rem2-wipe__lead" data-reveal>{content.lead}</p>
        </header>

        {/* The after image reveals from the LEFT, so the datum rail mirrors
            the screen mid-wipe: closed on the left, impacted on the right —
            the restoration front advances on the remaining contamination. */}
        <div className="mw-rem2-wipe__datums" aria-hidden="true" data-reveal>
          <p className="mw-rem2-wipe__datum mw-rem2-wipe__datum--after">
            <span className="mw-rem2-wipe__datum-mark mw-rem2-wipe__datum-mark--filled" />
            {content.after.label}
          </p>
          <p className="mw-rem2-wipe__datum">
            {content.before.label}
            <span className="mw-rem2-wipe__datum-mark" />
          </p>
        </div>

        <div className="mw-rem2-wipe__stage" ref={stageRef}>
          <img className="mw-rem2-wipe__img" src={content.before.src} alt="" />
          <img
            className="mw-rem2-wipe__img mw-rem2-wipe__img--after"
            src={content.after.src}
            alt=""
          />
          <span className="mw-rem2-wipe__seam" aria-hidden="true" />
        </div>

        <p className="mw-rem2-wipe__cap" aria-hidden="true">
          <span className="mw-rem2-wipe__cap-mark" />
          {content.caption}
        </p>
      </div>
    </section>
  );
}
