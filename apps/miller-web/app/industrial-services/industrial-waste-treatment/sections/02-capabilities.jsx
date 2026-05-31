import { IWT } from "@/lib/content/service-industrial-waste-treatment";
import { ONLY_IN_CANADA_CLAIM } from "@/lib/content/brand";

export function CapabilitiesSection() {
  const groups = IWT.groups;
  const trustBadge = ONLY_IN_CANADA_CLAIM;

  return (
    <section className="tl-container" style={{ padding: "var(--space-8) 0" }}>
      <div style={{ maxWidth: 920 }}>
        {trustBadge && <p className="mw-trust-badge">{trustBadge}</p>}
        <div style={{ display: "grid", gap: "var(--space-7)", marginTop: "var(--space-5)" }}>
          {groups.map((g, i) => (
            <section key={i}>
              {g.heading && <h2 className="tl-display tl-display--s">{g.heading}</h2>}
              {g.body && <p style={{ marginBottom: 12 }}>{g.body}</p>}
              {Array.isArray(g.items) && g.items.length > 0 && (
                <ul>
                  {g.items.map((it, j) => (
                    <li key={j}>{it}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
