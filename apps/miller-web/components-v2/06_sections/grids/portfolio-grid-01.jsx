import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · portfolio-grid-01 — "projects we've delivered" as an editorial
// portfolio wall (PM v2 §4). Asymmetric hierarchy: two feature cards
// (span-2, wider crop) over four standard cards on one 4-track grid. Cards
// are photo + name/tag/body; hover draws drafting crop-mark corners on the
// photo and eases a small zoom (gated to no-preference). No leading numbers
// on stacked lists. Server component — standard reveals only.
//
// content: { titleId, eyebrow, title, lead,
//            items[{ name, body, tag, photo, feature? }] }
// config:  standard sectionProps passthrough.
export function PortfolioGrid01({ content, config = {} }) {
  return (
    <section className="mw-pm-work" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-pm-work__inner mw-inner">
        <header className="mw-pm-work__head">
          <p className="mw-section-tag" data-reveal aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">{content.eyebrow}</span>
          </p>
          <h2 id={content.titleId} className="mw-section-title mw-pm-work__title" data-reveal>
            <StopText>{content.title}</StopText>
          </h2>
          <p className="mw-pm-work__lead" data-reveal>{content.lead}</p>
        </header>

        <ul className="mw-pm-work__grid" data-reveal-stagger>
          {content.items.map((it) => (
            <li key={it.name} className="mw-pm-work__card" data-feature={it.feature ? "1" : undefined}>
              <figure className="mw-pm-work__media">
                <img className="mw-pm-work__photo" src={it.photo} alt="" loading="lazy" />
                <span className="mw-pm-work__corners" aria-hidden="true" />
              </figure>
              <div className="mw-pm-work__meta">
                <div className="mw-pm-work__id">
                  <h3 className="mw-pm-work__name">{it.name}</h3>
                  <p className="mw-pm-work__tag">{it.tag}</p>
                </div>
                <p className="mw-pm-work__body">{it.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
