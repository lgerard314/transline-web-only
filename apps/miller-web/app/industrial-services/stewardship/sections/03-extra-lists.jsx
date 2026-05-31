import { stewardship as c } from "@/lib/content/service-stewardship";

// Stewardship-specific list block ("Additional services offered") that
// doesn't fit the compact body signature; rendered as a sibling section
// under the same container so the page reads as one cohesive block.
export function ExtraListsSection() {
  if (!c.extraLists?.length) return null;

  return (
    <section className="tl-container" style={{ padding: "0 0 var(--space-8)" }}>
      <div className="tl-prose" style={{ maxWidth: 720 }}>
        {c.extraLists.map((l, i) => (
          <section key={i} style={{ marginBottom: "var(--space-6)" }}>
            <h3 className="tl-display tl-display--xs">{l.heading}</h3>
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
