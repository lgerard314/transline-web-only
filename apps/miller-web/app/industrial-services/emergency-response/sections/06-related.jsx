import { RelatedServices } from "@/components/RelatedServices";

// §6 — Related services carousel.
export function RelatedSection() {
  return (
    <section className="mw-svc-related-sec" aria-labelledby="er-related-title">
      <div className="mw-svc-related-sec__inner mw-inner">
        <RelatedServices currentSlug="emergency-response" titleId="er-related-title" />
      </div>
    </section>
  );
}
