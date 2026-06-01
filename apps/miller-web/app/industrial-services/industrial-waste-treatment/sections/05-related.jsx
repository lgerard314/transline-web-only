import { RelatedServices } from "@/components/RelatedServices";

// §5 — Related services carousel.
export function RelatedSection() {
  return (
    <section className="mw-svc-related-sec" aria-labelledby="iwt-related-title">
      <div className="mw-svc-related-sec__inner mw-inner">
        <RelatedServices currentSlug="industrial-waste-treatment" titleId="iwt-related-title" />
      </div>
    </section>
  );
}
