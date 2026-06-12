"use client";

import { useEffect, useRef, useState } from "react";
import { StopText } from "@/components/StopText";
import { TimelineNotifyCycle } from "@/components/TimelineNotifyCycle";
import { sectionProps } from "@/components-v2/section-config";

// L3 · process-flow-02 — the dock → VBEC route as a live transport line
// (CWC v2 §3). Rebuilt from process-flow-01's bones; this template owns its
// own single clock (the FlowRoute pattern) so the cycling notification
// banners (shared TimelineNotifyCycle — composed, not forked), the route-line
// fill, the riding truck marker, and the step-card states can never drift.
// The route is bookended by the same custody terminals the hero strip
// introduces (your dock / VBEC gate) — the page's "documented route" theme.
//
// Reduced motion: the interval never starts (frozen at step 01, banners
// frozen by their own internal check, fill rests at the first station), and
// the assembly scrub's writer never attaches (CSS defaults rest settled).
//
// Motion contract (M3, playbook §3 — ARRIVAL is scroll-scrubbed, STATE stays
// on the clock; the two consume different variables so they can never fight):
//   p = clamp01((viewportBottom − routeTop) / routeHeight) — p hits 1.000
//   EXACTLY when the route row's bottom meets the viewport bottom (row fully
//   visible). The rail draws left→right consuming p directly (clip-path
//   inset draw); the start terminal lands at p=0.10; each station (li) rises
//   on a 0.28-long slice completing at 0.225/0.475/0.725/0.975 — just after
//   the draw front passes its node center (12.5/37.5/62.5/87.5%), so the
//   line visibly REACHES a station before the station pops; the end terminal
//   lands at exactly p=1.000; the clock's fill + truck fade in on the tail
//   slice (0.85→1). Writer: rAF-coalesced passive scroll listener (§4.2) +
//   IO-requeue (§4.3); var(--cwcf-p, 1) defaults rest settled for no-JS and
//   reduced motion, transforms gated to (prefers-reduced-motion: no-preference).
//
// content: { titleId, eyebrow, title, lead, steps[{num,tag,name,body}],
//            notifications[{title,body}], routeStart?, routeEnd?, interval? }
// config:  standard sectionProps passthrough.
const ARRIVE_LEN = 0.28;
const ARRIVE_C0 = 0.225;
const ARRIVE_STEP = 0.25;
const TruckGlyph = (
  <svg viewBox="0 0 48 30" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
    <path d="M3 6 H27 V22 H3 Z" />
    <path d="M27 11 H35 L41 17 V22 H27 Z" />
    <path d="M1 22 H46" />
    <circle cx="11" cy="23.5" r="3" />
    <circle cx="35" cy="23.5" r="3" />
  </svg>
);

export function ProcessFlow02({ content, config = {} }) {
  const steps = content.steps;
  const [index, setIndex] = useState(0);
  const cycle = content.notifications?.length || steps.length;
  const interval = content.interval ?? 3400;
  const secRef = useRef(null);
  const routeRef = useRef(null);

  useEffect(() => {
    if (cycle <= 1) return undefined;
    const mql = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    if (mql && mql.matches) return undefined; // frozen at step 0
    const id = setInterval(() => setIndex((i) => (i + 1) % cycle), interval);
    return () => clearInterval(id);
  }, [cycle, interval]);

  // M3 assembly writer — see the motion contract above.
  useEffect(() => {
    const sec = secRef.current;
    const route = routeRef.current;
    if (!sec || !route) return undefined;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return undefined; // CSS default rests settled

    let raf = 0;
    const write = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = route.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh - r.top) / r.height));
      sec.style.setProperty("--cwcf-p", p.toFixed(4));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };

    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    const io = new IntersectionObserver(queue, { rootMargin: "300px 0px" });
    io.observe(route);

    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Fill front sits at the active station's center within the stops track —
  // the CSS derives the exact x from --idx/--steps with gap-aware column math
  // (a plain percentage drifts off the node centers because of grid gaps).

  return (
    <section ref={secRef} className="mw-cwc-flow" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-cwc-flow__inner mw-inner">
        <div className="mw-cwc-flow__intro">
          <header className="mw-cwc-flow__head">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{content.eyebrow}</span>
            </p>
            <h2 id={content.titleId} className="mw-section-title mw-cwc-flow__title" data-reveal>
              <StopText>{content.title}</StopText>
            </h2>
            <p className="mw-cwc-flow__lead" data-reveal>{content.lead}</p>
          </header>
          <div className="mw-cwc-flow__notify" data-reveal>
            <div className="mw-cwc-flow__feed">
              <p className="mw-cwc-flow__feed-cap" aria-hidden="true">
                <span className="mw-cwc-flow__feed-mark" />
                Dispatch feed
              </p>
              <TimelineNotifyCycle notifications={content.notifications} index={index} />
            </div>
          </div>
        </div>

        {/* No data-reveal here: the M3 assembly scrub IS the route's arrival. */}
        <div
          ref={routeRef}
          className="mw-cwc-flow__route"
          data-arrived={index === steps.length - 1 ? "1" : undefined}
          style={{ "--idx": index, "--steps": steps.length }}
        >
          <p className="mw-cwc-flow__terminal mw-cwc-flow__terminal--start">
            <span className="mw-cwc-flow__terminal-mark" aria-hidden="true" />
            {content.routeStart}
          </p>

          <div className="mw-cwc-flow__track">
            <span className="mw-cwc-flow__rail" aria-hidden="true" />
            <span className="mw-cwc-flow__fill" aria-hidden="true" />
            <span className="mw-cwc-flow__truck" aria-hidden="true">{TruckGlyph}</span>
            <ol className="mw-cwc-flow__stops">
              {steps.map((st, i) => (
                <li
                  key={st.num}
                  className="mw-cwc-flow__stop"
                  data-state={i < index ? "done" : i === index ? "active" : "todo"}
                  style={{ "--thr": (ARRIVE_C0 + i * ARRIVE_STEP - ARRIVE_LEN).toFixed(3) }}
                >
                  {/* Diamond node glyph — sequential mono numerals are banned
                      in the eyebrow register (logan 2026-06-12). */}
                  <span className="mw-cwc-flow__node" aria-hidden="true">
                    <span className="mw-cwc-flow__node-mark" />
                  </span>
                  <div className="mw-cwc-flow__card">
                    <p className="mw-cwc-flow__tag">{st.tag}</p>
                    <h3 className="mw-cwc-flow__name">{st.name}</h3>
                    <p className="mw-cwc-flow__text">{st.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <p className="mw-cwc-flow__terminal mw-cwc-flow__terminal--end">
            <span className="mw-cwc-flow__terminal-mark" aria-hidden="true" />
            {content.routeEnd}
          </p>
        </div>
      </div>
    </section>
  );
}
