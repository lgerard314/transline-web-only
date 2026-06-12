"use client";

import { useEffect, useRef, useState } from "react";
import { StopText } from "@/components/StopText";
import { TimelineNotifyCycle } from "@/components/TimelineNotifyCycle";
import { sectionProps } from "@/components-v2/section-config";

// L3 · closure-ladder-01 — assessment to closure as a vertical ladder
// (REM v2 §4). Five steps descend a hairline rail with diamond stations;
// one clock advances the active step AND the cycling notification feed
// (TimelineNotifyCycle composed, not forked — the device logan loves) in
// lock-step, single-clock pattern. The rail fill grows to the active
// station. Reduced motion freezes the clock at step 0 with the feed's
// first banner showing.
//
// content: { titleId, eyebrow, title, lead,
//            steps[{ tag, name, body }], notifications[{ title, body }] }
// config:  standard sectionProps passthrough.
const STEP_MS = 3600;

export function ClosureLadder01({ content, config = {} }) {
  const [index, setIndex] = useState(0);
  const steps = content.steps;

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return undefined; // frozen at step 0
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % steps.length);
    }, STEP_MS);
    return () => clearInterval(id);
  }, [steps.length]);

  return (
    <section
      className="mw-rem2-proc"
      aria-labelledby={content.titleId}
      style={{ "--idx": index, "--steps": steps.length }}
      {...sectionProps(config)}
    >
      <div className="mw-rem2-proc__inner mw-inner">
        <header className="mw-rem2-proc__head">
          <div>
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{content.eyebrow}</span>
            </p>
            <h2 id={content.titleId} className="mw-section-title mw-rem2-proc__title" data-reveal>
              <StopText>{content.title}</StopText>
            </h2>
          </div>
          <p className="mw-rem2-proc__lead" data-reveal>{content.lead}</p>
        </header>

        <div className="mw-rem2-proc__grid">
          <ol className="mw-rem2-proc__ladder" data-reveal>
            <span className="mw-rem2-proc__rail" aria-hidden="true" />
            <span className="mw-rem2-proc__fill" aria-hidden="true" />
            {steps.map((s, i) => (
              <li
                key={s.name}
                className="mw-rem2-proc__step"
                data-active={i === index ? "1" : undefined}
                data-done={i < index ? "1" : undefined}
              >
                <span className="mw-rem2-proc__station" aria-hidden="true" />
                <div className="mw-rem2-proc__step-body">
                  <p className="mw-rem2-proc__step-tag">{s.tag}</p>
                  <h3 className="mw-rem2-proc__step-name">{s.name}</h3>
                  <p className="mw-rem2-proc__step-text">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mw-rem2-proc__feed" data-reveal>
            <p className="mw-rem2-proc__feed-cap" aria-hidden="true">
              <span className="mw-rem2-proc__feed-cap-mark" />
              Site feed
            </p>
            <TimelineNotifyCycle notifications={content.notifications} index={index} />
          </div>
        </div>
      </div>
    </section>
  );
}
