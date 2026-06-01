"use client";

import { useEffect, useState } from "react";
import { StopText } from "./StopText";
import { TimelineNotifyCycle } from "./TimelineNotifyCycle";

// Owns the single clock for the service "process / how it works" route. The same
// `index` drives the cycling notification banners (intro, right) and the moving
// fill along the route line (below) via per-stop data-state, so the line advances
// the instant a new banner appears — no drift between a CSS animation and a JS
// interval.
//
// Layout mirrors the emergency-response "when you call" timeline: on desktop the
// banners sit in the right column of a two-column intro ABOVE the route line; at
// ≤900px the intro dissolves (display:contents) and the banners become a sticky
// top band while the now-vertical steps scroll beneath them. The head copy is
// rendered here (not in the page section) so the intro can own both columns.
export function FlowRoute({
  eyebrow,
  title,
  lead,
  route,
  steps,
  notifications,
  titleId,
  interval = 3400,
}) {
  const [index, setIndex] = useState(0);
  const cycle = notifications?.length || steps.length;

  useEffect(() => {
    if (cycle <= 1) return undefined;
    const mql = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    if (mql && mql.matches) return undefined; // reduced motion: freeze at step 0
    const id = setInterval(() => setIndex((i) => (i + 1) % cycle), interval);
    return () => clearInterval(id);
  }, [cycle, interval]);

  return (
    <>
      <div className="mw-flow__intro">
        <header className="mw-flow__head">
          <p className="mw-section-tag" data-reveal aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label mw-section-tag-label--invert">{eyebrow}</span>
          </p>
          <h2 id={titleId} className="mw-section-title mw-flow__title" data-reveal>
            <StopText>{title}</StopText>
          </h2>
          <p className="mw-flow__lead" data-reveal>{lead}</p>
          <p className="mw-flow__route" data-reveal aria-hidden="true">
            <span className="mw-flow__route-mark" />
            {route}
          </p>
        </header>
        <div className="mw-flow__notify" data-reveal>
          <TimelineNotifyCycle notifications={notifications} index={index} />
        </div>
      </div>

      <ol
        className="mw-flow__line"
        data-tl-active={index}
        data-reveal-stagger
        style={{ "--mw-flow-cols": steps.length }}
      >
        {steps.map((st, i) => (
          <li
            key={st.num}
            className="mw-flow__stop"
            data-terminal={i === steps.length - 1 ? "1" : undefined}
            data-state={i < index ? "done" : i === index ? "active" : "todo"}
          >
            <div className="mw-flow__track" aria-hidden="true">
              <span className="mw-flow__node">{st.num}</span>
            </div>
            <div className="mw-flow__card">
              <p className="mw-flow__tag">{st.tag}</p>
              <h3 className="mw-flow__name">{st.name}</h3>
              <p className="mw-flow__text">{st.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
