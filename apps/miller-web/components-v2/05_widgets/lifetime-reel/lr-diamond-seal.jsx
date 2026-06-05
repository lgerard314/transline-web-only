// The medium-tier diamond SEAL that frames the one crescendo number (the tally).
// A rotated-square outline (radiused joints, matching the logomark) that "draws
// closed" on its border when an ancestor flips data-mw-lr-seal="closed" — the
// memorable micro-moment. Carries seal texture (an embossed inset edge) and a
// mono micro-legend so it reads as a notary/certification seal, not just a
// scaled logomark.
//
// Geometry: a rotated square around a wide numeral wastes corners and can
// overflow at small widths, so below 600px the rotated frame is dropped for a
// bottom "seal bar" (see CSS mobile fallback). Reduced-motion: the border
// rests fully drawn.
//
// `draw` controls WHERE the stroke begins and which way it travels so the reel's
// single "growing line" starts each diamond EXACTLY at the vertex the connector
// lands on. All non-default diamonds are explicit r=10 arc paths (identical
// geometry to the rect, but able to begin at an apex — a rotated <rect> can only
// begin at a corner TANGENT, which would draw the apex last and leave a gap):
//   "default" — rect, top vertex, clockwise (hero seal; unchanged).
//   "right"   — closed loop, starts & ends at the RIGHT apex, clockwise (R→B→L→T).
//   "left"    — closed loop, starts & ends at the LEFT apex, clockwise (L→T→R→B).
//   "split"   — TWO half loops drawn at once from the LEFT and RIGHT apexes,
//               meeting at top & bottom (each half-speed, landing together).
//   "lr"      — TWO half loops both starting at the LEFT apex (= 50% height) and
//               sweeping the SAME way, left→right: one up-and-right over the top,
//               one down-and-right under the bottom, meeting at the RIGHT apex.
//               NOTE: on desktop the reel hides these per-diamond edges and draws
//               the whole chain (diamonds + connectors) in ONE unified SVG so the
//               stroke, gradient, and seams all match (see LifetimeReel). This "lr"
//               edge is the MOBILE fallback (one diamond at a time, no chain).
// Shared vertices (viewBox 200): apex L 19.29 / R 180.71 / T (100,19.29) /
// B (100,180.71); corner tangents at ±7.07 from each apex along the edges.
//
// `legend` = the micro-text ringing the seal (default "ON THE RECORD").
const LR_TOP = "M 19.29 100 A 10 10 0 0 1 22.22 92.93 L 92.93 22.22 A 10 10 0 0 1 107.07 22.22 L 177.78 92.93 A 10 10 0 0 1 180.71 100";
const LR_BOTTOM = "M 19.29 100 A 10 10 0 0 0 22.22 107.07 L 92.93 177.78 A 10 10 0 0 0 107.07 177.78 L 177.78 107.07 A 10 10 0 0 0 180.71 100";

export function LrDiamondSeal({ children, legend = "ON THE RECORD", draw = "default" }) {
  return (
    <span className="mw-lr-seal">
      <svg className="mw-lr-seal__frame" viewBox="0 0 200 200" aria-hidden="true" preserveAspectRatio="none">
        {draw === "lr" ? (
          <>
            {/* both halves, left apex → right apex (mobile fallback edge) */}
            <path className="mw-lr-seal__edge" pathLength="100" d={LR_TOP} />
            <path className="mw-lr-seal__edge" pathLength="100" d={LR_BOTTOM} />
          </>
        ) : draw === "split" ? (
          <>
            {/* bottom half: left apex → bottom → right apex */}
            <path className="mw-lr-seal__edge" pathLength="100"
              d="M 19.29 100 A 10 10 0 0 0 22.22 107.07 L 92.93 177.78 A 10 10 0 0 0 107.07 177.78 L 177.78 107.07 A 10 10 0 0 0 180.71 100" />
            {/* top half: right apex → top → left apex */}
            <path className="mw-lr-seal__edge" pathLength="100"
              d="M 180.71 100 A 10 10 0 0 0 177.78 92.93 L 107.07 22.22 A 10 10 0 0 0 92.93 22.22 L 22.22 92.93 A 10 10 0 0 0 19.29 100" />
          </>
        ) : draw === "right" ? (
          /* closed loop, starts & ends at the RIGHT apex, clockwise R→B→L→T */
          <path className="mw-lr-seal__edge" pathLength="100"
            d="M 180.71 100 A 10 10 0 0 1 177.78 107.07 L 107.07 177.78 A 10 10 0 0 1 92.93 177.78 L 22.22 107.07 A 10 10 0 0 1 22.22 92.93 L 92.93 22.22 A 10 10 0 0 1 107.07 22.22 L 177.78 92.93 A 10 10 0 0 1 180.71 100 Z" />
        ) : draw === "left" ? (
          /* closed loop, starts & ends at the LEFT apex, clockwise L→T→R→B */
          <path className="mw-lr-seal__edge" pathLength="100"
            d="M 19.29 100 A 10 10 0 0 1 22.22 92.93 L 92.93 22.22 A 10 10 0 0 1 107.07 22.22 L 177.78 92.93 A 10 10 0 0 1 177.78 107.07 L 107.07 177.78 A 10 10 0 0 1 92.93 177.78 L 22.22 107.07 A 10 10 0 0 1 19.29 100 Z" />
        ) : (
          /* rotated square (diamond) with slightly radiused joints — hero seal */
          <rect className="mw-lr-seal__edge" x="40" y="40" width="120" height="120" rx="10"
            transform="rotate(45 100 100)" pathLength="100" />
        )}
      </svg>
      <span className="mw-lr-seal__inner">{children}</span>
      <span className="mw-lr-seal__legend" aria-hidden="true">{legend}</span>
    </span>
  );
}
