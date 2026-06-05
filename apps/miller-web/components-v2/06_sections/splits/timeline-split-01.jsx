import { MissionBlock01 } from "@/components-v2/04_blocks/prose/mission-block-01";
import { sectionProps } from "@/components-v2/section-config";

// History — ported to the /v2 "record" grammar: a full-width field-head on
// top, a plain static milestone list (ticks, not interactive diamonds) on the
// left, and a sticky aside on the right carrying the truck plate + mission so
// the mission stays in view while the long record scrolls past it.
export function TimelineSplit01({ content, config = {} }) {
  const { eyebrow, stage, title, lead, milestones, plate, mission, headingId } = content;
  return (
    <section className="mw-ten3" aria-labelledby={headingId} {...sectionProps(config)}>
      <div className="mw-inner">
        <header className="mw-ten3__head" data-reveal>
          {/* Field-head: the /v2 manifest grammar — a mono `record —— field` document line above the title. */}
          <p className="mw-ten3__field">
            {stage ? <span>{stage}</span> : null}
            <span className="mw-ten3__field-rule" />
            <span>{eyebrow}</span>
          </p>
          <h2 id={headingId} className="mw-ten3__title">
            {title.lead} <span className="mw-ten3__title-em">{title.em}</span>
          </h2>
          <p className="mw-ten3__lead">{lead}</p>
        </header>

        <div className="mw-ten3__grid">
          <ol className="mw-ten3__line" aria-label="Company milestones">
            {milestones.map((m) => (
              <li className="mw-ten3__item" key={m.year} data-reveal>
                <span className="mw-ten3__tick" aria-hidden="true" />
                <span className="mw-ten3__year">{m.year}</span>
                <span className="mw-ten3__ititle">{m.title}</span>
                <span className="mw-ten3__ibody">{m.body}</span>
              </li>
            ))}
          </ol>

          <aside className="mw-ten3__aside">
            <div className="mw-ten3__plate2" aria-label="Track record" data-reveal>
              <img className="mw-ten3__plate2-img" src={plate.imgSrc} alt="Miller Environmental truck" loading="lazy" data-parallax-img data-parallax-x="1" data-parallax-max="0.055" />
              <ul className="mw-ten3__plate2-stats">
                {plate.stats.map((s) => (
                  <li className="mw-ten3__plate2-stat" key={s.label}>
                    <span className="mw-ten3__plate2-num">{s.num}<span className="mw-ten3__plate2-unit">{s.unit}</span></span>
                    <span className="mw-ten3__plate2-label">{s.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <MissionBlock01 paragraphs={mission.paragraphs} cta={mission.cta} heading={mission.heading} />
          </aside>
        </div>
      </div>
    </section>
  );
}
