// Page-local atomic marks for /v2 (reimplemented, not imported from
// components-v2). All consume global tokens; none redefine them.

// The clay square "stamp" period. When an ancestor flips data-mx-in="1" it
// rotates 45deg->0deg (diamond settling into a square) — the one diamond
// micro-animation. Reduced-motion rests at the final 0deg square.
export function MxStop({ className = "" }) {
  return <span className={`mx-stop ${className}`} aria-hidden="true" />;
}

// Section eyebrow: a rotated-diamond mark + a mono label. On /v2 the eyebrow's
// diamond is the section's small announcing mark EXCEPT where a custody node
// sits at the seam (the node replaces it — see CustodyThread). Pass
// noMark to drop the diamond when a node is present in the same viewport.
export function MxEyebrow({ children, noMark = false, className = "" }) {
  return (
    <p className={`mx-eyebrow ${className}`}>
      {!noMark && <span className="mx-eyebrow__mark" aria-hidden="true" />}
      <span className="mx-eyebrow__label">{children}</span>
    </p>
  );
}

// The mono right-arrow "go" affordance.
export function MxArrow() {
  return <span className="mx-arrow" aria-hidden="true">&rarr;</span>;
}
