import { HOME as c } from "@/app/(home)/home";
import { MILESTONES } from "@/lib/content/template-testing-home";
import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { VerticalTimeline01 } from "@/components-v2/05_widgets/timelines/vertical-timeline-01";
import { PlateStat01 } from "@/components-v2/04_blocks/stats/plate-stat-01";
import { MissionBlock01 } from "@/components-v2/04_blocks/prose/mission-block-01";

const MISSION_PARAGRAPHS = [
  "At Miller Environmental, our mission is to lead the hazardous waste disposal industry by exemplifying unwavering commitment to environmentally responsible practices, rigorous regulatory compliance, and continuous innovation.",
  "We prioritize safety in all operations, ensuring the well-being of our team, clients, and the communities we serve.",
  "Our dedication to transparency fosters trust, while active community engagement reflects our belief in shared responsibility.",
];

export function TimelineSplit01() {
  return (
    <section className="mw-ten3" aria-labelledby="mw-tenure-heading-copy-b">
      <div className="mw-inner">
        <div className="mw-ten3__grid">
          <aside className="mw-ten3__timeline" aria-label="Company milestones">
            <p className="mw-ten3__timeline-note">*hover for more info</p>
            <VerticalTimeline01 items={MILESTONES} />
          </aside>
          <div className="mw-ten3__body">
            <header className="mw-ten3__head" data-reveal>
              <Eyebrow01 label="Our history" />
              <h2 id="mw-tenure-heading-copy-b" className="mw-ten3__title">
                Three decades in <span className="mw-ten3__title-em">hazardous <span className="mw-nobr">waste<span className="mw-stop" aria-hidden="true" /></span></span>
              </h2>
              <p className="mw-ten3__lead">
                Miller Environmental was formed in 1996 as Manitoba&rsquo;s first private-public hazardous-waste operator. Vaughn Bullough joined as General Manager in 1997 and led operations for twenty-five years. The facility was renamed in his honour in 2022. The work continues.
              </p>
            </header>
            <div className="mw-ten3__plate" aria-label="Track record" data-reveal>
              <img className="mw-ten3__plate-img" src="/miller/full-truck-sideview.png" alt="" aria-hidden="true" loading="lazy" />
              <dl className="mw-ten3__plate-stats">
                <PlateStat01 num="25" unit="+yrs" label="Relationships" />
                <PlateStat01 num="96" unit="%" label="In-house" />
                <PlateStat01 num="4.5" unit="ML/yr" label="Solvent reclaimed" />
              </dl>
            </div>
            <MissionBlock01 paragraphs={MISSION_PARAGRAPHS} cta={c.mission.cta} />
          </div>
        </div>
      </div>
    </section>
  );
}
