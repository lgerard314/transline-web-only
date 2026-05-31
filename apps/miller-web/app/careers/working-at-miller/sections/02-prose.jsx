import { careersWorkingAtMiller as c } from "@/lib/content/careers-working-at-miller";

export function ProseSection() {
  return (
    <section className="tl-container" style={{ padding: "var(--space-8) 0" }}>
      <div className="tl-prose" style={{ maxWidth: 720 }}>
        {c.sections.map((s, i) => (
          <section key={i} style={{ marginBottom: "var(--space-6)" }}>
            {s.heading && <h2 className="tl-display tl-display--s">{s.heading}</h2>}
            {s.body && <p>{s.body}</p>}
          </section>
        ))}
        {c.lists.map((l, i) => (
          <section key={i} style={{ marginBottom: "var(--space-6)" }}>
            {l.heading && <h3 className="tl-display tl-display--xs">{l.heading}</h3>}
            <ul>
              {l.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
