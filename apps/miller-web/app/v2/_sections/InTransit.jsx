import { TruckLine } from "../_components/TruckLine";

// The Facility→History seam: the manifest "in transit" beat. A short, LOCAL
// horizontal corridor — a hairline draws left→right on reveal and a faint truck
// echo drives across it, between two labelled stages (TREATMENT → RECORD). This
// is deliberately a DRAW-ON-REVEAL annotation, NOT a scroll-scrubbed bar: a
// scroll-bound thread reads as a redundant second scrollbar (the lesson from the
// reverted / experiment). Read as a document annotation of a shipment moving
// between custody stages, it stays storytelling, not navigation. overflow-x is
// clipped so the wipe can never push horizontal scroll. Reduced-motion: drawn.
export function InTransit() {
  return (
    <section className="mx-transit mx-section--tight mx-dark-2 mx-section" aria-label="In transit">
      <div className="mx-inner mx-transit__inner">
        <span className="mx-transit__end mx-transit__end--from">04 · TREATMENT</span>
        <span className="mx-transit__track">
          <span className="mx-transit__label">· IN TRANSIT ·</span>
          <span className="mx-transit__truck"><TruckLine echo /></span>
          <span className="mx-transit__line" data-mx-reveal="transit" aria-hidden="true" />
        </span>
        <span className="mx-transit__end mx-transit__end--to">RECORD →</span>
      </div>
    </section>
  );
}
