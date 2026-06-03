import { ServiceHero01 } from "@/components-v2/06_sections/heroes/service-hero-01";
import { ResponseTimeline01 } from "@/components-v2/06_sections/flows/response-timeline-01";
import { PhotoCardGrid01 } from "@/components-v2/06_sections/grids/photo-card-grid-01";
import { PickerGallery01 } from "@/components-v2/06_sections/pickers/picker-gallery-01";
import { DispatchCta01 } from "@/components-v2/06_sections/callouts/dispatch-cta-01";
import { RelatedRail01 } from "@/components-v2/06_sections/rails/related-rail-01";
import { emergencyResponse as c } from "@/lib/content/service-emergency-response";

export const metadata = {
  title: "Emergency Response",
  description: c.hero.lead,
  alternates: { canonical: "/industrial-services/emergency-response/" },
};

export default function EmergencyResponsePage() {
  const coverageContent = {
    eyebrow: c.coverage.eyebrow,
    title: c.coverage.title,
    titleId: c.coverage.titleId,
    lead: c.coverage.lead,
    cta: c.coverage.cta,
    items: c.coverage.provides,
    phoneHref: c.hero.emergencyHref,
    phoneDisplay: c.hero.emergencyDisplay,
  };

  const ctaContent = {
    ...c.cta,
    emergencyHref: c.hero.emergencyHref,
    emergencyDisplay: c.hero.emergencyDisplay,
  };

  return (
    <>
      <ServiceHero01 content={c.hero} config={{ media: "transparent-png", alert: true, ghostPhone: true }} />
      <ResponseTimeline01 content={c.timeline} />
      <PhotoCardGrid01 content={c.incidents} config={{ cardStyle: "thumb", head: "media-split" }} />
      <PickerGallery01 content={coverageContent} />
      <DispatchCta01 content={ctaContent} />
      <RelatedRail01 content={c.related} />
    </>
  );
}
