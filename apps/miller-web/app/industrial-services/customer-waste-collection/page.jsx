import Link from "next/link";
import { RelatedServices } from "../../../components/RelatedServices";
import { customerWasteCollection as c } from "../../../lib/content/service-customer-waste-collection";

export const metadata = {
  title: "Customer Waste Collection",
  description: c.hero.lead,
  alternates: { canonical: "/industrial-services/customer-waste-collection/" },
};

export default function CustomerWasteCollectionPage() {
  const h = c.hero;
  const s = c.scale;
  const p = c.process;
  const ind = c.industries;
  const cta = c.cta;
  return (
    <>
      {/* HERO — service masthead. Split content/photo, deliberately lighter
          than the home hero (no full-viewport, no cycling headline). */}
      <section className="mw-svc-hero" aria-labelledby="cwc-hero-title">
        <div className="mw-svc-hero__inner mw-inner">
          <div className="mw-svc-hero__content">
            <p className="mw-section-tag" aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{h.eyebrow}</span>
            </p>
            <h1 id="cwc-hero-title" className="mw-svc-hero__title">
              {h.title}<br />
              <span className="mw-svc-hero__title-em">{h.titleEm}</span><span className="mw-stop" aria-hidden="true" />
            </h1>
            <p className="mw-svc-hero__lead">{h.lead}</p>
            <div className="mw-svc-hero__ctas">
              <Link href={h.primaryCta.href} className="mw-cta mw-cta--solid">
                {h.primaryCta.label} <span aria-hidden="true">→</span>
              </Link>
              <a
                href={h.emergencyHref}
                className="mw-cta mw-cta--ghost"
                aria-label={`Call 24/7 emergency: ${h.emergencyDisplay}`}
              >
                <span className="mw-cta__sup">24/7 emergency</span>
                <span className="mw-cta__num">{h.emergencyDisplay}</span>
              </a>
            </div>
          </div>

          <div className="mw-svc-hero__media">
            <figure className="mw-svc-photo mw-svc-hero__frame">
              <img className="mw-svc-hero__photo" src={h.photo} alt="" />
              <figcaption className="mw-svc-hero__cap">
                <span className="mw-svc-hero__cap-mark" aria-hidden="true" />
                <span>{h.caption}</span>
              </figcaption>
            </figure>
            <div className="mw-svc-hero__stat" aria-hidden="true">
              <span className="mw-svc-hero__stat-val">{h.stat.value}</span>
              <span className="mw-svc-hero__stat-label">{h.stat.label}</span>
            </div>
          </div>
        </div>
      </section>

      {/* §2 — Any-volume scale ribbon (signature layout for this page) */}
      <section className="mw-svc-scale" aria-labelledby="cwc-scale-title">
        <div className="mw-svc-scale__inner mw-inner">
          <header className="mw-svc-scale__head" data-reveal>
            <div className="mw-svc-scale__head-left">
              <p className="mw-section-tag" aria-hidden="true">
                <span className="mw-section-tag-mark" />
                <span className="mw-section-tag-label">{s.eyebrow}</span>
              </p>
              <h2 id="cwc-scale-title" className="mw-section-title">
                {s.title}<span className="mw-stop" aria-hidden="true" />
              </h2>
            </div>
            <p className="mw-svc-scale__lead">{s.lead}</p>
          </header>

          <ol className="mw-svc-scale__ribbon" data-reveal-stagger>
            {s.steps.map((st) => (
              <li key={st.num} className="mw-svc-scale__step">
                <div className="mw-svc-scale__bar-wrap">
                  <span className="mw-svc-scale__spec">{st.spec}</span>
                  <span className="mw-svc-scale__bar" aria-hidden="true" />
                </div>
                <div className="mw-svc-scale__meta">
                  <span className="mw-svc-scale__num">{st.num}</span>
                  <h3 className="mw-svc-scale__name">{st.name}</h3>
                  <p className="mw-svc-scale__note">{st.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* §3 — How it works (numbered process, dark band) */}
      <section className="mw-svc-steps" aria-labelledby="cwc-steps-title">
        <div className="mw-svc-steps__inner mw-inner">
          <header className="mw-svc-steps__head" data-reveal>
            <p className="mw-section-tag" aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label mw-section-tag-label--invert">{p.eyebrow}</span>
            </p>
            <h2 id="cwc-steps-title" className="mw-section-title mw-svc-steps__title">
              {p.title}<span className="mw-stop" aria-hidden="true" />
            </h2>
          </header>

          <ol className="mw-svc-steps__grid" data-reveal-stagger>
            {p.steps.map((st) => (
              <li key={st.num} className="mw-svc-step">
                <span className="mw-svc-step__num" aria-hidden="true">{st.num}</span>
                <h3 className="mw-svc-step__name">{st.name}</h3>
                <p className="mw-svc-step__text">{st.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* §4 — Industries we collect from */}
      <section className="mw-svc-inds" aria-labelledby="cwc-inds-title">
        <div className="mw-svc-inds__inner mw-inner">
          <header className="mw-svc-inds__head" data-reveal>
            <div className="mw-svc-inds__head-left">
              <p className="mw-section-tag" aria-hidden="true">
                <span className="mw-section-tag-mark" />
                <span className="mw-section-tag-label">{ind.eyebrow}</span>
              </p>
              <h2 id="cwc-inds-title" className="mw-section-title">
                {ind.title}<span className="mw-stop" aria-hidden="true" />
              </h2>
            </div>
            <p className="mw-svc-inds__lead">{ind.lead}</p>
          </header>

          <ul className="mw-svc-inds__grid" data-reveal-stagger>
            {ind.items.map((name) => (
              <li key={name} className="mw-svc-ind">
                <span className="mw-svc-ind__mark" aria-hidden="true" />
                <span className="mw-svc-ind__name">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* §5 — Closing CTA (dark, transparent truck graphic) + related services */}
      <section className="mw-svc-cta" aria-labelledby="cwc-cta-title">
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
            <h2 id="cwc-cta-title" className="mw-section-title mw-svc-cta__title">
              {cta.title}<span className="mw-stop" aria-hidden="true" />
            </h2>
            <p className="mw-svc-cta__body">{cta.body}</p>
            <div className="mw-svc-cta__actions">
              <Link href="/contact-us/" className="mw-cta mw-cta--solid">
                Contact Miller <span aria-hidden="true">→</span>
              </Link>
              <a
                href={h.emergencyHref}
                className="mw-cta mw-cta--ghost"
                aria-label={`Call 24/7 emergency: ${h.emergencyDisplay}`}
              >
                <span className="mw-cta__sup">24/7 emergency</span>
                <span className="mw-cta__num">{h.emergencyDisplay}</span>
              </a>
            </div>
          </div>

          <RelatedServices currentSlug="customer-waste-collection" />
        </div>
      </section>
    </>
  );
}
