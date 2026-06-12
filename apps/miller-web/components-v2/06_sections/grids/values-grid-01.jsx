import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · values-grid-01 — the four core values as a staggered 2×2 editorial
// grid (VMV v2 §4). Even cards stair-step down via margin (the reveal owns
// transforms, §13). Card = candid crew photo (16:10, caption chip) + value
// name + the company's published value text. No numbers on stacked lists;
// no hover (cards aren't interactive). Server component, standard reveals.
//
// content: { titleId, eyebrow, title, lead,
//            items[{ name, body, photo, caption }] }
// config:  standard sectionProps passthrough.
export function ValuesGrid01({ content, config = {} }) {
  return (
    <section className="mw-vmv-values" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-vmv-values__inner mw-inner">
        <header>
          <p className="mw-section-tag" data-reveal aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">{content.eyebrow}</span>
          </p>
          <h2 id={content.titleId} className="mw-section-title mw-vmv-values__title" data-reveal>
            <StopText>{content.title}</StopText>
          </h2>
          <p className="mw-vmv-values__lead" data-reveal>{content.lead}</p>
        </header>

        <ul className="mw-vmv-values__grid" data-reveal-stagger>
          {content.items.map((v) => (
            <li key={v.name} className="mw-vmv-values__card">
              <figure className="mw-vmv-values__media">
                <img className="mw-vmv-values__photo" src={v.photo} alt="" loading="lazy" />
                <figcaption className="mw-vmv-values__chip">
                  <span className="mw-vmv-values__chip-mark" aria-hidden="true" />
                  {v.caption}
                </figcaption>
              </figure>
              <h3 className="mw-vmv-values__name">{v.name}</h3>
              <p className="mw-vmv-values__body">{v.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
