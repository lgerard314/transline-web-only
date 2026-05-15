// RemediationTemplate — bespoke layout for
// `/industrial-services/environmental-remediation-services/`. Order
// follows design spec §3.3:
//
//   1. PageHero + 2 CTAs
//   2. 6-card "What We Do" grid
//   3. Industries served bullet list
//   4. <MillerProcessFlow> — 5-step <ol>
//   5. Case-study rail (4 CaseStudyCards)
//   6. "Why Choose Miller" 4-card grid
//   7. Callback form (client island)
//
// Mostly server; callback form is a client child rendered as a slot.

import Link from "next/link";
import { PageHero } from "@white-owl/brand/components";
import { MillerProcessFlow } from "../MillerProcessFlow";
import { CaseStudyCard } from "../CaseStudyCard";
import { RemediationCallback } from "../RemediationCallback";
import { GENERAL_PHONE, EMERGENCY_PHONE } from "../../lib/content/brand";

export function RemediationTemplate({ content }) {
  const c = content;

  const heroCtas = (
    <>
      <Link href="/contact-us/" className="tl-btn tl-btn--primary">
        Book a Consult <span className="tl-btn-arr">→</span>
      </Link>
      <a
        href={`tel:${EMERGENCY_PHONE.replace(/[^0-9+]/g, "")}`}
        className="tl-btn tl-btn--ghost-light"
        aria-label={`Call 24/7 emergency: ${EMERGENCY_PHONE}`}
      >
        24/7 {EMERGENCY_PHONE}
      </a>
    </>
  );

  return (
    <>
      <PageHero
        eyebrow={c.eyebrow}
        title={c.title}
        lead={c.lead}
        photo={c.photo}
        ctas={heroCtas}
      />

      {/* 2. What We Do — 6-card grid */}
      <section className="tl-container mw-section">
        <p className="mw-section__eyebrow">What We Do</p>
        <h2 className="tl-display tl-display--m mw-section__title">
          Six specialised remediation capabilities
        </h2>
        <p className="mw-section__lead">{c.whatWeDoIntro}</p>
        <div className="mw-rem-grid" style={{ marginTop: 24 }}>
          {c.whatWeDo.map((card, i) => (
            <article key={i} className="mw-rem-card">
              <h3 className="mw-rem-card__title">{card.title}</h3>
              <p className="mw-rem-card__body">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Industries served */}
      <section className="mw-section mw-section--tinted">
        <div className="tl-container">
          <p className="mw-section__eyebrow">Industries & Situations</p>
          <h2 className="tl-display tl-display--m mw-section__title">
            Industries & situations we serve
          </h2>
          <ul style={{ columns: 2, columnGap: 40, maxWidth: 720, marginTop: 16 }}>
            {c.industries.map((it, i) => (
              <li key={i} style={{ breakInside: "avoid" }}>{it}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Process — 5-step <ol> */}
      <section className="tl-container mw-section">
        <p className="mw-section__eyebrow">Our Process</p>
        <h2 className="tl-display tl-display--m mw-section__title">
          A five-stage remediation process
        </h2>
        <p className="mw-section__lead" style={{ marginBottom: 24 }}>
          Every project — routine pickup or emergency mobilisation — passes
          through the same five stages.
        </p>
        <MillerProcessFlow steps={c.process} />
      </section>

      {/* 5. Case studies */}
      <section className="mw-section mw-section--tinted">
        <div className="tl-container">
          <p className="mw-section__eyebrow">Case Studies</p>
          <h2 className="tl-display tl-display--m mw-section__title">
            Case studies that prove our expertise
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
              marginTop: 24,
            }}
          >
            {c.caseStudies.map((cs) => (
              <CaseStudyCard
                key={cs.href}
                href={cs.href}
                title={cs.title}
                location={cs.location}
                summary={cs.summary}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Choose Miller — 4-card grid */}
      <section className="tl-container mw-section">
        <p className="mw-section__eyebrow">Why Miller</p>
        <h2 className="tl-display tl-display--m mw-section__title">
          Why choose Miller Environmental
        </h2>
        <div className="mw-why-grid" style={{ marginTop: 24 }}>
          {c.whyChoose.map((card, i) => (
            <article key={i} className="mw-why-card">
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 7. Callback form */}
      <section className="mw-section mw-section--tinted">
        <div className="tl-container">
          <p className="mw-section__eyebrow">Request a callback</p>
          <h2 className="tl-display tl-display--m mw-section__title">
            {c.callback.title}
          </h2>
          <p className="mw-section__lead" style={{ marginBottom: 20 }}>
            {c.callback.body}
          </p>
          <RemediationCallback />
          <p style={{ marginTop: 20, color: "var(--c-ink-2)", fontSize: 14 }}>
            {c.callback.emergency} General office: {GENERAL_PHONE}.
          </p>
        </div>
      </section>
    </>
  );
}
