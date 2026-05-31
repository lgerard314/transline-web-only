import { EMERGENCY_PHONE } from "@/lib/content/brand";

const EMERGENCY_HREF = `tel:+1${EMERGENCY_PHONE.replace(/\D/g, "")}`;

// §3 — 24/7 spill response callout card.
export function EmergencySection() {
  return (
    <section className="tl-container" style={{ padding: "0 0 var(--space-8)" }}>
      <div className="mw-loc-card">
        <h2 className="mw-loc-card__title">24/7 spill response</h2>
        <p style={{ marginTop: 8 }}>
          For our 24/7 spill response team, call{" "}
          <a className="tl-mono" href={EMERGENCY_HREF}>{EMERGENCY_PHONE}</a>.
        </p>
      </div>
    </section>
  );
}
