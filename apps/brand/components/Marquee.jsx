// Looping ticker. Doubles the items list so the CSS translate(-50%) cycles
// seamlessly. Presentational — no announce to assistive tech.
import { Fragment } from "react";

export function Marquee({ items }) {
  const doubled = [...items, ...items];
  return (
    <div className="tl-marquee" role="presentation">
      <div className="tl-marquee__track">
        {doubled.map((t, i) => (
          <Fragment key={i}>
            <span>{t}</span>
            <span className="dot">·</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
