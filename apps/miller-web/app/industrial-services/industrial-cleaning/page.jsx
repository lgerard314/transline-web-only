import { ServiceHero01 } from "@/components-v2/06_sections/heroes/service-hero-01";
import { PhotoCardGrid01 } from "@/components-v2/06_sections/grids/photo-card-grid-01";
import { FleetSplit01 } from "@/components-v2/06_sections/splits/fleet-split-01";
import { WhyBand01 } from "@/components-v2/06_sections/grids/why-band-01";
import { DispatchCta01 } from "@/components-v2/06_sections/callouts/dispatch-cta-01";
import { RelatedRail01 } from "@/components-v2/06_sections/rails/related-rail-01";
import { industrialCleaning as c } from "@/lib/content/service-industrial-cleaning";

export const metadata = {
  title: "Industrial Cleaning",
  description: c.hero.lead,
  alternates: { canonical: "/industrial-services/industrial-cleaning/" },
};

export default function IndustrialCleaningPage() {
  const ctaContent = {
    ...c.cta,
    emergencyHref: c.hero.emergencyHref,
    emergencyDisplay: c.hero.emergencyDisplay,
  };

  return (
    <>
      <ServiceHero01 content={c.hero} config={{ alert: true, photoHalf: true, ghostPhone: true, reveal: true }} />
      <PhotoCardGrid01 content={c.capabilities} config={{ cardStyle: "thumb", head: "split" }} />
      <FleetSplit01 content={c.fleet} />
      <WhyBand01 content={c.why} config={{ marker: "number", columns: 4 }} />
      <DispatchCta01 content={ctaContent} />
      <RelatedRail01 content={c.related} />
    </>
  );
}
