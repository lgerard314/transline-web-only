import { MissionBlock01 } from "@/components-v2/04_blocks/prose/mission-block-01";
import { sectionProps } from "@/components-v2/section-config";
import { TimelineWipe } from "@/components-v2/06_sections/splits/timeline-wipe";
import { TimelineReveal } from "@/components-v2/06_sections/splits/timeline-reveal";

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
              <TimelineWipe>); stacked in normal flow they reveal in sequence as you
              scroll — each begins its wipe once the band above it is fully on screen. */}
          <div className="mw-ten3__col">
            {/* Container 1: full-width, padding-free image-banner that just holds
                the background photo, with the body-content container nested
                inside it (read over a scrim). */}
            <div className="mw-ten3__banner" data-history-wipe>
              <div className="mw-ten3__plate-window">
                <div className="mw-ten3__plate-zoom">
                  <img className="mw-ten3__plate2-img" src={plate.imgSrc} alt="Miller Environmental truck" loading="lazy" data-parallax-img data-parallax-x="1" data-parallax-max="0.055" />
                </div>
              </div>
              <TimelineWipe />
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
            </div>

            {/* Container 2: the track-record stats — its own banner-clone band (solid
                fill instead of a photo). Wipes in once the image-banner above is fully on
                screen. data-history-wipe → <TimelineWipe> drives its --wipe. */}
            <aside className="mw-ten3__aside" data-history-wipe>
              <ul className="mw-ten3__plate2-stats">
                {plate.stats.map((s) => (
                  <li className="mw-ten3__plate2-stat" key={s.label}>
                    <span className="mw-ten3__plate2-num">{s.num}<span className="mw-ten3__plate2-unit">{s.unit}</span></span>
                    <span className="mw-ten3__plate2-label">{s.label}</span>
                  </li>
                ))}
              </ul>
            </aside>
            {/* Container 3: the mission — another banner-clone band, identical effect,
                wipes in once the highlights band above is fully on screen. */}
            <aside className="mw-ten3__maside" data-history-wipe>
              <div className="mw-ten3__mission-panel">
                <MissionBlock01 paragraphs={mission.paragraphs} cta={mission.cta} heading={mission.heading} />
              </div>
            </aside>
          </div>

          {/* RIGHT column — the milestone record. Each item slides up from the bottom
              of the screen once there's room for the whole item + 40px above the fold
              (<TimelineReveal>, data-timeline-reveal), so the items opt out of the
              shared [data-reveal] observer. */}
          <ol className="mw-ten3__line" aria-label="Company milestones" data-timeline-reveal>
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
          </ol>
          <TimelineReveal />
        </div>
      </div>
    </section>
  );
}
