import { AboutTemplate } from "../../../components/templates/AboutTemplate";
import { aboutHealthSafety as c } from "../../../lib/content/about-health-safety";

export const metadata = { title: "Health & Safety" };

export default function HealthSafetyPage() {
  return (
    <AboutTemplate
      eyebrow={c.hero.eyebrow}
      title={c.hero.title}
      lead={c.hero.lead}
      photo={c.hero.photo}
      sections={c.sections}
      lists={c.lists}
    />
  );
}
