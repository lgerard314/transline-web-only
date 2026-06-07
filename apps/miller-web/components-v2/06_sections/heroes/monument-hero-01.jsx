// L3 · monument-hero-01 — civic-monument hero on darkened site photo.
import { PhraseCycle01 } from "@/components-v2/05_widgets/cycles/phrase-cycle-01";
import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
import { GhostPhoneCta01 } from "@/components-v2/02_buttons/ghost/ghost-phone-cta-01";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
import { sectionProps } from "@/components-v2/section-config";

export function MonumentHero01({ content, config = {} }) {
  const { mark, title, lead, primaryCta, ghostPhone, article, photoSrc, titleId } = content;
  // config.revealOnLoad (home): on load, the photo opens from a clip-path window
  // to full-bleed while zooming 1.6→1 (one-shot CSS entrance, see mw-hero--reveal).
  const reveal = !!config.revealOnLoad;
  const photoWrapProps = reveal ? {} : { "data-parallax": true, "data-parallax-speed": "0.16" };
  return (
    <section className={`mw-hero${reveal ? " mw-hero--reveal" : ""}`} aria-labelledby={titleId} {...sectionProps(config)}>
      <div className="mw-hero__photo-wrap" aria-hidden="true" {...photoWrapProps}>
        {reveal ? (
          <div className="mw-hero__photo-zoom">
            <div className="mw-hero__photo" style={{ backgroundImage: `url(${photoSrc})` }} />
          </div>
        ) : (
          <div className="mw-hero__photo" style={{ backgroundImage: `url(${photoSrc})` }} />
        )}
      </div>
      <div className="mw-hero__inner">
        <div className="mw-hero__head-row">
          <h1 id={titleId} className="mw-hero__title">
            <span className="mw-hero__line"><span className="mw-hero__line-in">{title.line1}</span></span>
            <span className="mw-hero__line"><span className="mw-hero__line-in"><PhraseCycle01 phrases={title.cyclePhrases} /></span></span>
            <span className="mw-hero__line"><span className="mw-hero__line-in"><StopText01 stopClassName="mw-hero__stop">{title.line3}</StopText01></span></span>
          </h1>

          <p className="mw-hero__mark" aria-hidden="true">
            <span className="mw-hero__mark-brand">
              <img className="mw-hero__mark-logo" src={mark.logoSrc} alt="" />
            </span>
          </p>
        </div>

        <div className="mw-hero__body">
          <div className="mw-hero__intro">
            <p className="mw-hero__lead">{lead}</p>
            <div className="mw-hero__ctas">
              <SolidCta01 href={primaryCta.href}>{primaryCta.label} <ActionArrow01 /></SolidCta01>
              <GhostPhoneCta01 sup={ghostPhone.sup} num={ghostPhone.num} href={ghostPhone.href} ariaLabel={`Call 24/7 emergency: ${ghostPhone.num}`} />
            </div>
          </div>

          <p className="mw-hero__article"><strong>{article.strong}</strong><span className="mw-hero__article-since">{article.rest}</span></p>
        </div>
      </div>
    </section>
  );
}
