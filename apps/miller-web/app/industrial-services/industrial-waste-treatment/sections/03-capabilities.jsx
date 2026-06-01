import { IWT as c } from "@/lib/content/service-industrial-waste-treatment";
import { StopText } from "@/components/StopText";

// §3 — Treatment & processing capabilities. The first group is a wide feature
// card (photo left, body + bullet set right); the remaining six are photo-topped
// capability cards in a three-up grid, each with its bullet list.
export function CapabilitiesSection() {
  const cap = c.capabilities;
  const [feature, ...rest] = cap.groups;
  return (
    <section className="mw-cap" aria-labelledby="iwt-cap-title">
      <div className="mw-cap__inner mw-inner">
        <header className="mw-cap__head">
          <div className="mw-cap__head-left">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{cap.eyebrow}</span>
            </p>
            <h2 id="iwt-cap-title" className="mw-section-title" data-reveal>
              <StopText>{cap.title}</StopText>
            </h2>
          </div>
          <p className="mw-cap__lead" data-reveal>{cap.lead}</p>
        </header>

        <article className="mw-cap-card mw-cap-card--feature" data-reveal>
          <div className="mw-cap-card__media">
            <img src={feature.photo} alt="" loading="lazy" />
          </div>
          <div className="mw-cap-card__body">
            <h3 className="mw-cap-card__name">{feature.heading}</h3>
            {feature.body && <p className="mw-cap-card__text">{feature.body}</p>}
            {feature.items.length > 0 && (
              <ul className="mw-cap-card__list mw-cap-card__list--cols">
                {feature.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            )}
          </div>
        </article>

        <div className="mw-cap__grid" data-reveal-stagger>
          {rest.map((g) => (
            <article key={g.heading} className="mw-cap-card">
              <div className="mw-cap-card__media">
                <img src={g.photo} alt="" loading="lazy" />
              </div>
              <div className="mw-cap-card__body">
                <h3 className="mw-cap-card__name">{g.heading}</h3>
                {g.body && <p className="mw-cap-card__text">{g.body}</p>}
                {g.items.length > 0 && (
                  <ul className="mw-cap-card__list">
                    {g.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
