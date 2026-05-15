import { JobPostingTemplate } from "../../../components/templates/JobPostingTemplate";
import { jobEnterpriseAutomationManager as c } from "../../../lib/content/job-enterprise-automation-manager";

export const metadata = { title: "Enterprise Automation Manager — Careers" };

export default function EnterpriseAutomationManagerJobPage() {
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
