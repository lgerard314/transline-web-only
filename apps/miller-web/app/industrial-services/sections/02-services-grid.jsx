import { ServiceCard } from "@white-owl/brand/components";
import { SERVICES } from "@/lib/services";

// §2 — Ten-card services grid driven by lib/services.js.
export function ServicesGridSection() {
  return (
    <section className="tl-container" style={{ padding: "0 0 var(--space-8)" }}>
      <div
        className="tl-svc-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {SERVICES.map((s, i) => (
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
    </section>
  );
}
