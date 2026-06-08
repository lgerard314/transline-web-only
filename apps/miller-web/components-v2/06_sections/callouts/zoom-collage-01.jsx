import { ZoomCollage01 as ZoomCollageWidget } from "@/components-v2/05_widgets/galleries/zoom-collage-01";
import { sectionProps } from "@/components-v2/section-config";

/* Careers — an immersive zoom collage. A sticky stage dives through a mosaic of
   crew photos until the lead shot fills the frame, where the careers invitation
   (field-head eyebrow, headline, lead, two CTAs) fades in over a walnut scrim.
   Replaces the photo-bleed careers callout on the home page. Content shape:
     { headingId, stage, eyebrow, title:{lead,em}, lead, zoomPhotos:[{src}], cards:[{tag,title,cta:{label,href}}] } */
export function ZoomCollage01({ content, config = {} }) {
  const { headingId, stage, eyebrow, title, lead, zoomPhotos = [], cards = [] } = content;
  return (
    <section className="mw-czoom" aria-labelledby={headingId} {...sectionProps(config)}>
      <ZoomCollageWidget
        photos={zoomPhotos}
        autoScroll={config.autoScroll !== false}
        intro={(
          /* Temporary intro eyebrow in the cream band above the mosaic — scrolls out once
             the dive pins. The field-head reappears in the overlay after the photo lands. */
          <header className="mw-czoom__intro" aria-hidden="true">
            <p className="mw-czoom__intro-field">
              {stage ? <span>{stage}</span> : null}
              <span className="mw-czoom__intro-rule" />
              <span>{eyebrow}</span>
            </p>
          </header>
        )}
      >
        <div className="mw-czoom__copy">
          <p className="mw-czoom__field">
            {stage ? <span>{stage}</span> : null}
            <span className="mw-czoom__field-rule" />
            <span>{eyebrow}</span>
          </p>
          <h2 id={headingId} className="mw-czoom__title">
            {title.lead} <span className="mw-czoom__title-em">{title.em}</span>
          </h2>
          <p className="mw-czoom__lead">{lead}</p>
          {cards.length > 0 ? (
            <div className="mw-czoom__cards">
              {cards.map((card) => (
                <a className="mw-czoom__card" key={card.title} href={card.cta?.href}>
                  <span className="mw-czoom__card-tag">{card.tag}</span>
                  <span className="mw-czoom__card-title">{card.title}</span>
                  <span className="mw-czoom__card-link">
                    {card.cta?.label}
                    <span className="mw-czoom__arrow" aria-hidden="true">→</span>
                  </span>
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </ZoomCollageWidget>
    </section>
  );
}
