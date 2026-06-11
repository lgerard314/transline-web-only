"use client";
// Phone-only "view full record" control for the history milestone list. On mount it
// adds [data-trunc] to the sibling list — CSS (home/history.css) hides items 6+ and
// shows this button ONLY at ≤700px while that attribute is present, so wider surfaces
// and no-JS/SSR render the full record untouched. Tapping removes the attribute (the
// remaining milestones then slide in via the existing <TimelineReveal> driver as they
// gain room) and moves focus to the list so keyboard/AT users land where the new
// content begins.

import { useEffect, useRef } from "react";

export function TimelineViewMore({ listId, moreCount = 0 }) {
  const btnRef = useRef(null);

  useEffect(() => {
    const list = document.getElementById(listId);
    if (!list) return;
    list.setAttribute("data-trunc", "");
    return () => list.removeAttribute("data-trunc");
  }, [listId]);

  const expand = () => {
    const list = document.getElementById(listId);
    if (!list) return;
    list.removeAttribute("data-trunc");
    list.focus({ preventScroll: true });
  };

  return (
    <button
      type="button"
      className="mw-ten3__more"
      ref={btnRef}
      onClick={expand}
      aria-expanded="false"
      aria-controls={listId}
    >
      <span className="mw-ten3__more-label">View full record{moreCount > 0 ? ` · ${moreCount} more` : ""}</span>
      <span className="mw-ten3__more-chev" aria-hidden="true" />
    </button>
  );
}
