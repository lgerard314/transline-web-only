// Chain-of-custody thread for /v2 — the manifest through-line.
//
// Implemented as per-section pieces (no full-page absolute element, which would
// risk horizontal overflow): each section renders a left-margin RULE (a thin
// clay hairline) and a NODE (the diamond seal that stamps in on reveal). Stacked
// down the page the rules read as one continuous thread, and the nodes are the
// documented "stages." The rule lives in an overflow-clipped section so it can
// never push horizontal scroll. Desktop-only (hidden where the gutter is tight);
// the SEMANTIC stage label lives in each section's eyebrow (visible + SR), so
// hiding the gutter glyph on mobile loses no meaning. Both are aria-hidden here.

// The continuous left-margin hairline for a section (one per section; stacked =
// the thread). Place as a direct child of a position:relative .mx-section.
export function CustodyRule() {
  return <span className="mx-rule" aria-hidden="true" />;
}

// The diamond custody node that sits on the rule at the section's eyebrow line
// and stamps (square->diamond) when the section flips data-mx-in="1".
export function CustodyNode() {
  return <span className="mx-node" aria-hidden="true" />;
}
