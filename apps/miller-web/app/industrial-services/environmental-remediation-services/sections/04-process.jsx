import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";
import { FlowRoute } from "@/components/FlowRoute";

// §4 — Our process, as an assessment → closure route. FlowRoute renders the
// stacked head (eyebrow → title → lead → route chip) and the cycling status
// banners in a two-column intro above the five-stage route line; the banners
// stay in lock-step with a fill moving along the line.
export function ProcessSection() {
  const p = c.process;
  return (
    <section className="mw-flow" aria-labelledby="rem-steps-title">
      <div className="mw-flow__inner mw-inner">
        <FlowRoute
          eyebrow={p.eyebrow}
          title={p.title}
          lead={p.lead}
          route={p.route}
          steps={p.steps}
          notifications={p.notifications}
          titleId="rem-steps-title"
        />
      </div>
    </section>
  );
}
