"use client";

import { useState } from "react";

// Vertical zigzag timeline with a single "open" milestone at a time.
// Nothing is open on mount (all titles shown); hovering/focusing a
// milestone opens its card in place of the title. Mouse leaving the
// section does NOT collapse — the last hovered item stays visible.
export function HistoryTimeline({ items }) {
  const [activeIndex, setActiveIndex] = useState(null);
  return (
    <ol className="mw-ten3__milestones">
      {items.map((item, i) => {
        const side = i % 2 === 0 ? "left" : "right";
        const isActive = i === activeIndex;
        return (
          <li
            key={i}
            data-reveal
            className={
              "mw-ten3__milestone mw-ten3__milestone--" + side + (isActive ? " is-active" : "")
            }
            onMouseEnter={() => setActiveIndex(i)}
            onFocus={() => setActiveIndex(i)}
          >
            <div className="mw-ten3__milestone-head">
              <span className="mw-ten3__milestone-dot" aria-hidden="true" />
              <span className="mw-ten3__milestone-year">{item.year}</span>
              <h4 className="mw-ten3__milestone-title">{item.title}</h4>
            </div>
            <div className="mw-ten3__milestone-bodywrap">
              <div className="mw-ten3__milestone-body">
                <span className="mw-ten3__milestone-body-title">{item.title}</span>
                <p className="mw-ten3__milestone-body-text">{item.body}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
