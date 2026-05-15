import { CaseStudyDetailTemplate } from "../../../components/templates/CaseStudyDetailTemplate";
import { caseGrainElevator as c } from "../../../lib/content/case-grain-elevator";

export const metadata = { title: "Grain Elevator Remediation Project" };

export default function GrainElevatorCaseStudyPage() {
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
