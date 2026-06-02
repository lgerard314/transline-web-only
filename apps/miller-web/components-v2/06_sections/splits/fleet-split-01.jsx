import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

export function FleetSplit01({ content, config = {} }) {
  const f = content;
  return (
    <section className="mw-fleet" aria-labelledby={f.titleId} {...sectionProps(config)}>
      <div className="mw-fleet__inner mw-inner">
        <div className="mw-fleet__text">
          <p className="mw-section-tag" data-reveal aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label mw-section-tag-label--invert">{f.eyebrow}</span>
          </p>
          <h2 id={f.titleId} className="mw-section-title mw-fleet__title" data-reveal>
            <StopText>{f.title}</StopText>
          </h2>
          <p className="mw-fleet__lead" data-reveal>{f.lead}</p>
          <ul className="mw-fleet__list" data-reveal-stagger>
            {f.items.map((it) => (
              <li key={it.name} className="mw-fleet__item">
                <span className="mw-fleet__num" aria-hidden="true">{it.mark}</span>
                <div className="mw-fleet__item-body">
                  <h3 className="mw-fleet__item-name">{it.name}</h3>
                  <p className="mw-fleet__item-text">{it.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mw-fleet__media" data-reveal aria-hidden="true">
          <img src={f.mediaPhoto} alt="" loading="lazy" />
        </div>
      </div>
    </section>
  );
}
