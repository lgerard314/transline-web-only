import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// CapabilityGrid01 — reproduces mw-cap (Industrial Waste Treatment §3).
// Source: apps/miller-web/app/industrial-services/industrial-waste-treatment/sections/03-capabilities.jsx
//
// DOM: section.mw-cap > div.mw-cap__inner.mw-inner
//   header.mw-cap__head
//     div.mw-cap__head-left (eyebrow p.mw-section-tag + h2.mw-section-title)
//     p.mw-cap__lead
//   article.mw-cap-card.mw-cap-card--feature (groups[0]; list always --cols)
//   div.mw-cap__grid[data-reveal-stagger] (groups[1..]; list plain --no-cols)
//
// Content keys:
//   titleId      — id placed on <h2> and aria-labelledby on <section>
//   eyebrow      — section-tag label
//   title        — h2 text (wrapped in StopText)
//   lead         — section lead paragraph
//   groups[]     — { heading, photo, body?, items[] }
//     groups[0]  = feature card (mw-cap-card--feature); items list gets --cols
//     groups[1+] = grid cards (mw-cap-card); items list plain
//
// Server component — no "use client".

export function CapabilityGrid01({ content, config = {} }) {
  const [feature, ...rest] = content.groups;
  return (
    <section className="mw-cap" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-cap__inner mw-inner">
        <header className="mw-cap__head">
          <div className="mw-cap__head-left">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{content.eyebrow}</span>
            </p>
            <h2 id={content.titleId} className="mw-section-title" data-reveal>
              <StopText>{content.title}</StopText>
            </h2>
          </div>
          <p className="mw-cap__lead" data-reveal>{content.lead}</p>
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
