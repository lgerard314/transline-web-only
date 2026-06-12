import { TitleblockHero01 } from "@/components-v2/06_sections/heroes/titleblock-hero-01";
import { DisciplineSplit01 } from "@/components-v2/06_sections/splits/discipline-split-01";
import { DeliverySchedule01 } from "@/components-v2/06_sections/flows/delivery-schedule-01";
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
    </>
  );
}
