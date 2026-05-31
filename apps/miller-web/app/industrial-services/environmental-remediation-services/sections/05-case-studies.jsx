import { CaseStudyCard } from "@/components/CaseStudyCard";
import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";

export function CaseStudiesSection() {
  return (
    <section className="mw-section mw-section--tinted">
      <div className="tl-container">
        <p className="mw-section__eyebrow">Case Studies</p>
        <h2 className="tl-display tl-display--m mw-section__title">
          Case studies that prove our expertise
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
            marginTop: 24,
          }}
        >
          {c.caseStudies.map((cs) => (
            <CaseStudyCard
              key={cs.href}
              href={cs.href}
              title={cs.title}
              location={cs.location}
              summary={cs.summary}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
