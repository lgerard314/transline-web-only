import { QA } from "@/lib/content/about-quality-assurance";

export function ProseSection() {
  return (
    <section className="tl-container" style={{ padding: "var(--space-8) 0 0 0" }}>
      <div className="tl-prose" style={{ maxWidth: 720 }}>
        <section style={{ marginBottom: "var(--space-6)" }}>
          <h2 className="tl-display tl-display--s">{QA.intro.heading}</h2>
          <p>{QA.intro.body}</p>
        </section>
        <section style={{ marginBottom: "var(--space-6)" }}>
          <h2 className="tl-display tl-display--s">{QA.tracking.heading}</h2>
          <p>{QA.tracking.body}</p>
        </section>
      </div>
    </section>
  );
}
