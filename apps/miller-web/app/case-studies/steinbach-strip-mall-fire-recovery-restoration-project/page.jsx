import { CaseStudyDetailTemplate } from "../../../components/templates/CaseStudyDetailTemplate";
import { caseSteinbachFire as c } from "../../../lib/content/case-steinbach-fire";

export const metadata = { title: "Steinbach Strip Mall Fire Recovery & Restoration Project" };

export default function SteinbachFireCaseStudyPage() {
  return (
    <CaseStudyDetailTemplate
      eyebrow={c.hero.eyebrow}
      title={c.hero.title}
      lead={c.hero.lead}
      photo={c.hero.photo}
      meta={c.hero.meta}
      problem={c.problem}
      approach={c.approach}
      results={c.results}
    />
  );
}
