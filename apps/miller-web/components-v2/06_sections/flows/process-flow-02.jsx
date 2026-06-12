"use client";

import { useEffect, useState } from "react";
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
// frozen by their own internal check, fill rests at the first station).
//
// content: { titleId, eyebrow, title, lead, steps[{num,tag,name,body}],
//            notifications[{title,body}], routeStart?, routeEnd?, interval? }
// config:  standard sectionProps passthrough.
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

  useEffect(() => {
    if (cycle <= 1) return undefined;
    const mql = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    if (mql && mql.matches) return undefined; // frozen at step 0
    const id = setInterval(() => setIndex((i) => (i + 1) % cycle), interval);
    return () => clearInterval(id);
  }, [cycle, interval]);

  // Fill front sits at the active station's center within the stops track —
  // the CSS derives the exact x from --idx/--steps with gap-aware column math
  // (a plain percentage drifts off the node centers because of grid gaps).

  return (
    <section className="mw-cwc-flow" aria-labelledby={content.titleId} {...sectionProps(config)}>
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

        <div
          className="mw-cwc-flow__route"
          data-arrived={index === steps.length - 1 ? "1" : undefined}
          style={{ "--idx": index, "--steps": steps.length }}
          data-reveal
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
                >
                  <span className="mw-cwc-flow__node" aria-hidden="true">{st.num}</span>
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
