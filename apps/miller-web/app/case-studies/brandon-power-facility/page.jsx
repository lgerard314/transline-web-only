import { CaseStudyDetailTemplate } from "../../../components/templates/CaseStudyDetailTemplate";
import { caseBrandonPower as c } from "../../../lib/content/case-brandon-power";

export const metadata = { title: "Brandon Power Facility Lime Dust Remediation" };

export default function BrandonPowerCaseStudyPage() {
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
