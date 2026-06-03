import { ServiceHero01 } from "@/components-v2/06_sections/heroes/service-hero-01";
import { FacilityShowcase01 } from "@/components-v2/06_sections/grids/facility-showcase-01";
import { CapabilityGrid01 } from "@/components-v2/06_sections/grids/capability-grid-01";
import { DispatchCta01 } from "@/components-v2/06_sections/callouts/dispatch-cta-01";
import { RelatedRail01 } from "@/components-v2/06_sections/rails/related-rail-01";
import { IWT } from "@/lib/content/service-industrial-waste-treatment";

export const metadata = {
  title: "Industrial Waste Treatment",
  description: IWT.hero.lead,
  alternates: { canonical: "/industrial-services/industrial-waste-treatment/" },
};

export default function IndustrialWasteTreatmentPage() {
  const ctaContent = {
    ...IWT.cta,
    emergencyHref: IWT.hero.emergencyHref,
    emergencyDisplay: IWT.hero.emergencyDisplay,
  };

  return (
    <>
      <ServiceHero01 content={IWT.hero} config={{ alert: true, photoHalf: true, ghostPhone: true, reveal: true }} />
      <FacilityShowcase01 content={IWT.facility} />
      <CapabilityGrid01 content={IWT.capabilities} />
      <DispatchCta01 content={ctaContent} />
      <RelatedRail01 content={IWT.related} />
    </>
  );
}
