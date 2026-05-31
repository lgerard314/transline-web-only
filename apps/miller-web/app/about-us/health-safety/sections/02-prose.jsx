import { aboutHealthSafety as c } from "@/lib/content/about-health-safety";

export function ProseSection() {
  const { sections, lists } = c;

  return (
    <section className="tl-container" style={{ padding: "var(--space-8) 0" }}>
      <div className="tl-prose" style={{ maxWidth: 720 }}>
        {sections.map((s, i) => (
          <section key={i} style={{ marginBottom: "var(--space-6)" }}>
            {s.heading && <h2 className="tl-display tl-display--s">{s.heading}</h2>}
            {s.body && <p>{s.body}</p>}
          </section>
        ))}
        {lists.map((l, i) => (
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
