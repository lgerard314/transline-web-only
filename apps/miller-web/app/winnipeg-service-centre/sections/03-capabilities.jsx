import { winnipegServiceCentre as c } from "@/lib/content/winnipeg-service-centre";

export function CapabilitiesSection() {
  const { capabilities } = c;
  if (!Array.isArray(capabilities) || capabilities.length === 0) return null;

  return (
    <section className="tl-container" style={{ padding: "var(--space-7) 0" }}>
      <h2 className="tl-display tl-display--m">Capabilities</h2>
      <ul style={{ marginTop: 16 }}>
        {capabilities.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </section>
  );
}
