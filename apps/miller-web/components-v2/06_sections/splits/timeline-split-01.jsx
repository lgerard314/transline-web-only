import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { VerticalTimeline01 } from "@/components-v2/05_widgets/timelines/vertical-timeline-01";
import { PlateStat01 } from "@/components-v2/04_blocks/stats/plate-stat-01";
import { MissionBlock01 } from "@/components-v2/04_blocks/prose/mission-block-01";
import { sectionProps } from "@/components-v2/section-config";

export function TimelineSplit01({ content, config = {} }) {
  const { eyebrow, title, lead, timelineNote, milestones, plate, mission, headingId } = content;
  return (
    <section className="mw-ten3" aria-labelledby={headingId} {...sectionProps(config)}>
      <div className="mw-inner">
        <div className="mw-ten3__grid">
          <aside className="mw-ten3__timeline" aria-label="Company milestones">
            <p className="mw-ten3__timeline-note">{timelineNote}</p>
            <VerticalTimeline01 items={milestones} />
          </aside>
          <div className="mw-ten3__body">
            <header className="mw-ten3__head" data-reveal>
              <Eyebrow01 label={eyebrow} />
              <h2 id={headingId} className="mw-ten3__title">
                {title.lead} <span className="mw-ten3__title-em"><StopText01>{title.em}</StopText01></span>
              </h2>
              <p className="mw-ten3__lead">{lead}</p>
            </header>
            <div className="mw-ten3__plate" aria-label="Track record" data-reveal>
              <img className="mw-ten3__plate-img" src={plate.imgSrc} alt="" aria-hidden="true" loading="lazy" />
              <dl className="mw-ten3__plate-stats">
                {plate.stats.map((st) => (<PlateStat01 key={st.label} num={st.num} unit={st.unit} label={st.label} />))}
              </dl>
            </div>
            <MissionBlock01 paragraphs={mission.paragraphs} cta={mission.cta} heading={mission.heading} />
          </div>
        </div>
      </div>
    </section>
  );
}
