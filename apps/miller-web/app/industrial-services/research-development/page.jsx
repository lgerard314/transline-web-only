import { ServiceDetailTemplate } from "../../../components/templates/ServiceDetailTemplate";
import { researchDevelopment as c } from "../../../lib/content/service-research-development";

export const metadata = { title: "Research & Development" };

export default function ResearchDevelopmentPage() {
  return (
    <ServiceDetailTemplate
      variant="capabilities"
      slug="research-development"
      eyebrow={c.hero.eyebrow}
      title={c.hero.title}
      lead={c.hero.lead}
      photo={c.hero.photo}
      groups={c.sections}
      trustBadge={c.inlineTrustBadge}
    />
  );
}
