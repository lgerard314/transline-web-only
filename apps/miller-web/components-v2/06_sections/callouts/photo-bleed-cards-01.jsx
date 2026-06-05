import { NoteCard01 } from "@/components-v2/03_cards/note/note-card-01";
import { sectionProps } from "@/components-v2/section-config";

export function PhotoBleedCards01({ content, config = {} }) {
  const { bleedPhotoSrc, eyebrow, stage, title, lead, cards, headingId } = content;
  return (
    <section className="mw-careers mw-careers--bleed" aria-labelledby={headingId} {...sectionProps(config)}>
      <div className="mw-careers__bleed-photo" aria-hidden="true">
        <img src={bleedPhotoSrc} alt="" loading="lazy" data-parallax-img />
      </div>
      <div className="mw-inner">
        <header className="mw-careers__head">
          <div className="mw-careers__head-text" data-reveal>
            {/* Field-head: the /v2 manifest grammar — a mono `stage —— field` document line above the title. */}
            <p className="mw-careers__field">
              {stage ? <span>{stage}</span> : null}
              <span className="mw-careers__field-rule" />
              <span>{eyebrow}</span>
            </p>
            <h2 id={headingId} className="mw-careers__title">
              {title.lead} <span className="mw-careers__title-em">{title.em}</span>
            </h2>
            <p className="mw-careers__lead">{lead}</p>
          </div>
        </header>
        <div className="mw-careers__cards" data-reveal-stagger>
          {cards.map((card) => (<NoteCard01 key={card.tag} tag={card.tag} title={card.title} text={card.text} cta={card.cta} />))}
        </div>
      </div>
    </section>
  );
}
