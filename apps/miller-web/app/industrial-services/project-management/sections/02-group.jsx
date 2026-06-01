import { projectManagement as c } from "@/lib/content/service-project-management";
import { StopText } from "@/components/StopText";

// §2 — The Projects Group. Shared dark why-Miller band (3-up): the engineering
// disciplines, with the on-time/on-budget and Emergency-Response escalation
// story carried in the lead.
export function GroupSection() {
  const g = c.group;
  return (
    <section className="mw-why mw-why--3up" aria-labelledby="pm-group-title">
      <div className="mw-why__inner mw-inner">
        <header className="mw-why__head">
          <p className="mw-section-tag" data-reveal aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label mw-section-tag-label--invert">{g.eyebrow}</span>
          </p>
          <h2 id="pm-group-title" className="mw-section-title mw-why__title" data-reveal>
            <StopText>{g.title}</StopText>
          </h2>
          <p className="mw-why__lead" data-reveal>{g.lead}</p>
        </header>

        <ul className="mw-why__grid" data-reveal-stagger>
          {g.disciplines.map((d) => (
            <li key={d.title} className="mw-why__card">
              <span className="mw-why__num" aria-hidden="true">{d.mark}</span>
              <h3 className="mw-why__name">{d.title}</h3>
              <p className="mw-why__body">{d.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
