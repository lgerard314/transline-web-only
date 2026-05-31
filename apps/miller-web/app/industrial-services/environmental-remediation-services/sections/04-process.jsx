import { MillerProcessFlow } from "@/components/MillerProcessFlow";
import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";

export function ProcessSection() {
  return (
    <section className="tl-container mw-section">
      <p className="mw-section__eyebrow">Our Process</p>
      <h2 className="tl-display tl-display--m mw-section__title">
        A five-stage remediation process
      </h2>
      <p className="mw-section__lead" style={{ marginBottom: 24 }}>
        Every project — routine pickup or emergency mobilisation — passes
        through the same five stages.
      </p>
      <MillerProcessFlow steps={c.process} />
    </section>
  );
}
