import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { StatCycle01 } from "@/components-v2/05_widgets/cycles/stat-cycle-01";
import { HoverCard01 } from "@/components-v2/05_widgets/galleries/hover-card-01";
import { sectionProps } from "@/components-v2/section-config";

export function HoverCardGrid01({ content, config = {} }) {
  return (
    <section className="mw-sec2" aria-labelledby={content.headingId} {...sectionProps(config)}>
      <div className="mw-inner">
        <header className="mw-sec2__head">
          <Eyebrow01 label={content.eyebrow} reveal />
          <div className="mw-sec2__head-split" data-reveal-stagger data-layout={config.layout}>
            <div className="mw-sec2__head-left">
              <h2 id={content.headingId} className="mw-sec2__title"><StopText01>{content.title}</StopText01></h2>
              <p className="mw-sec2__lead">{content.lead}</p>
            </div>
            <div className="mw-sec2__head-right">
              <StatCycle01 stats={content.stats} />
            </div>
          </div>
        </header>
        <div className="mw-sec2__cards" data-reveal-stagger>
          {content.cards.map((card) => (<HoverCard01 key={card.title} title={card.title} items={card.items} />))}
        </div>
      </div>
    </section>
  );
}
