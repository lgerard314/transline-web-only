// HomeTemplate — server component. Implements design spec §3.1 in order:
//
//   1. Hero (3-frame CSS carousel)
//   2. Trust strip — only-in-Canada eyebrow + CertificationGrid + tenure
//   3. Services grid (10 cards, custom reorder)
//   4. Our Facility (VBEC) — promoted to position 4
//   5. "For Over 25 Years" editorial block
//   6. Our Mission + Core Values CTA
//   7. "Join The Miller Family"
//   8. Marquee with brand refrains
//   9. Final CTA (Contact + 24/7 emergency)
//
// No StatsBand — section is deleted entirely (design spec non-goals + §3.1).
//
// Content arrives as a single `content` prop sourced from
// `lib/content/home.js`. The template owns layout markup only — no inline
// copy here (design spec §5.1).

import Link from "next/link";
import { Marquee, ServiceCard } from "@white-owl/brand/components";
import { CertificationGrid } from "../CertificationGrid";
import { SERVICES } from "../../lib/services";

// Service ordering for the home grid (design spec §3.1):
// Industrial Waste Treatment, Environmental Remediation, Emergency Response,
// then the rest alphabetical.
const HOME_FIRST = [
  "industrial-waste-treatment",
  "environmental-remediation-services",
  "emergency-response",
];

function homeServiceOrder() {
  const map = new Map(SERVICES.map((s) => [s.slug, s]));
  const head = HOME_FIRST.map((slug) => map.get(slug)).filter(Boolean);
  const rest = SERVICES.filter((s) => !HOME_FIRST.includes(s.slug)).sort((a, b) =>
    a.title.localeCompare(b.title)
  );
  return [...head, ...rest];
}

export function HomeTemplate({ content }) {
  const c = content;
  const orderedServices = homeServiceOrder();

  return (
    <>
      {/* 1. HERO — 3-frame CSS carousel */}
      <section className="tl-hero mw-home-hero" data-variant="photo">
        <div className="mw-hero-carousel" aria-hidden="true">
          {c.hero.frames.map((src, i) => (
            <div
              key={i}
              className={`mw-hero-frame mw-hero-frame--${i + 1}`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
        </div>
        <div className="tl-container tl-hero__inner" style={{ position: "relative", zIndex: 2 }}>
          <div className="tl-hero__rule">
            <span className="tl-parallel__tick" style={{ borderColor: "rgba(46,191,165,0.85)" }} />
            <span className="tl-mono">{c.hero.eyebrow}</span>
            <span
              className="tl-parallel__line"
              style={{ background: "linear-gradient(to right, rgba(46,191,165,0.4), transparent)" }}
            />
          </div>
          <h1 className="tl-display tl-display--xl tl-hero__title">{c.hero.title}</h1>
          {c.hero.subhead && <p className="tl-lead tl-hero__lead">{c.hero.subhead}</p>}
          <div className="tl-hero__ctas">
            <Link href="/contact-us/" className="tl-btn tl-btn--primary tl-btn--lg">
              Contact Miller <span className="tl-btn-arr">→</span>
            </Link>
            <a
              href={c.finalCta.emergencyHref}
              className="tl-btn tl-btn--ghost-light tl-btn--lg"
              aria-label={`Call 24/7 emergency: ${c.finalCta.emergencyDisplay}`}
            >
              24/7 {c.finalCta.emergencyDisplay}
            </a>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <section className="tl-container mw-section">
        <div className="mw-trust-strip">
          <div className="mw-trust-strip__head">
            <p className="mw-trust-strip__claim">{c.trust.claim}</p>
            <span className="mw-trust-strip__tenure">{c.trust.tenure}</span>
          </div>
          <CertificationGrid />
        </div>
      </section>

      {/* 3. SERVICES GRID — 10 cards */}
      <section className="mw-section mw-section--tinted">
        <div className="tl-container">
          <p className="mw-section__eyebrow">{c.services.eyebrow}</p>
          <h2 className="tl-display tl-display--m mw-section__title">{c.services.title}</h2>
          <p className="mw-section__lead">{c.services.lead}</p>
          <div className="mw-svc-grid">
            {orderedServices.map((s, i) => (
              <ServiceCard
                key={s.id}
                num={String(i + 1).padStart(2, "0")}
                title={s.title}
                body={s.summary}
                icon={s.icon}
                href={`/industrial-services/${s.slug}/`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. VBEC — Our Facility */}
      <section className="tl-container mw-section">
        <div className="mw-vbec">
          <div>
            <p className="mw-section__eyebrow">{c.vbec.eyebrow}</p>
            <h2 className="tl-display tl-display--m mw-section__title">{c.vbec.title}</h2>
            <p className="mw-section__lead">{c.vbec.body}</p>
            <p>
              <Link href={c.vbec.aboutHref}>{c.vbec.aboutLinkLabel} →</Link>
            </p>
            <ul className="mw-vbec__cap-list">
              {c.vbec.capabilities.map((cap, i) => (
                <li key={i}>{cap}</li>
              ))}
            </ul>
            <p style={{ marginTop: 16 }}>
              <Link href={c.vbec.cta.href} className="tl-btn tl-btn--primary">
                {c.vbec.cta.label} <span className="tl-btn-arr">→</span>
              </Link>
            </p>
          </div>
          <div
            className="mw-vbec__media"
            style={{ backgroundImage: `url(${c.vbec.image})` }}
            role="img"
            aria-label={`${c.vbec.eyebrow} — building exterior`}
          />
        </div>
      </section>

      {/* 5. EDITORIAL — "For Over 25 Years" verbatim */}
      <section className="mw-section mw-section--tinted">
        <div className="tl-container">
          <div className="mw-editorial">
            <span className="mw-editorial__rule" aria-hidden="true" />
            <p className="mw-section__eyebrow" style={{ textAlign: "center" }}>
              {c.editorial.eyebrow}
            </p>
            <p>{c.editorial.body}</p>
          </div>
        </div>
      </section>

      {/* 6. MISSION */}
      <section className="tl-container mw-section">
        <div className="mw-mission">
          <p className="mw-section__eyebrow">{c.mission.eyebrow}</p>
          <h2 className="tl-display tl-display--m mw-section__title">Hazardous waste management, done deliberately.</h2>
          <p>{c.mission.body}</p>
          <p style={{ marginTop: 24 }}>
            <Link href={c.mission.cta.href} className="tl-btn tl-btn--primary">
              {c.mission.cta.label} <span className="tl-btn-arr">→</span>
            </Link>
          </p>
        </div>
      </section>

      {/* 7. JOIN MILLER FAMILY */}
      <section className="mw-section mw-section--dark">
        <div className="tl-container">
          <p className="mw-section__eyebrow">{c.joinFamily.eyebrow}</p>
          <h2 className="tl-display tl-display--m mw-section__title">Build a career at Miller.</h2>
          <p className="mw-section__lead">{c.joinFamily.intro}</p>
          <div className="mw-join" style={{ marginTop: 32 }}>
            <div className="mw-join__card">
              <h3 className="tl-display tl-display--s">{c.joinFamily.whyTitle}</h3>
              <p>{c.joinFamily.whyBody}</p>
              <p style={{ marginTop: 16 }}>
                <Link href={c.joinFamily.whyCta.href} className="tl-btn tl-btn--ghost-light">
                  {c.joinFamily.whyCta.label} <span className="tl-btn-arr">→</span>
                </Link>
              </p>
            </div>
            <div className="mw-join__card">
              <h3 className="tl-display tl-display--s">{c.joinFamily.opportunitiesTitle}</h3>
              <p>{c.joinFamily.opportunitiesBody}</p>
              <p style={{ marginTop: 16 }}>
                <Link href={c.joinFamily.opportunitiesCta.href} className="tl-btn tl-btn--ghost-light">
                  {c.joinFamily.opportunitiesCta.label} <span className="tl-btn-arr">→</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MARQUEE — brand refrains */}
      <section style={{ padding: "var(--space-7) 0", borderTop: "1px solid var(--c-line)", borderBottom: "1px solid var(--c-line)" }}>
        <Marquee items={c.marquee} />
      </section>

      {/* 9. FINAL CTA */}
      <section className="tl-container mw-final-cta">
        <p className="mw-section__eyebrow">{c.finalCta.eyebrow}</p>
        <h2 className="tl-display tl-display--m mw-section__title">{c.finalCta.title}</h2>
        <p style={{ maxWidth: "52ch", margin: "0 auto" }}>{c.finalCta.body}</p>
        <div className="mw-final-cta__row">
          <Link href={c.finalCta.contactHref} className="tl-btn tl-btn--primary tl-btn--lg">
            Contact Miller <span className="tl-btn-arr">→</span>
          </Link>
          <a
            href={c.finalCta.emergencyHref}
            className="tl-btn tl-btn--dark tl-btn--lg"
            aria-label={`Call 24/7 emergency: ${c.finalCta.emergencyDisplay}`}
          >
            24/7 {c.finalCta.emergencyDisplay}
          </a>
        </div>
      </section>
    </>
  );
}
