import { MissionBlock01 } from "@/components-v2/04_blocks/prose/mission-block-01";
import { sectionProps } from "@/components-v2/section-config";
import { TimelineWipe } from "@/components-v2/06_sections/splits/timeline-wipe";
import { TimelineHeadReveal } from "@/components-v2/06_sections/splits/timeline-head-reveal";
import { TimelineReveal } from "@/components-v2/06_sections/splits/timeline-reveal";
import { TimelineStats } from "@/components-v2/06_sections/splits/timeline-stats";

// History — a two-column "record": the LEFT column stacks an image-banner (the
// truck photo, with the eyebrow/title/lead read over it) above the mission
// block; the RIGHT column carries the milestone list (plain ticks). The grid
// tops the record level with the banner.
export function TimelineSplit01({ content, config = {} }) {
  const { eyebrow, stage, title, lead, milestones, plate, mission, headingId } = content;
  return (
    <section className="mw-ten3" aria-labelledby={headingId} {...sectionProps(config)}>
      <div className="mw-inner">
        <div className="mw-ten3__grid">
          {/* LEFT column — three stacked banner-style containers. Each is a clone of
              the image-banner (full-bleed, chevron edge, chevron-wipe reveal driven by
              <TimelineWipe>); stacked flush and equal-height, they reveal in sequence as
              you scroll — each begins its wipe once the band above it is fully on screen. */}
          <div className="mw-ten3__col">
            {/* Pinned stack — banner (mission) + highlights move as one unit; frozen at
                timeline end so both scroll off the top together. */}
            <div className="mw-ten3__stack">
            <div className="mw-ten3__banner" data-history-wipe>
              <div className="mw-ten3__plate-window">
                <div className="mw-ten3__plate-zoom">
                  <img className="mw-ten3__plate2-img" src={plate.imgSrc} alt="Miller Environmental truck" loading="lazy" data-parallax-img data-parallax-x="1" data-parallax-max="0.055" />
                </div>
              </div>
              <TimelineWipe />
              <TimelineHeadReveal />
              <header className="mw-ten3__head">
                <h2 id={headingId} className="mw-ten3__title">
                  <span className="mw-ten3__head-line" data-head-part="rise">
                    <span className="mw-ten3__head-rise-in">{title.lead}</span>
                  </span>
                  <span className="mw-ten3__head-line" data-head-part="rise">
                    <span className="mw-ten3__head-rise-in"><span className="mw-ten3__title-em">{title.em}</span></span>
                  </span>
                </h2>
                <p className="mw-ten3__lead" data-head-part="fade">
                  <span className="mw-ten3__lead-in">{lead}</span>
                </p>
              </header>
              {/* Mission layer — rises from the banner bottom (clip + translate), scrubbed by
                  --mission-rev. <TimelineStats> starts it once the timeline top hits the header,
                  holds briefly, then ramps over ~two wheel-clicks of scroll. */}
              <div className="mw-ten3__bmission">
                <div className="mw-ten3__bmission-window">
                  <div className="mw-ten3__bmission-zoom">
                    <div className="mw-ten3__mission-panel">
                      <MissionBlock01 paragraphs={mission.paragraphs} cta={mission.cta} heading={mission.heading} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Container 2: track-record highlights — one tall chevron band (stats at the top).
                Grows OUT of the banner's bottom on entry (--stats-out). <TimelineStats> releases
                the stack once the last milestone bottom passes the stat-caption line. */}
            <aside className="mw-ten3__aside">
              <ul className="mw-ten3__plate2-stats">
                {plate.stats.map((s) => (
                  <li className="mw-ten3__plate2-stat" key={s.label}>
                    <span className="mw-ten3__plate2-num"><span className="mw-ten3__plate2-val" data-val={s.num}>{s.num}</span><span className="mw-ten3__plate2-unit">{s.unit}</span></span>
                    <span className="mw-ten3__plate2-label">{s.label}</span>
                  </li>
                ))}
              </ul>
            </aside>
            </div>
            <TimelineStats />
          </div>

          {/* RIGHT column — the milestone record. Each item slides up from the bottom
              of the screen once there's room for the whole item + 40px above the fold,
              and slides up OUT the top once its rest-top reaches the top (<TimelineReveal>,
              data-timeline-reveal), so the items opt out of the shared [data-reveal]
              observer. The two sticky edge fades keep the spine off the screen edges. */}
          <div className="mw-ten3__record">
            {/* Record eyebrow — moved here from the banner; <TimelineReveal> reveals it the
                moment the bg-chip banner is fully rendered (its wipe completes). */}
            <p className="mw-ten3__field mw-ten3__record-eyebrow" data-record-eyebrow>
              {stage ? <span>{stage}</span> : null}
              <span className="mw-ten3__field-rule" />
              <span>{eyebrow}</span>
            </p>
            <ol className="mw-ten3__line" aria-label="Company milestones" data-timeline-reveal>
              <span className="mw-ten3__edge mw-ten3__edge--top" aria-hidden="true" />
              {milestones.map((m) => (
              <li className="mw-ten3__item" key={m.year}>
                {/* Connector tick + the hover hill live on the <li> (tick + its
                    ::after); the text is wrapped so its hover scale-up doesn't
                    fight the <li>'s own reveal animation, which holds the <li>'s
                    transform. */}
                <span className="mw-ten3__tick" aria-hidden="true" />
                <div className="mw-ten3__item-body">
                  <span className="mw-ten3__year">{m.year}</span>
                  <span className="mw-ten3__ititle">{m.title}</span>
                  <span className="mw-ten3__ibody">{m.body}</span>
                </div>
              </li>
            ))}
            <span className="mw-ten3__edge mw-ten3__edge--bottom" aria-hidden="true" />
            </ol>
          </div>
          <TimelineReveal />
        </div>
      </div>
    </section>
  );
}
