import Link from "next/link";
import { TimelineNotifyCycle } from "../../../components/TimelineNotifyCycle";
import { RelatedServices } from "../../../components/RelatedServices";
import { emergencyResponse as c } from "../../../lib/content/service-emergency-response";

export const metadata = {
  title: "Emergency Response",
  description: c.hero.lead,
  alternates: { canonical: "/industrial-services/emergency-response/" },
};

export default function EmergencyResponsePage() {
  const h = c.hero;
  const tl = c.timeline;
  const inc = c.incidents;
  const cov = c.coverage;
  const cta = c.cta;
  return (
    <>
      {/* HERO — alert masthead. The 24/7 line is the primary action. */}
      <section className="mw-svc-hero mw-svc-hero--alert" aria-labelledby="er-hero-title">
        <div className="mw-svc-hero__inner mw-inner">
          <div className="mw-svc-hero__content">
            <p className="mw-section-tag" aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{h.eyebrow}</span>
            </p>
            <h1 id="er-hero-title" className="mw-svc-hero__title">
              {h.title}<br />
              <span className="mw-svc-hero__title-em">{h.titleEm}</span><span className="mw-stop" aria-hidden="true" />
            </h1>
            <p className="mw-svc-hero__lead">{h.lead}</p>
            <div className="mw-svc-hero__ctas">
              <a
                href={h.emergencyHref}
                className="mw-cta mw-cta--ghost"
                aria-label={`Call 24/7 emergency: ${h.emergencyDisplay}`}
              >
                <span className="mw-cta__sup">24/7 emergency</span>
                <span className="mw-cta__num">{h.emergencyDisplay}</span>
              </a>
              <Link href={h.secondaryCta.href} className="mw-cta mw-cta--solid">
                {h.secondaryCta.label} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mw-svc-hero__bleed-photo" aria-hidden="true">
          <img className="mw-svc-hero__photo" src={h.photo} alt="" />
        </div>
      </section>

      {/* §2 — Response timeline (signature layout) */}
      <section
        className="mw-svc-tl-sec mw-svc-tl-sec--v1"
        aria-labelledby="er-tl-title"
        style={{
          "--mw-tl-notify-count": tl.notifications.length,
          "--mw-tl-notify-interval": "4200ms",
        }}
      >
        <div className="mw-svc-tl-sec__inner mw-inner">
          <div className="mw-svc-tl-sec__intro">
            <div className="mw-svc-tl-sec__intro-copy">
              <header className="mw-svc-tl-sec__head" data-reveal>
                <div>
                  <p className="mw-section-tag" aria-hidden="true">
                    <span className="mw-section-tag-mark" />
                    <span className="mw-section-tag-label">{tl.eyebrow}</span>
                  </p>
                  <h2 id="er-tl-title" className="mw-section-title">
                    {tl.title}<span className="mw-stop" aria-hidden="true" />
                  </h2>
                </div>
              </header>
              <p className="mw-svc-tl-sec__lead" data-reveal>{tl.lead}</p>
            </div>
            <TimelineNotifyCycle notifications={tl.notifications} />
          </div>

          <ol className="mw-svc-tl" data-reveal-stagger>
            {tl.steps.map((st) => (
              <li key={st.name} className="mw-svc-tl__stage">
                <span className="mw-svc-tl__time">{st.t}</span>
                <span className="mw-svc-tl__axis" aria-hidden="true">
                  <span className="mw-svc-tl__node" />
                </span>
                <h3 className="mw-svc-tl__name">{st.name}</h3>
                <p className="mw-svc-tl__body">{st.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* §3 — What we respond to (dark incident grid) */}
      <section className="mw-svc-inds mw-svc-inds--dark mw-svc-inds--photo" aria-labelledby="er-inc-title">
        <div className="mw-svc-inds__inner mw-inner">
          <header className="mw-svc-inds__head" data-reveal>
            <div className="mw-svc-inds__head-left">
              <p className="mw-section-tag" aria-hidden="true">
                <span className="mw-section-tag-mark" />
                <span className="mw-section-tag-label mw-section-tag-label--invert">{inc.eyebrow}</span>
              </p>
              <h2 id="er-inc-title" className="mw-section-title">
                {inc.title}<span className="mw-stop" aria-hidden="true" />
              </h2>
            </div>
            <p className="mw-svc-inds__lead">{inc.lead}</p>
          </header>

          <ul className="mw-svc-inds__grid" data-reveal-stagger>
            {inc.items.map((item) => (
              <li key={item.name} className="mw-svc-ind">
                <span className="mw-svc-ind__thumb" aria-hidden="true">
                  <img src={item.photo} alt="" loading="lazy" />
                </span>
                <span className="mw-svc-ind__text">
                  <span className="mw-svc-ind__name">{item.name}</span>
                  <span className="mw-svc-ind__desc">{item.blurb}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* §4 — Coverage & capabilities (light split) */}
      <section className="mw-svc-cov" aria-labelledby="er-cov-title">
        <div className="mw-svc-cov__grid mw-inner">
          <div className="mw-svc-cov__content" data-reveal>
            <p className="mw-section-tag" aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{cov.eyebrow}</span>
            </p>
            <h2 id="er-cov-title" className="mw-section-title">
              {cov.title}<span className="mw-stop" aria-hidden="true" />
            </h2>
            <p className="mw-svc-cov__lead">{cov.lead}</p>
            <ul className="mw-svc-cov__list" data-reveal-stagger>
              {cov.provides.map((item) => (
                <li key={item} className="mw-svc-cov__item">
                  <span className="mw-svc-cov__item-text">{item}</span>
                  <span className="mw-svc-cov__item-arr" aria-hidden="true">→</span>
                </li>
              ))}
            </ul>
          </div>
          <figure className="mw-svc-photo mw-svc-cov__media" data-reveal>
            <img className="mw-svc-cov__photo" src={cov.photo} alt="" loading="lazy" />
            <figcaption className="mw-svc-cov__cap">
              <span className="mw-svc-cov__cap-mark" aria-hidden="true" />
              <span>Spill containment across central Canada</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* §5 — Closing CTA (save the number) + related */}
      <section className="mw-svc-cta" aria-labelledby="er-cta-title">
        <img
          className="mw-svc-cta__truck"
          src="/miller/truck-graphic-angled.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
        <div className="mw-svc-cta__inner mw-inner">
          <div className="mw-svc-cta__content" data-reveal>
            <p className="mw-section-tag" aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{cta.eyebrow}</span>
            </p>
            <h2 id="er-cta-title" className="mw-section-title mw-svc-cta__title">
              {cta.title}<span className="mw-stop" aria-hidden="true" />
            </h2>
            <p className="mw-svc-cta__body">{cta.body}</p>
            <div className="mw-svc-cta__actions">
              <a
                href={h.emergencyHref}
                className="mw-cta mw-cta--ghost"
                aria-label={`Call 24/7 emergency: ${h.emergencyDisplay}`}
              >
                <span className="mw-cta__sup">24/7 emergency</span>
                <span className="mw-cta__num">{h.emergencyDisplay}</span>
              </a>
              <Link href="/contact-us/" className="mw-cta mw-cta--solid">
                Contact Miller <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <RelatedServices currentSlug="emergency-response" />
        </div>
      </section>
    </>
  );
}
