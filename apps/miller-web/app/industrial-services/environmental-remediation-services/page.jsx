import { ServiceHero01 } from "@/components-v2/06_sections/heroes/service-hero-01";
import { PhotoCardGrid01 } from "@/components-v2/06_sections/grids/photo-card-grid-01";
import { PickerGallery01 } from "@/components-v2/06_sections/pickers/picker-gallery-01";
import { ProcessFlow01 } from "@/components-v2/06_sections/flows/process-flow-01";
import { VideoPicker01 } from "@/components-v2/06_sections/pickers/video-picker-01";
import { WhyBand01 } from "@/components-v2/06_sections/grids/why-band-01";
import { DispatchCta01 } from "@/components-v2/06_sections/callouts/dispatch-cta-01";
import { RelatedRail01 } from "@/components-v2/06_sections/rails/related-rail-01";
import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";

export const metadata = {
  title: "Environmental Remediation Services",
  description: c.hero.lead,
  alternates: {
    canonical: "/industrial-services/environmental-remediation-services/",
  },
};

export default function RemediationPage() {
  const whoWeServeContent = {
    eyebrow: c.whoWeServe.eyebrow,
    title: c.whoWeServe.title,
    lead: c.whoWeServe.lead,
    cta: c.whoWeServe.cta,
    items: c.whoWeServe.provides,
    titleId: c.whoWeServe.titleId,
  };

  const ctaContent = {
    ...c.cta,
    emergencyHref: c.hero.emergencyHref,
    emergencyDisplay: c.hero.emergencyDisplay,
  };

  return (
    <>
      <ServiceHero01 content={c.hero} config={{ media: "video", reveal: true, ghostPhone: true }} />
      <PhotoCardGrid01 content={c.whatWeDo} config={{ cardStyle: "wwd", head: "split", variant: "mw-rem-wwd" }} />
      <PickerGallery01 content={whoWeServeContent} config={{ serve: true }} />
      <ProcessFlow01 content={c.process} config={{ wide: true }} />
      <VideoPicker01 content={c.videos} />
      <PhotoCardGrid01 content={c.caseStudies} config={{ cardStyle: "case", head: "split", variant: "mw-rem-case" }} />
      <WhyBand01 content={c.whyChoose} config={{ statCycle: true, variant: "mw-why--rem" }} />
      <DispatchCta01 content={ctaContent} />
      <RelatedRail01 content={c.related} />
    </>
  );
}
