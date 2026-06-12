import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · manifesto-hero-01 — the "company creed" masthead (VMV v2 §1).
// Distinct architecture from service-hero-02 (split) and titleblock-hero-01
// (masthead + title block): a pure typographic opening — eyebrow, a huge
// two-line display with clay em, a short setup lead — over a full-bleed
// crew photo with a caption chip lower-left. No CTAs in the hero (the
// page's close owns the doors); no title block (that's PM's device). §12:
// light surface, ONE eyebrow.
//
// content: { titleId, eyebrow, title, titleEm, lead, photo, photoAlt,
//            photoCaption }
// config:  { reveal = true }
export function ManifestoHero01({ content, config = {} }) {
  const { reveal = true } = config;
  const rv = reveal ? { "data-reveal": true } : {};

  return (
    <section className="mw-vmv-hero" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-vmv-hero__inner mw-inner">
        <div className="mw-vmv-hero__masthead">
          <p className="mw-section-tag" {...rv} aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">{content.eyebrow}</span>
          </p>
          <h1 id={content.titleId} className="mw-vmv-hero__title" {...rv}>
            {content.title}{" "}
            <span className="mw-vmv-hero__title-em"><StopText>{content.titleEm}</StopText></span>
          </h1>
          <p className="mw-vmv-hero__lead" {...rv}>{content.lead}</p>
        </div>
      </div>

      <figure className="mw-vmv-hero__stage" {...rv}>
        <img className="mw-vmv-hero__photo" src={content.photo} alt={content.photoAlt} />
        <figcaption className="mw-vmv-hero__cap">
          <span className="mw-vmv-hero__cap-mark" aria-hidden="true" />
          {content.photoCaption}
        </figcaption>
      </figure>
    </section>
  );
}
