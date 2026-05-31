import { jobPlantManager as c } from "@/lib/content/job-plant-manager";

const APPLY_EMAIL = "hr@millerenvironmental.mb.ca";

export function RoleBodySection() {
  const { roleSummary, responsibilities, requirements, benefits } = c;
  const title = c.hero.title;

  return (
    <>
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
            <a href={`mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(title)}`}>
              {APPLY_EMAIL}
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
