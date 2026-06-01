"use client";

import { useEffect, useState } from "react";
import { TimelineNotifyCycle } from "./TimelineNotifyCycle";
import { StopText } from "./StopText";

// Owns the single notification clock for the "when you call" timeline. The same
// `index` drives both the cycling banners and the axis fill (via data-tl-active
// on the <ol>), so a step's line expands the instant its notification appears —
// no paint-vs-hydration drift between a CSS animation and a JS interval.
export function ResponseTimeline({
  eyebrow,
  title,
  lead,
  steps,
  notifications,
  titleId,
  interval = 3000,
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!notifications || notifications.length <= 1) return undefined;
    const mql = window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    if (mql && mql.matches) return undefined; // honor reduced motion: freeze at step 0
    const id = setInterval(
      () => setIndex((i) => (i + 1) % notifications.length),
      interval,
    );
    return () => clearInterval(id);
  }, [notifications, interval]);

  return (
    <>
      <div className="mw-svc-tl-sec__intro">
        <div className="mw-svc-tl-sec__intro-copy">
          <header className="mw-svc-tl-sec__head" data-reveal>
            <div>
              <p className="mw-section-tag" aria-hidden="true">
                <span className="mw-section-tag-mark" />
                <span className="mw-section-tag-label">{eyebrow}</span>
              </p>
              <h2 id={titleId} className="mw-section-title">
                <StopText>{title}</StopText>
              </h2>
            </div>
          </header>
          <p className="mw-svc-tl-sec__lead" data-reveal>{lead}</p>
        </div>
        <TimelineNotifyCycle notifications={notifications} index={index} />
      </div>

      <ol className="mw-svc-tl" data-reveal-stagger data-tl-active={index}>
        {steps.map((st) => (
          <li key={st.name} className="mw-svc-tl__stage">
            <span className="mw-svc-tl__time">{st.t}</span>
            <span className="mw-svc-tl__axis" aria-hidden="true">
              <span className="mw-svc-tl__node" />
            </span>
            <h3 className="mw-svc-tl__name">{st.name}</h3>
            <p className="mw-svc-tl__body">{st.body}</p>
          </li>
        ))}
      </ol>
    </>
  );
}
