// CareersTemplate — narrative spine for `/careers/` (design spec §3.7).
// Replaces the generic IndexTemplate so two open positions don't read as
// "we are not hiring." Five sections in order:
//
//   1. PageHero
//   2. Why Miller — 4-card grid (the four core values)
//   3. Open Positions — 2-card grid linking to each position route
//   4. Benefits teaser → /careers/benefits-rewards/
//   5. DEI block (verbatim from scrape)
//   6. Close — "Send your resume to hr@..."

import Link from "next/link";
import { PageHero } from "@white-owl/brand/components";

export function CareersTemplate({ content }) {
  const c = content;
  return (
    <>
      <PageHero
        eyebrow={c.eyebrow}
        title={c.title}
        lead={c.lead}
        photo={c.photo}
      />

      {/* 2. Why Miller — 4-card core values */}
      <section className="tl-container mw-section">
        <p className="mw-section__eyebrow">Why Miller</p>
        <h2 className="tl-display tl-display--m mw-section__title">{c.whyTitle}</h2>
        <p className="mw-section__lead">{c.whyLead}</p>
        <div className="mw-why-grid" style={{ marginTop: 24 }}>
          {c.whyCards.map((card, i) => (
            <article key={i} className="mw-why-card">
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Open Positions */}
      <section className="mw-section mw-section--tinted">
        <div className="tl-container">
          <p className="mw-section__eyebrow">Open Positions</p>
          <h2 className="tl-display tl-display--m mw-section__title">{c.positionsTitle}</h2>
          <p className="mw-section__lead">{c.positionsLead}</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
              marginTop: 24,
            }}
          >
            {c.positions.map((p) => (
              <Link key={p.href} href={p.href} className="mw-cs-card">
                <h3 className="mw-cs-card__title">{p.title}</h3>
                <p style={{ color: "var(--c-ink-2)", fontSize: 14 }}>{p.summary}</p>
                <span className="mw-cs-card__more">Apply now →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Benefits teaser */}
      <section className="tl-container mw-section">
        <p className="mw-section__eyebrow">Benefits</p>
        <h2 className="tl-display tl-display--m mw-section__title">{c.benefitsTitle}</h2>
        <p className="mw-section__lead">{c.benefitsBody}</p>
        <p style={{ marginTop: 16 }}>
          <Link href={c.benefitsCta.href} className="tl-btn tl-btn--primary">
            {c.benefitsCta.label} <span className="tl-btn-arr">→</span>
          </Link>
        </p>
      </section>

      {/* 5. DEI block — verbatim */}
      <section className="mw-section mw-section--tinted">
        <div className="tl-container">
          <p className="mw-section__eyebrow">Inclusion</p>
          <h2 className="tl-display tl-display--m mw-section__title">{c.deiTitle}</h2>
          <p className="mw-section__lead">{c.deiBody}</p>
          <ul style={{ marginTop: 16 }}>
            {c.deiInitiatives.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Close */}
      <section className="tl-container mw-section">
        <p className="mw-section__eyebrow">Get in touch</p>
        <h2 className="tl-display tl-display--m mw-section__title">{c.closeTitle}</h2>
        <p style={{ maxWidth: "60ch" }}>{c.closeBody}</p>
        <p style={{ marginTop: 24 }}>
          Send your resume to{" "}
          <a className="tl-mono" href={`mailto:${c.emailHr}`}>{c.emailHr}</a>.
        </p>
      </section>
    </>
  );
}
