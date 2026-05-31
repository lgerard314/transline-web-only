import { aboutProfessionalAffiliations as c } from "@/lib/content/about-professional-affiliations";

export function IntroSection() {
  return (
    <section className="tl-container" style={{ padding: "var(--space-8) 0" }}>
      <div className="tl-prose" style={{ maxWidth: 720 }}>
        {c.sections.map((s, i) => (
          <section key={i} style={{ marginBottom: "var(--space-6)" }}>
            {s.heading && <h2 className="tl-display tl-display--s">{s.heading}</h2>}
            {s.body && <p>{s.body}</p>}
          </section>
        ))}
      </div>
    </section>
  );
}
