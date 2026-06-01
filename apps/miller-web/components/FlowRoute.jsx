"use client";

import { useEffect, useState } from "react";
import { TimelineNotifyCycle } from "./TimelineNotifyCycle";

// Owns the single clock for the §3 "how it works" route. The same `index` drives
// the cycling notification banners (right) and the moving fill along the route
// line (left) via per-stop data-state, so the line advances the instant a new
// banner appears — no drift between a CSS animation and a JS interval.
export function FlowRoute({ steps, notifications, interval = 3400 }) {
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
    <div className="mw-flow__cols">
      <ol className="mw-flow__line" data-tl-active={index} data-reveal-stagger>
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
              <p className="mw-flow__tag">
                <span className="mw-flow__tag-code">{st.num}</span>
                {st.tag}
              </p>
              <h3 className="mw-flow__name">{st.name}</h3>
              <p className="mw-flow__text">{st.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mw-flow__notify" data-reveal>
        <TimelineNotifyCycle notifications={notifications} index={index} />
      </div>
    </div>
  );
}
