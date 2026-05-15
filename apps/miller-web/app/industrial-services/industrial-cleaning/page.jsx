import { ServiceDetailTemplate } from "../../../components/templates/ServiceDetailTemplate";
import { industrialCleaning as c } from "../../../lib/content/service-industrial-cleaning";

export const metadata = { title: "Industrial Cleaning" };

export default function IndustrialCleaningPage() {
  return (
    <ServiceDetailTemplate
      variant="compact"
      slug="industrial-cleaning"
      eyebrow={c.hero.eyebrow}
      title={c.hero.title}
      lead={c.hero.lead}
      photo={c.hero.photo}
      sections={c.sections}
      bullets={c.bullets}
    />
  );
}
