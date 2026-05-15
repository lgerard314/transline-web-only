// Process page template — PageHero + 4-card highlights + descriptive
// prose + FAQ + CTA. Used by
// `/processes/disposal-of-inorganic-oxidizers/`.

import Link from "next/link";
import { PageHero, FAQ } from "@white-owl/brand/components";

export function ProcessTemplate({
  eyebrow = "Process",
  title,
  lead,
  photo,
  highlights = [], // [{ title, body }]
  sections = [],   // [{ heading, body }] — descriptive prose
  faqs = [],       // [{ q, a }]
  cta,             // { label, href }
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lead={lead} photo={photo} />

      {highlights.length > 0 && (
        <section className="tl-container" style={{ padding: "var(--space-8) 0" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {highlights.map((h, i) => (
              <div key={i} className="mw-loc-card" style={{ minHeight: 140 }}>
                <h3 className="mw-loc-card__title">{h.title}</h3>
                <p>{h.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {sections.length > 0 && (
        <section className="tl-container" style={{ padding: "var(--space-7) 0" }}>
          <div className="tl-prose" style={{ maxWidth: 720 }}>
            {sections.map((s, i) => (
              <section key={i} style={{ marginBottom: "var(--space-6)" }}>
                {s.heading && <h2 className="tl-display tl-display--s">{s.heading}</h2>}
                {s.body && <p>{s.body}</p>}
              </section>
            ))}
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="tl-container" style={{ padding: "var(--space-7) 0" }}>
          <h2 className="tl-display tl-display--m">Frequently asked</h2>
          <FAQ items={faqs} />
        </section>
      )}

      {cta && (
        <section className="tl-container" style={{ padding: "var(--space-7) 0" }}>
          <Link href={cta.href} className="tl-btn tl-btn--primary">
            {cta.label} <span className="tl-btn-arr">→</span>
          </Link>
        </section>
      )}
    </>
  );
}
