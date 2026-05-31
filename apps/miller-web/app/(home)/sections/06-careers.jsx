import Link from "next/link";
import { HOME as c } from "../home";

// CAREERS — dark walnut bleed variant with Culture / Hiring cards.
export function CareersSection() {
  return (
    <section className="mw-careers mw-careers--bleed" aria-labelledby="mw-careers-bleed-heading">
      <div className="mw-careers__bleed-photo" aria-hidden="true">
        <img src="/miller/careers/team-at-conv-booth-big-5.jpg" alt="" loading="lazy" />
      </div>
      <div className="mw-inner">
        <header className="mw-careers__head">
          <div className="mw-careers__head-text" data-reveal>
            <p className="mw-section-tag" aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label mw-section-tag-label--invert">Careers</span>
            </p>
            <h2 id="mw-careers-bleed-heading" className="mw-careers__title">
              Join the<br /><span className="mw-careers__title-em">Miller team<span className="mw-stop" aria-hidden="true" /></span>
            </h2>
            <p className="mw-careers__lead">{c.joinFamily.intro}</p>
          </div>
        </header>

        <div className="mw-careers__cards" data-reveal-stagger>
          <article className="mw-careers__card">
            <span className="mw-careers__card-tag">Culture</span>
            <h3 className="mw-careers__card-title">{c.joinFamily.whyTitle}</h3>
            <p className="mw-careers__card-text">{c.joinFamily.whyBody}</p>
            <Link href={c.joinFamily.whyCta.href} className="mw-careers__card-link">
              {c.joinFamily.whyCta.label} <span aria-hidden="true">→</span>
            </Link>
          </article>
          <article className="mw-careers__card">
            <span className="mw-careers__card-tag">Hiring now</span>
            <h3 className="mw-careers__card-title">{c.joinFamily.opportunitiesTitle}</h3>
            <p className="mw-careers__card-text">{c.joinFamily.opportunitiesBody}</p>
            <Link href={c.joinFamily.opportunitiesCta.href} className="mw-careers__card-link">
              {c.joinFamily.opportunitiesCta.label} <span aria-hidden="true">→</span>
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
