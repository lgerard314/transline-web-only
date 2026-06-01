import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";
import { StopText } from "@/components/StopText";
import { FlowRoute } from "@/components/FlowRoute";

// §4 — Our process, as an assessment → closure route. The head stacks
// (eyebrow → title → lead → route chip), then a two-column container pairs the
// five-stage route line (left) with cycling status banners (right) that stay in
// lock-step with a fill moving along the line.
export function ProcessSection() {
  const p = c.process;
  return (
    <section className="mw-flow" aria-labelledby="rem-steps-title">
      <div className="mw-flow__inner mw-inner">
        <header className="mw-flow__head">
          <p className="mw-section-tag" data-reveal aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label mw-section-tag-label--invert">{p.eyebrow}</span>
          </p>
          <h2 id="rem-steps-title" className="mw-section-title mw-flow__title" data-reveal>
            <StopText>{p.title}</StopText>
          </h2>
          <p className="mw-flow__lead" data-reveal>{p.lead}</p>
          <p className="mw-flow__route" data-reveal aria-hidden="true">
            <span className="mw-flow__route-mark" />
            {p.route}
          </p>
        </header>

        <FlowRoute steps={p.steps} notifications={p.notifications} />
      </div>
    </section>
  );
}
