import { IndexTemplate } from "../../components/templates/IndexTemplate";
import { caseStudiesIndex as c } from "../../lib/content/case-studies";

export const metadata = { title: "Case Studies" };

export default function CaseStudiesIndexPage() {
  return (
    <IndexTemplate
      eyebrow={c.hero.eyebrow}
      title={c.hero.title}
      lead={c.hero.lead}
      cards={c.cards}
    />
  );
}
