import { HOME as c } from "@/app/(home)/home";
import { Eyebrow01 } from "@/components-v2/items/eyebrow-01";
import { StopText01 } from "@/components-v2/items/stop-text-01";
import { CtaSolid01 } from "@/components-v2/items/cta-solid-01";
import { CtaGhostPhone01 } from "@/components-v2/items/cta-ghost-phone-01";
import { ActionArrow01 } from "@/components-v2/items/action-arrow-01";
import { SocialLink01 } from "@/components-v2/blocks/social-link-01";
import { SOCIALS } from "@/lib/content/template-testing-home";

export function FinalCta01() {
  return (
    <section className="mw-final" aria-labelledby="mw-final-heading">
      <div className="mw-final__grid" data-reveal-stagger>
        <div className="mw-final__col mw-final__col--truck">
          <img className="mw-final__truck" src="/miller/truck-graphic-angled.png" alt="" aria-hidden="true" loading="lazy" />
        </div>
        <div className="mw-final__col mw-final__col--content">
          <p className="mw-section-tag mw-final__tag" aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">{c.finalCta.eyebrow}</span>
          </p>
          <h2 id="mw-final-heading" className="mw-final__title"><StopText01>{c.finalCta.title.replace(/\.\s*$/, "")}</StopText01></h2>
          <p className="mw-final__body">{c.finalCta.body}</p>
          <div className="mw-final__row">
            <CtaSolid01 href={c.finalCta.contactHref}>Contact Miller <ActionArrow01 /></CtaSolid01>
            <CtaGhostPhone01 sup="24/7 emergency" num={c.finalCta.emergencyDisplay} href={c.finalCta.emergencyHref} ariaLabel={`Call 24/7 emergency: ${c.finalCta.emergencyDisplay}`} />
          </div>
          <span className="mw-final__divider" aria-hidden="true" />
          <ul className="mw-final__socials" aria-label="Miller Environmental on social media">
            {SOCIALS.map((so) => (<li key={so.label}><SocialLink01 label={so.label} href={so.href} path={so.path} /></li>))}
          </ul>
        </div>
        <div className="mw-final__col mw-final__col--logo">
          <img className="mw-final__logomark" src="/miller/logo/miller-logomark.webp" alt="" aria-hidden="true" loading="lazy" />
        </div>
      </div>
    </section>
  );
}
