import { CareersDiamonds01 } from "@/components-v2/05_widgets/galleries/careers-diamonds-01";
import { CareerReel01 } from "@/components-v2/05_widgets/galleries/career-reel-01";
import { sectionProps } from "@/components-v2/section-config";

export function PhotoBleedCards01({ content, config = {} }) {
  const { bleedPhotoSrc, reelPhotos, eyebrow, stage, title, lead, cards, headingId } = content;
  return (
    <section className="mw-careers mw-careers--bleed" aria-labelledby={headingId} {...sectionProps(config)}>
      {reelPhotos && reelPhotos.length > 0 ? null : (
        <div className="mw-careers__bleed-photo" aria-hidden="true">
          <img src={bleedPhotoSrc} alt="" loading="lazy" data-parallax-img />
        </div>
      )}
      <div className="mw-inner">
        {reelPhotos && reelPhotos.length > 0 ? (
          /* Reel lives inside .mw-inner so it fits the content container's box
             (height + right edge) rather than bleeding the full section. */
          <div className="mw-careers__reel-col">
            <CareerReel01 photos={reelPhotos} />
          </div>
        ) : null}
        <header className="mw-careers__head">
          <div className="mw-careers__head-text" data-reveal>
            {/* Field-head: mono `stage —— field` document line above the title. */}
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
        <div className="mw-careers__cards">
          <CareersDiamonds01 cards={cards} />
        </div>
      </div>
    </section>
  );
}
