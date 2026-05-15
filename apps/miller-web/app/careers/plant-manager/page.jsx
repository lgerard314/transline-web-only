import { JobPostingTemplate } from "../../../components/templates/JobPostingTemplate";
import { jobPlantManager as c } from "../../../lib/content/job-plant-manager";

export const metadata = { title: "Plant Manager — Careers" };

export default function PlantManagerJobPage() {
  return (
    <JobPostingTemplate
      eyebrow={c.hero.eyebrow}
      title={c.hero.title}
      lead={c.hero.lead}
      location={c.location}
      roleSummary={c.roleSummary}
      responsibilities={c.responsibilities}
      requirements={c.requirements}
      benefits={c.benefits}
    />
  );
}
