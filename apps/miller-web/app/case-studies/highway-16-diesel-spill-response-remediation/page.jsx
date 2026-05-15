import { CaseStudyDetailTemplate } from "../../../components/templates/CaseStudyDetailTemplate";
import { caseHwy16Diesel as c } from "../../../lib/content/case-hwy16-diesel";

export const metadata = { title: "Highway 16 Diesel Spill Response & Remediation" };

export default function Hwy16DieselCaseStudyPage() {
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
