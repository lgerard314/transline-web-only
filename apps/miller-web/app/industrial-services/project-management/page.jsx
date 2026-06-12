import { TitleblockHero01 } from "@/components-v2/06_sections/heroes/titleblock-hero-01";
import { DisciplineSplit01 } from "@/components-v2/06_sections/splits/discipline-split-01";
import { DeliverySchedule01 } from "@/components-v2/06_sections/flows/delivery-schedule-01";
import { PortfolioGrid01 } from "@/components-v2/06_sections/grids/portfolio-grid-01";
import { EscalationBand01 } from "@/components-v2/06_sections/callouts/escalation-band-01";
import { IntakeCta01 } from "@/components-v2/06_sections/callouts/intake-cta-01";
import { RelatedRail02 } from "@/components-v2/06_sections/rails/related-rail-02";
import { projectManagement as c } from "@/lib/content/project-management";

// PM v2 — the "project dossier" page. Thin composition only: dedicated
// templates + content module. Sections land one at a time (build → audit →
// commit), same loop as the CWC v2 cutover.

export const metadata = {
  title: "Project Management",
  description: c.hero.lead,
  alternates: { canonical: "/industrial-services/project-management/" },
};

export default function ProjectManagementPage() {
  return (
    <>
      <TitleblockHero01 content={c.hero} />
      <DisciplineSplit01 content={c.group} />
      <DeliverySchedule01 content={c.schedule} />
      <PortfolioGrid01 content={c.portfolio} />
      <EscalationBand01 content={c.escalation} />
      <IntakeCta01 content={c.cta} />
      <RelatedRail02 content={c.related} config={{ hookClass: "mw-pm-rel" }} />
    </>
  );
}
