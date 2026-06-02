import { FlowRoute } from "@/components/FlowRoute";
import { sectionProps } from "@/components-v2/section-config";

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
