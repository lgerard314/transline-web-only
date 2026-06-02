import { SECTOR_STATS, SECTOR_CARDS } from "@/lib/content/template-testing-home";
import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { StatCycle01 } from "@/components-v2/05_widgets/cycles/stat-cycle-01";
import { HoverCard01 } from "@/components-v2/05_widgets/galleries/hover-card-01";

export function HoverCardGrid01() {
  return (
    <section className="mw-sec2" aria-labelledby="mw-sectors-heading-copy">
      <div className="mw-inner">
        <header className="mw-sec2__head">
          <Eyebrow01 label="Who we serve" reveal />
          <div className="mw-sec2__head-split" data-reveal-stagger>
            <div className="mw-sec2__head-left">
              <h2 id="mw-sectors-heading-copy" className="mw-sec2__title">
                From refineries to households &mdash; and everything <span className="mw-nobr">between<span className="mw-stop" aria-hidden="true" /></span>
              </h2>
              <p className="mw-sec2__lead">
                Large industrial manufacturers, public agencies, small businesses, and even the household-hazardous-waste drop-off down the street &mdash; one operator, one chain of custody.
              </p>
            </div>
            <div className="mw-sec2__head-right">
              <StatCycle01 stats={SECTOR_STATS} />
            </div>
          </div>
        </header>
        <div className="mw-sec2__cards" data-reveal-stagger>
          {SECTOR_CARDS.map((card) => (<HoverCard01 key={card.title} title={card.title} items={card.items} />))}
        </div>
      </div>
    </section>
  );
}
