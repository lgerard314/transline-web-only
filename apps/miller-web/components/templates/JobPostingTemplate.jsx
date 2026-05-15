// Job Posting template — hero, role summary, Responsibilities <ul>,
// Requirements <ul>, Compensation / Benefits, "Apply by email" CTA. Used
// by the two job-posting routes under `/careers/*`.
//
// Content is plain strings + arrays via props (design spec §5.1). The
// "Apply by email" CTA is a real mailto: href; the apply email defaults to
// hr@millerenvironmental.mb.ca which is the address scraped from both
// postings (files 30-31).

import { PageHero } from "@white-owl/brand/components";

export function JobPostingTemplate({
  eyebrow = "Careers",
  title,
  lead,
  photo,
  location,           // string
  reportsTo,          // optional string
  roleSummary,        // string | string[]
  responsibilities,   // string[]
  requirements,       // string[]
  benefits,           // string | string[]
  applyEmail = "hr@millerenvironmental.mb.ca",
}) {
  const meta = [];
  if (location) meta.push({ k: "Location ", v: location });
  if (reportsTo) meta.push({ k: "Reports to ", v: reportsTo });

  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        lead={lead}
        photo={photo}
        meta={meta.length > 0 ? meta : null}
      />

      <section className="tl-container" style={{ padding: "var(--space-8) 0" }}>
        <div className="tl-prose" style={{ maxWidth: 760 }}>
          <h2 className="tl-display tl-display--m">Role summary</h2>
          <Body body={roleSummary} />
        </div>
      </section>

      {Array.isArray(responsibilities) && responsibilities.length > 0 && (
        <section className="tl-container" style={{ padding: "var(--space-7) 0" }}>
          <div className="tl-prose" style={{ maxWidth: 760 }}>
            <h2 className="tl-display tl-display--m">Key responsibilities</h2>
            <ul>
              {responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {Array.isArray(requirements) && requirements.length > 0 && (
        <section className="tl-container" style={{ padding: "var(--space-7) 0" }}>
          <div className="tl-prose" style={{ maxWidth: 760 }}>
            <h2 className="tl-display tl-display--m">Requirements</h2>
            <ul>
              {requirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {benefits && (
        <section className="tl-container" style={{ padding: "var(--space-7) 0" }}>
          <div className="tl-prose" style={{ maxWidth: 760 }}>
            <h2 className="tl-display tl-display--m">Compensation & benefits</h2>
            <Body body={benefits} />
          </div>
        </section>
      )}

      <section className="tl-container" style={{ padding: "var(--space-7) 0 var(--space-8)" }}>
        <div className="mw-loc-card">
          <h2 className="mw-loc-card__title">Apply now</h2>
          <p style={{ marginTop: 8 }}>
            Email your résumé to{" "}
            <a href={`mailto:${applyEmail}?subject=${encodeURIComponent(title)}`}>
              {applyEmail}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}

function Body({ body }) {
  if (!body) return null;
  if (Array.isArray(body)) return body.map((p, i) => <p key={i}>{p}</p>);
  return <p>{body}</p>;
}
