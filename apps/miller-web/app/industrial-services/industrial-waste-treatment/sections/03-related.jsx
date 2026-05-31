import Link from "next/link";
import { ServiceCard } from "@white-owl/brand/components";
import { relatedServices } from "@/lib/services";
import { IWT } from "@/lib/content/service-industrial-waste-treatment";

export function RelatedSection() {
  const related = relatedServices(IWT.slug, 3);

  if (related.length === 0) return null;

  return (
    <section className="tl-container" style={{ padding: "var(--space-8) 0" }}>
      <h2 className="tl-display tl-display--m">Related services</h2>
      <div
        className="tl-svc-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
          marginTop: 24,
        }}
      >
        {related.map((s, i) => (
          <ServiceCard
            key={s.id}
            num={String(i + 1).padStart(2, "0")}
            title={s.title}
            body={s.summary}
            icon={s.icon}
            href={`/industrial-services/${s.slug}`}
          />
        ))}
      </div>
      <p style={{ marginTop: 24 }}>
        <Link href="/industrial-services">All services →</Link>
      </p>
    </section>
  );
}
