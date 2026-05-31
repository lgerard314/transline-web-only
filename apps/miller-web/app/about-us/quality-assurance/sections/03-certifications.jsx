import { CertificationGrid } from "@/components/CertificationGrid";

export function CertificationsSection() {
  return (
    <section className="tl-container" style={{ padding: "0 0 var(--space-8) 0" }}>
      <div className="tl-prose" style={{ maxWidth: 720 }}>
        <section style={{ marginTop: "var(--space-7)" }}>
          <h3 className="tl-display tl-display--xs" style={{ marginBottom: 16 }}>
            Our certifications
          </h3>
          <CertificationGrid />
        </section>
      </div>
    </section>
  );
}
