import { processInorganicOxidizers as c } from "@/lib/content/process-disposal-of-inorganic-oxidizers";

export function HighlightsSection() {
  const highlights = c.highlights;
  if (!highlights?.length) return null;

  return (
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
  );
}
