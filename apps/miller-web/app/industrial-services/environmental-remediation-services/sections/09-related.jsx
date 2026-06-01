import { RelatedServices } from "@/components/RelatedServices";

// §9 — Related services carousel.
export function RelatedSection() {
  return (
    <section className="mw-svc-related-sec" aria-labelledby="rem-related-title">
      <div className="mw-svc-related-sec__inner mw-inner">
        <RelatedServices currentSlug="environmental-remediation-services" titleId="rem-related-title" />
      </div>
    </section>
  );
}
