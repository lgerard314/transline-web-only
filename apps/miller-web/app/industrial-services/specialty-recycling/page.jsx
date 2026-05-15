import { ServiceDetailTemplate } from "../../../components/templates/ServiceDetailTemplate";
import { specialtyRecycling as c } from "../../../lib/content/service-specialty-recycling";

export const metadata = { title: "Specialty Recycling" };

export default function SpecialtyRecyclingPage() {
  return (
    <ServiceDetailTemplate
      variant="capabilities"
      slug="specialty-recycling"
      eyebrow={c.hero.eyebrow}
      title={c.hero.title}
      lead={c.hero.lead}
      photo={c.hero.photo}
      groups={c.sections}
      trustBadge={c.inlineTrustBadge}
    />
  );
}
