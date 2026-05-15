import { ServiceDetailTemplate } from "../../../components/templates/ServiceDetailTemplate";
import { stewardship as c } from "../../../lib/content/service-stewardship";

export const metadata = { title: "Stewardship" };

// Stewardship has an extra list block ("Additional services offered") that
// doesn't fit the strict compact-variant signature; render it as a sibling
// section under the same container so the page reads as one cohesive block.
export default function StewardshipPage() {
  return (
    <>
      <ServiceDetailTemplate
        variant="compact"
        slug="stewardship"
        eyebrow={c.hero.eyebrow}
        title={c.hero.title}
        lead={c.hero.lead}
        photo={c.hero.photo}
        sections={c.sections}
        bullets={c.bullets}
      />
      {c.extraLists?.length > 0 && (
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
      )}
    </>
  );
}
