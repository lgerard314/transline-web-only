import { RelatedServices } from "@/components/RelatedServices";

// §5 — Related services carousel.
export function RelatedSection() {
  return (
    <section className="mw-svc-related-sec" aria-labelledby="pm-related-title">
      <div className="mw-svc-related-sec__inner mw-inner">
        <RelatedServices currentSlug="project-management" titleId="pm-related-title" />
      </div>
    </section>
  );
}
