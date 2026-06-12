import { RelatedServices } from "@/components/RelatedServices";
import { sectionProps } from "@/components-v2/section-config";

// L3 · related-rail-02 — the CWC v2 page's close. §12 locks the related rail
// as ONE shared component everywhere, so this template (the page's own
// composition unit, sibling of related-rail-01) wraps the same
// RelatedServices rail in the same mw-svc-related-sec shell — the rail look
// stays identical across every service page by design. The extra mw-cwc-rel
// hook exists only for page-scoped seam spacing.
//
// content: { currentSlug, titleId }
// config:  { hookClass = "mw-cwc-rel" } — page-scoped seam-spacing hook;
//          defaults keep the CWC page byte-identical.
export function RelatedRail02({ content, config = {} }) {
  const { hookClass = "mw-cwc-rel" } = config;
  return (
    <section
      className={`mw-svc-related-sec ${hookClass}`}
      aria-labelledby={content.titleId}
      {...sectionProps(config)}
    >
      <div className="mw-svc-related-sec__inner mw-inner">
        <RelatedServices currentSlug={content.currentSlug} titleId={content.titleId} />
      </div>
    </section>
  );
}
