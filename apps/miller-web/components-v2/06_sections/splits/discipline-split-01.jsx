import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · discipline-split-01 — "engineers who own the outcome" (PM v2 §2).
// Narrative + a discipline ledger (diamond-marked rows — no leading numbers
// on stacked lists, logan's call) beside a tall field portrait. Server
// component; standard data-reveal entrances only — the page's scroll-tied
// signature lives in delivery-schedule-01.
//
// content: { titleId, eyebrow, title, lead,
//            disciplines[{ name, body }], photo, photoCaption }
// config:  standard sectionProps passthrough.
export function DisciplineSplit01({ content, config = {} }) {
  return (
    <section className="mw-pm-group" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-pm-group__inner mw-inner">
        <div className="mw-pm-group__grid">
          <div className="mw-pm-group__panel">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{content.eyebrow}</span>
            </p>
            <h2 id={content.titleId} className="mw-section-title mw-pm-group__title" data-reveal>
              <StopText>{content.title}</StopText>
            </h2>
            <p className="mw-pm-group__lead" data-reveal>{content.lead}</p>

            <ul className="mw-pm-group__ledger" data-reveal-stagger>
              {content.disciplines.map((d) => (
                <li key={d.name} className="mw-pm-group__row">
                  <span className="mw-pm-group__mark" aria-hidden="true" />
                  <div className="mw-pm-group__row-body">
                    <h3 className="mw-pm-group__name">{d.name}</h3>
                    <p className="mw-pm-group__body">{d.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <figure className="mw-pm-group__media" data-reveal>
            <img className="mw-pm-group__photo" src={content.photo} alt="" loading="lazy" />
            <figcaption className="mw-pm-group__cap">
              <span className="mw-pm-group__cap-mark" aria-hidden="true" />
              {content.photoCaption}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
