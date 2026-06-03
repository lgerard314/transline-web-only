import { ServiceHero01 } from "@/components-v2/06_sections/heroes/service-hero-01";
import { WhyBand01 } from "@/components-v2/06_sections/grids/why-band-01";
import { NumberedCardGrid01 } from "@/components-v2/06_sections/grids/numbered-card-grid-01";
import { DispatchCta01 } from "@/components-v2/06_sections/callouts/dispatch-cta-01";
import { RelatedRail01 } from "@/components-v2/06_sections/rails/related-rail-01";
import { projectManagement as c } from "@/lib/content/service-project-management";

export const metadata = {
  title: "Project Management",
  description: c.hero.lead,
  alternates: { canonical: "/industrial-services/project-management/" },
};

export default function ProjectManagementPage() {
  const groupContent = {
    eyebrow: c.group.eyebrow,
    title: c.group.title,
    lead: c.group.lead,
    items: c.group.disciplines,
    titleId: c.group.titleId,
  };

  const ctaContent = {
    ...c.cta,
    emergencyHref: c.hero.emergencyHref,
    emergencyDisplay: c.hero.emergencyDisplay,
  };

  return (
    <>
      <ServiceHero01 content={c.hero} config={{ alert: true, photoHalf: true, ghostPhone: true, reveal: true }} />
      <WhyBand01 content={groupContent} config={{ variant: "mw-why--3up", marker: "number", columns: 3 }} />
      <NumberedCardGrid01 content={c.projects} />
      <DispatchCta01 content={ctaContent} />
      <RelatedRail01 content={c.related} />
    </>
  );
}
