import { AboutTemplate } from "../../../components/templates/AboutTemplate";
import { careersBenefitsRewards as c } from "../../../lib/content/careers-benefits-rewards";

export const metadata = { title: "Benefits & Rewards" };

export default function BenefitsRewardsPage() {
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
