// Services landing page — simple 10-card grid driven by lib/services.js.
// No hero copy per the scraped live site (file 01).
import { ServiceCard } from "@white-owl/brand/components";
import { SERVICES } from "../../lib/services";
import { EMERGENCY_PHONE } from "../../lib/content/brand";

const EMERGENCY_HREF = `tel:+1${EMERGENCY_PHONE.replace(/\D/g, "")}`;

export const metadata = { title: "Industrial Services" };

export default function ServicesLandingPage() {
  return (
    <>
      <section className="tl-container" style={{ padding: "var(--space-8) 0 var(--space-7)" }}>
        <h1 className="tl-display tl-display--xl">Industrial Services</h1>
      </section>

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

      <section className="tl-container" style={{ padding: "0 0 var(--space-8)" }}>
        <div className="mw-loc-card">
          <h2 className="mw-loc-card__title">24/7 spill response</h2>
          <p style={{ marginTop: 8 }}>
            For our 24/7 spill response team, call{" "}
            <a className="tl-mono" href={EMERGENCY_HREF}>{EMERGENCY_PHONE}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
