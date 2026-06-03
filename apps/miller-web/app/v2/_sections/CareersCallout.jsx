import Image from "next/image";
import { CustodyRule } from "../_components/CustodyThread";
import { MxArrow } from "../_components/marks";

// · THE CREW — the people who sign the manifest. A photo-bleed callout: the team
// photograph clips in on one side; the other carries the invitation and two
// entry-point cards (culture / hiring). Light surface, warm.
export function CareersCallout({ content }) {
  const c = content;
  return (
    <section className="mx-crew mx-section mx-warm" aria-labelledby={c.headingId}>
      <CustodyRule />
      <div className="mx-inner mx-crew__grid">
        <div className="mx-crew__media" data-mx-reveal="clip">
          <Image src={c.bleedPhotoSrc} alt="The Miller Environmental team" fill sizes="(max-width: 920px) 100vw, 46vw" className="mx-crew__img" />
        </div>

        <div className="mx-crew__body">
          <p className="mx-field">
            <span>{c.field}</span>
            <span className="mx-field__rule" />
            <span>{c.eyebrow}</span>
          </p>
          <h2 id={c.headingId} className="mx-h2">
            {c.title.lead} <span className="mx-h2__em">{c.title.em}</span>
          </h2>
          <p className="mx-lead">{c.lead}</p>

          <ul className="mx-crew__cards">
            {c.cards.map((card) => (
              <li className="mx-crew__card" key={card.tag}>
                <span className="mx-crew__tag">{card.tag}</span>
                <span className="mx-crew__ctitle">{card.title}</span>
                <span className="mx-crew__ctext">{card.text}</span>
                <a className="mx-btn mx-btn--text" href={card.cta.href}>{card.cta.label} <MxArrow /></a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
