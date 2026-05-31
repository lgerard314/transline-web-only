import { aboutLicencingInformation as c } from "@/lib/content/about-licencing-information";

export function LicencesGridSection() {
  return (
    <section className="tl-container" style={{ padding: "0 0 var(--space-8)" }}>
      <div className="tl-prose" style={{ maxWidth: 720 }}>
        <section style={{ marginTop: "var(--space-6)" }}>
          <h2 className="tl-display tl-display--s">Available licences</h2>
          <div
            className="mw-licence-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
              marginTop: 16,
            }}
          >
            {c.licences.map((l) => (
              <div key={l.code} className="mw-loc-card">
                <h3 className="mw-loc-card__title">{l.name}</h3>
                <p className="tl-mono" style={{ margin: "8px 0", color: "var(--c-ink-2)" }}>
                  {l.code}
                </p>
                <a className="mw-cs-card__more" href={l.href} download>
                  Download · PDF, {l.sizeKB} KB
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
