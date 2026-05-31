import { RemediationCallback } from "@/components/RemediationCallback";
import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";
import { GENERAL_PHONE } from "@/lib/content/brand";

export function CallbackSection() {
  return (
    <section className="mw-section mw-section--tinted">
      <div className="tl-container">
        <p className="mw-section__eyebrow">Request a callback</p>
        <h2 className="tl-display tl-display--m mw-section__title">
          {c.callback.title}
        </h2>
        <p className="mw-section__lead" style={{ marginBottom: 20 }}>
          {c.callback.body}
        </p>
        <RemediationCallback />
        <p style={{ marginTop: 20, color: "var(--c-ink-2)", fontSize: 14 }}>
          {c.callback.emergency} General office: {GENERAL_PHONE}.
        </p>
      </div>
    </section>
  );
}
