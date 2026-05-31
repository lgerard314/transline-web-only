import { processInorganicOxidizers as c } from "@/lib/content/process-disposal-of-inorganic-oxidizers";

export function ProseSection() {
  const sections = c.sections;
  if (!sections?.length) return null;

  return (
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
  );
}
