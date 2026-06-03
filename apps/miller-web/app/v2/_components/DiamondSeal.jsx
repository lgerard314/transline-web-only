// The medium-tier diamond SEAL that frames the one crescendo number (the tally).
// A rotated-square outline (radiused joints, matching the logomark) that "draws
// closed" on its border when an ancestor flips data-mx-seal="closed" (driven by
// MxTally on count-complete) — the memorable micro-moment. Carries seal texture
// (an embossed inset edge) and a mono micro-legend so it reads as a notary/
// certification seal, not just a scaled logomark.
//
// Geometry: a rotated square around a wide numeral wastes corners and can
// overflow at small widths, so below 600px the rotated frame is dropped for a
// bottom "seal bar" (see v2.css mobile fallback). Reduced-motion: the border
// rests fully drawn.
//
// `legend` = the micro-text ringing the seal (default "ON THE RECORD").
export function DiamondSeal({ children, legend = "ON THE RECORD" }) {
  return (
    <span className="mx-seal">
      <svg className="mx-seal__frame" viewBox="0 0 200 200" aria-hidden="true" preserveAspectRatio="none">
        {/* rotated square (diamond) with slightly radiused joints */}
        <rect className="mx-seal__edge" x="40" y="40" width="120" height="120" rx="10"
          transform="rotate(45 100 100)" pathLength="100" />
      </svg>
      <span className="mx-seal__inner">{children}</span>
      <span className="mx-seal__legend" aria-hidden="true">{legend}</span>
    </span>
  );
}
