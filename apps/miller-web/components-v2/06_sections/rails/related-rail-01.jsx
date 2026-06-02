import { RelatedServices } from "@/components/RelatedServices";
import { sectionProps } from "@/components-v2/section-config";

// RelatedRail01 — thin server-component wrapper around RelatedServices.
// Reproduces the mw-svc-related-sec section verbatim from emergency-response
// and customer-waste-collection 06-related.jsx (identical shape in both).
// content: { currentSlug, titleId }
export function RelatedRail01({ content, config = {} }) {
  return (
    <section className="mw-svc-related-sec" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-svc-related-sec__inner mw-inner">
        <RelatedServices currentSlug={content.currentSlug} titleId={content.titleId} />
      </div>
    </section>
  );
}
