import { FlowRoute } from "@/components/FlowRoute";
import { sectionProps } from "@/components-v2/section-config";

// ProcessFlow01 — server-component wrapper around FlowRoute (the route-line +
// cycling-notification flow). Reproduces the mw-flow shell from
// customer-waste-collection/sections/03-process.jsx verbatim.
// content: { eyebrow, title, lead, route, steps, notifications, titleId, interval? }
//   interval defaults to 3400 (FlowRoute's own default; CWC source omits it).
// config: { wide } — toggles mw-flow--wide (used by environmental-remediation).
// sectionProps(config) emits nothing for default config — no stray data-scheme/style.
export function ProcessFlow01({ content, config = {} }) {
  const { wide = false } = config;
  const cls = "mw-flow" + (wide ? " mw-flow--wide" : "");
  return (
    <section className={cls} aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-flow__inner mw-inner">
        <FlowRoute
          eyebrow={content.eyebrow}
          title={content.title}
          lead={content.lead}
          route={content.route}
          steps={content.steps}
          notifications={content.notifications}
          titleId={content.titleId}
          interval={content.interval ?? 3400}
        />
      </div>
    </section>
  );
}
