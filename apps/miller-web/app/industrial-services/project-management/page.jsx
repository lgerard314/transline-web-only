import { ServiceDetailTemplate } from "../../../components/templates/ServiceDetailTemplate";
import { projectManagement as c } from "../../../lib/content/service-project-management";

export const metadata = { title: "Project Management" };

export default function ProjectManagementPage() {
  return (
    <ServiceDetailTemplate
      variant="compact"
      slug="project-management"
      eyebrow={c.hero.eyebrow}
      title={c.hero.title}
      lead={c.hero.lead}
      photo={c.hero.photo}
      sections={c.sections}
      bullets={c.bullets}
    />
  );
}
