// Case Study detail template — hero (with case-study image), Problem
// (h2 + prose), Approach (h2 + nested h3 + prose blocks), Results table
// (semantic <table>), CTA footer. Used by the 4 case-study detail routes
// under `/case-studies/*`.
//
// Content is passed as plain strings + arrays via props (design spec §5.1).
// The template owns layout markup only.

import Link from "next/link";
import { PageHero } from "@white-owl/brand/components";

export function CaseStudyDetailTemplate({
  eyebrow = "Case study",
  title,
  lead,
  photo,
  meta,                  // optional [{ k, v }] for hero meta row
  problem,               // { heading?, body: string | string[] }
  approach,              // { heading?, subsections: [{ title, body: string | string[] }] }
  results,               // { heading?, rows: [{ benefit, outcome }], summary? }
  cta = { label: "Contact Miller", href: "/contact-us" },
}) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        lead={lead}
        photo={photo}
        meta={meta}
      />

      {problem && (
        <section className="tl-container" style={{ padding: "var(--space-8) 0" }}>
          <div className="tl-prose" style={{ maxWidth: 760 }}>
            <h2 className="tl-display tl-display--m">
              {problem.heading ?? "The problem"}
            </h2>
            <Body body={problem.body} />
          </div>
        </section>
      )}

      {approach && (
        <section className="tl-container" style={{ padding: "var(--space-7) 0" }}>
          <div className="tl-prose" style={{ maxWidth: 760 }}>
            <h2 className="tl-display tl-display--m">
              {approach.heading ?? "Miller's approach"}
            </h2>
            {approach.subsections?.map((s, i) => (
              <section key={i} style={{ marginTop: "var(--space-5)" }}>
                <h3 className="tl-display tl-display--xs">{s.title}</h3>
                <Body body={s.body} />
              </section>
            ))}
          </div>
        </section>
      )}

      {results && (
        <section className="tl-container" style={{ padding: "var(--space-7) 0" }}>
          <h2 className="tl-display tl-display--m">
            {results.heading ?? "The results"}
          </h2>
          {results.summary && (
            <p style={{ marginTop: 8, color: "var(--c-ink-2)" }}>{results.summary}</p>
          )}
          <div className="mw-results-table-wrap" style={{ overflowX: "auto", marginTop: 16 }}>
            <table className="mw-results-table">
              <thead>
                <tr>
                  <th scope="col">Benefit</th>
                  <th scope="col">Outcome</th>
                </tr>
              </thead>
              <tbody>
                {results.rows?.map((r, i) => (
                  <tr key={i}>
                    <th scope="row">{r.benefit}</th>
                    <td>{r.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {cta && (
        <section className="tl-container" style={{ padding: "var(--space-7) 0 var(--space-8)" }}>
          <Link href={cta.href} className="tl-btn tl-btn--primary">
            {cta.label} <span className="tl-btn-arr">→</span>
          </Link>
        </section>
      )}
    </>
  );
}

function Body({ body }) {
  if (!body) return null;
  if (Array.isArray(body)) {
    return body.map((p, i) => <p key={i}>{p}</p>);
  }
  return <p>{body}</p>;
}
