import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { NoteCard01 } from "@/components-v2/03_cards/note/note-card-01";

export function PhotoBleedCards01({ content, config = {} }) {
  const { bleedPhotoSrc, eyebrow, title, lead, cards, headingId } = content;
  return (
    <section className="mw-careers mw-careers--bleed" aria-labelledby={headingId}>
      <div className="mw-careers__bleed-photo" aria-hidden="true">
        <img src={bleedPhotoSrc} alt="" loading="lazy" />
      </div>
      <div className="mw-inner">
        <header className="mw-careers__head">
          <div className="mw-careers__head-text" data-reveal>
            <Eyebrow01 label={eyebrow} invert />
            <h2 id={headingId} className="mw-careers__title">
              {title.lead}<br /><span className="mw-careers__title-em"><StopText01>{title.em}</StopText01></span>
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
