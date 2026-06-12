import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
import { GhostPhoneCta01 } from "@/components-v2/02_buttons/ghost/ghost-phone-cta-01";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
import { IconLink01 } from "@/components-v2/03_cards/icon-link/icon-link-01";
import { FinalWashDrive } from "@/components-v2/06_sections/callouts/final-wash-drive";
import { sectionProps } from "@/components-v2/section-config";

const WASH_LAYERS = [
  { dir: "rtl", src: "/miller/generated/final-truck-wash-rtl.png" },
  { dir: "ltr", src: "/miller/generated/final-truck-wash-ltr.png" },
];

function FinalTruckWash() {
  return (
    <div className="mw-final__wash" aria-hidden="true">
      {WASH_LAYERS.map(({ dir, src }) => (
        <img
          key={dir}
          className={`mw-final__wash-layer mw-final__wash-layer--${dir}`}
          data-wash-layer={dir}
          src={src}
          alt=""
          decoding="async"
          draggable={false}
        />
      ))}
    </div>
  );
}

export function MultiColumnCta01({ content, config = {} }) {
  const { eyebrow, title, body, primaryCta, ghostPhone, socials, socialsAriaLabel, headingId } = content;
  return (
    <section className="mw-final" aria-labelledby={headingId} {...sectionProps(config)}>
      <FinalTruckWash />
      <FinalWashDrive />
      <div className="mw-final__grid" data-reveal-stagger data-layout={config.layout}>
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
      </div>
    </section>
  );
}
