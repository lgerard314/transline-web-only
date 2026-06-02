import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
import { GhostPhoneCta01 } from "@/components-v2/02_buttons/ghost/ghost-phone-cta-01";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
import { IconLink01 } from "@/components-v2/03_cards/icon-link/icon-link-01";

export function MultiColumnCta01({ content, config = {} }) {
  const { truckImgSrc, logoImgSrc, eyebrow, title, body, primaryCta, ghostPhone, socials, socialsAriaLabel, headingId } = content;
  return (
    <section className="mw-final" aria-labelledby={headingId}>
      <div className="mw-final__grid" data-reveal-stagger>
        <div className="mw-final__col mw-final__col--truck">
          <img className="mw-final__truck" src={truckImgSrc} alt="" aria-hidden="true" loading="lazy" />
        </div>
        <div className="mw-final__col mw-final__col--content">
          <p className="mw-section-tag mw-final__tag" aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">{eyebrow}</span>
          </p>
          <h2 id={headingId} className="mw-final__title"><StopText01>{title.replace(/\.\s*$/, "")}</StopText01></h2>
          <p className="mw-final__body">{body}</p>
          <div className="mw-final__row">
            <SolidCta01 href={primaryCta.href}>{primaryCta.label} <ActionArrow01 /></SolidCta01>
            <GhostPhoneCta01 sup={ghostPhone.sup} num={ghostPhone.num} href={ghostPhone.href} ariaLabel={`Call 24/7 emergency: ${ghostPhone.num}`} />
          </div>
          <span className="mw-final__divider" aria-hidden="true" />
          <ul className="mw-final__socials" aria-label={socialsAriaLabel}>
            {socials.map((so) => (<li key={so.label}><IconLink01 label={so.label} href={so.href} path={so.path} /></li>))}
          </ul>
        </div>
        <div className="mw-final__col mw-final__col--logo">
          <img className="mw-final__logomark" src={logoImgSrc} alt="" aria-hidden="true" loading="lazy" />
        </div>
      </div>
    </section>
  );
}
