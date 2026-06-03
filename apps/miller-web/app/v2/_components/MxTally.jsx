"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { MxCountUp } from "./MxCountUp";

// Owns the WHOLE tally signature sequence as ONE component (no desynced
// observers): the figure counts up → on completion the diamond seal draws
// closed → the divider hairline draws → the supporting trio staggers in. The
// count's easing tail overlaps the seal-close so it reads as one continuous
// gesture (no dead beat). prefers-reduced-motion: MxCountUp shows the final
// value immediately and onComplete fires, jumping straight to the fully-sealed
// composition. All timeouts are cleared on unmount (no post-unmount writes).
//
// `figure` = { value, suffix }, `unit` (string), `body` (string),
// `support` = [{ value, label }], `eyebrow` (node).
export function MxTally({ eyebrow, figure, unit, body, support = [] }) {
  const [stage, setStage] = useState("counting"); // counting → sealed → divider → trio
  const timers = useRef([]);

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);

  const onCountDone = useCallback(() => {
    setStage("sealed");
    timers.current.push(setTimeout(() => setStage("divider"), 220));
    timers.current.push(setTimeout(() => setStage("trio"), 460));
  }, []);

  const seal = stage === "sealed" || stage === "divider" || stage === "trio";
  const divider = stage === "divider" || stage === "trio";
  const trio = stage === "trio";

  return (
    <div
      className="mx-tally"
      data-mx-seal={seal ? "closed" : "open"}
      data-mx-tally={trio ? "trio" : divider ? "divider" : "counting"}
    >
      {eyebrow}
      <p className="mx-tally__fig">
        {/* DiamondSeal wraps this in Phase 5; the seal stroke reads data-mx-seal. */}
        <span className="mx-tally__num">
          <MxCountUp value={figure.value} suffix={figure.suffix} onComplete={onCountDone} />
        </span>
        {unit ? <span className="mx-tally__unit">{unit}</span> : null}
      </p>
      {body ? <p className="mx-tally__body">{body}</p> : null}
      <span className="mx-tally__divider" aria-hidden="true" />
      {support.length > 0 && (
        <ul className="mx-tally__trio">
          {support.map((s, i) => (
            <li className="mx-tally__trio-item" key={i}>
              <span className="mx-tally__trio-val">{s.value}</span>
              <span className="mx-tally__trio-label">{s.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
