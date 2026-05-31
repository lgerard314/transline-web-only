import { vacuumTruck as c } from "@/lib/content/service-vacuum-truck";

export function BodySection() {
  return (
    <section className="tl-container" style={{ padding: "var(--space-8) 0" }}>
      <CompactBody sections={c.sections} bullets={c.bullets} />
    </section>
  );
}

function CompactBody({ sections = [], bullets }) {
  return (
    <div className="tl-prose" style={{ maxWidth: 720 }}>
      {sections.map((s, i) => (
        <section key={i} style={{ marginBottom: "var(--space-6)" }}>
          {s.heading && <h2 className="tl-display tl-display--s">{s.heading}</h2>}
          {s.body && <p>{s.body}</p>}
        </section>
      ))}
      {Array.isArray(bullets) && bullets.length > 0 && (
        <ul>
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
