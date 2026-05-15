"use client";
// Accordion FAQ. Only one item open at a time; clicking the open item closes
// it (open === -1). All toggles use aria-expanded / aria-controls so SR users
// know the panel state.
import { useState } from "react";

export function FAQ({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="tl-faq">
      {items.map((it, i) => {
        const isOpen = open === i;
        const panelId = `tl-faq-panel-${i}`;
        const btnId = `tl-faq-btn-${i}`;
        return (
          <div className="tl-faq__item" key={i} data-open={isOpen ? "1" : "0"}>
            <button
              type="button"
              id={btnId}
              className="tl-faq__btn"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span className="tl-faq__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className="tl-faq__q">{it.q}</span>
              <span className="tl-faq__toggle" aria-hidden="true">+</span>
            </button>
            <div id={panelId} role="region" aria-labelledby={btnId} className="tl-faq__a">
              {it.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
