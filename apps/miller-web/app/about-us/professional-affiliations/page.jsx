import { AboutTemplate } from "../../../components/templates/AboutTemplate";
import { AffiliationsGrid } from "../../../components/AffiliationsGrid";
import { aboutProfessionalAffiliations as c } from "../../../lib/content/about-professional-affiliations";

export const metadata = { title: "Professional Affiliations" };

export default function ProfessionalAffiliationsPage() {
  return (
    <>
      <AboutTemplate
        eyebrow={c.hero.eyebrow}
        title={c.hero.title}
        lead={c.hero.lead}
        sections={c.sections}
      />
      <section className="tl-container" style={{ padding: "0 0 var(--space-8)" }}>
        <AffiliationsGrid />
      </section>
    </>
  );
}
