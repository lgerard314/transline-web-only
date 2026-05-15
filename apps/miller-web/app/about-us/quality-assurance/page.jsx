import { AboutTemplate } from "../../../components/templates/AboutTemplate";
import { CertificationGrid } from "../../../components/CertificationGrid";
import { QA } from "../../../lib/content/about-quality-assurance";

export const metadata = {
  title: "Quality Assurance",
  description:
    "Miller Environmental's integrated management system covers ISO 9001:2015, ISO 14001:2015, ISO 45001:2018, and MHCA COR 2023 — the only such combination at a Canadian hazardous waste management company.",
  alternates: { canonical: "/about-us/quality-assurance/" },
};

export default function QualityAssurancePage() {
  return (
    <AboutTemplate
      eyebrow={QA.eyebrow}
      title={QA.title}
      lead={QA.lead}
      photo={QA.photo}
      sections={[
        { heading: QA.intro.heading, body: QA.intro.body },
        { heading: QA.tracking.heading, body: QA.tracking.body },
      ]}
    >
      {/* CertificationGrid slot — rendered immediately below the lead
          prose per design spec §3.5. The AboutTemplate places `children`
          after sections; we render the grid in a wrapper that pushes it
          above the tracking section visually using order:-1 wouldn't
          help since sections come before — so we inject it as a
          trailing block but with an introducing heading. */}
      <section style={{ marginTop: "var(--space-7)" }}>
        <h3 className="tl-display tl-display--xs" style={{ marginBottom: 16 }}>
          Our certifications
        </h3>
        <CertificationGrid />
      </section>
    </AboutTemplate>
  );
}
