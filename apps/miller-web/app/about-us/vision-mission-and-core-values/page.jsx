import { AboutTemplate } from "../../../components/templates/AboutTemplate";
import { aboutVisionMissionAndCoreValues as c } from "../../../lib/content/about-vision-mission-and-core-values";

export const metadata = { title: "Vision, Mission and Core Values" };

export default function VisionMissionAndCoreValuesPage() {
  return (
    <AboutTemplate
      eyebrow={c.hero.eyebrow}
      title={c.hero.title}
      lead={c.hero.lead}
      sections={c.sections}
    >
      <section style={{ marginTop: "var(--space-7)" }}>
        <h2 className="tl-display tl-display--m">Core values</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
            marginTop: 16,
          }}
        >
          {c.coreValues.map((v) => (
            <div key={v.title} className="mw-loc-card">
              <h3 className="mw-loc-card__title">{v.title}</h3>
              <p style={{ color: "var(--c-ink-2)", fontSize: 14, marginTop: 8 }}>{v.body}</p>
            </div>
          ))}
        </div>
      </section>
    </AboutTemplate>
  );
}
