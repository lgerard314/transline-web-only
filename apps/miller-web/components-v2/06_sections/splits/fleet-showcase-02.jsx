import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · fleet-showcase-02 — the page's single dark-walnut anchor (CWC v2 §4):
// the real fleet, shown off. Three generated unit photos (matched to the
// miller-env-* reference trucks) over equipment-plate meta blocks on walnut.
// Dark text colors follow the §12 rule (home Careers values); the photo
// top-bar-grows-on-hover motif is the house photo grammar adapted to dark.
// data-reveal sits on the grid cells; the hover lift lives on the inner card
// (a reveal element can never also be the hover-transform element — §13).
//
// content: { titleId, eyebrow, title, titleEm, lead,
//            units[{ num, name, role, body, image }], footnote }
// config:  standard sectionProps passthrough.
export function FleetShowcase02({ content, config = {} }) {
  return (
    <section className="mw-cwc-fleet" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-cwc-fleet__inner mw-inner">
        <header className="mw-cwc-fleet__head">
          <div className="mw-cwc-fleet__head-main">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label mw-section-tag-label--invert">{content.eyebrow}</span>
            </p>
            <h2 id={content.titleId} className="mw-section-title mw-cwc-fleet__title" data-reveal>
              {content.title}{" "}
              <em className="mw-cwc-fleet__title-em"><StopText>{content.titleEm}</StopText></em>
            </h2>
          </div>
          <p className="mw-cwc-fleet__lead" data-reveal>{content.lead}</p>
        </header>

        <ul className="mw-cwc-fleet__grid" data-reveal-stagger>
          {content.units.map((u) => (
            <li key={u.num} className="mw-cwc-fleet__cell">
              <article className="mw-cwc-fleet__card">
                <figure className="mw-cwc-fleet__photo">
                  <span className="mw-cwc-fleet__photo-bar" aria-hidden="true" />
                  <img src={u.image} alt="" loading="lazy" />
                </figure>
                <div className="mw-cwc-fleet__plate">
                  <p className="mw-cwc-fleet__plate-row">
                    <span className="mw-cwc-fleet__num" aria-hidden="true">{u.num}</span>
                    <span className="mw-cwc-fleet__role">{u.role}</span>
                  </p>
                  <h3 className="mw-cwc-fleet__name">{u.name}</h3>
                  <p className="mw-cwc-fleet__body">{u.body}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <p className="mw-cwc-fleet__footnote" data-reveal>
          <span className="mw-cwc-fleet__footnote-mark" aria-hidden="true" />
          {content.footnote}
        </p>
      </div>
    </section>
  );
}
