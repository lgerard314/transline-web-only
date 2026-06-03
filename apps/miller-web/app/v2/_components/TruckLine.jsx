// The one blueprint-line truck (the "vehicle"). Renders the authored vector
// (public/miller/v2/truck-line.svg) crisply at any size. On reveal it "arrives"
// via a left->right clip wipe (the truck drives into frame) — a robust, crisp
// alternative to per-path stroke-dashoffset across the SVG's 100 paths, reading
// the same: the vehicle draws/drives in. Decorative (aria-hidden). Reduced-motion
// rests fully shown (the truck verb in v2.css). Used once, at the disposition
// close (+ a faint echo at the in-transit seam).
//
// `onArrived` is wired by the disposition section to fire the "DELIVERED" stamp
// after the wipe; here we just expose the data-mx-reveal hook the driver flips.
export function TruckLine({ className = "", echo = false }) {
  return (
    <img
      className={`mx-truck ${echo ? "mx-truck--echo" : ""} ${className}`}
      src="/miller/v2/truck-line.svg"
      alt=""
      aria-hidden="true"
      width={1774}
      height={887}
      data-mx-reveal="truck"
    />
  );
}
