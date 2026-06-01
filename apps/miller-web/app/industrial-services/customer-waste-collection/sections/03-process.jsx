import { customerWasteCollection as c } from "@/lib/content/service-customer-waste-collection";
import { FlowRoute } from "@/components/FlowRoute";

// §3 — How it works, as a dock → VBEC routing manifest. FlowRoute renders the
// stacked head (eyebrow → title → lead → route chip) and the cycling
// notification banners in a two-column intro above the four-station route line;
// the banners stay in lock-step with a fill moving along the line.
export function ProcessSection() {
  const p = c.process;
  return (
    <section className="mw-flow" aria-labelledby="cwc-steps-title">
      <div className="mw-flow__inner mw-inner">
        <FlowRoute
          eyebrow={p.eyebrow}
          title={p.title}
          lead={p.lead}
          route={p.route}
          steps={p.steps}
          notifications={p.notifications}
          titleId="cwc-steps-title"
        />
      </div>
    </section>
  );
}
