import Image from "next/image";
import { CustodyRule } from "../_components/CustodyThread";
import { MxArrow } from "../_components/marks";

// RECORD · SINCE 1996 — the proof. A vertical record of milestones (plain ticks,
// not diamonds — the diamond stays special), each line drawing in on reveal,
// paired with the graded truck plate (the stats live ON the photograph, never on
// linework) and the mission. Cream surface — the quiet, evidentiary band before
// the dark crescendo.
export function HistoryTimeline({ content }) {
  const c = content;
  return (
    <section className="mx-hist mx-section mx-cream" aria-labelledby={c.headingId}>
      <CustodyRule />
      <div className="mx-inner">
        <div className="mx-hist__head">
          <p className="mx-field">
            <span>{c.field}</span>
            <span className="mx-field__rule" />
            <span>{c.eyebrow}</span>
          </p>
          <h2 id={c.headingId} className="mx-h2">
            {c.title.lead} <span className="mx-h2__em">{c.title.em}</span>
          </h2>
          <p className="mx-lead">{c.lead}</p>
        </div>

        <div className="mx-hist__grid">
          <ol className="mx-hist__line">
            {c.milestones.map((m) => (
              <li className="mx-hist__item" key={m.year} data-mx-reveal="fade">
                <span className="mx-hist__tick" aria-hidden="true" />
                <span className="mx-hist__year">{m.year}</span>
                <span className="mx-hist__ititle">{m.title}</span>
                <span className="mx-hist__ibody">{m.body}</span>
              </li>
            ))}
          </ol>

          <aside className="mx-hist__aside">
            <div className="mx-hist__plate">
              <Image src={c.plate.imgSrc} alt="Miller Environmental truck" fill sizes="(max-width: 960px) 100vw, 42vw" className="mx-hist__plateimg" />
              <ul className="mx-hist__platestats">
                {c.plate.stats.map((s) => (
                  <li className="mx-hist__pstat" key={s.label}>
                    <span className="mx-hist__pnum">{s.num}<span className="mx-hist__punit">{s.unit}</span></span>
                    <span className="mx-hist__plabel">{s.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mx-hist__mission">
              <p className="mx-hist__mtitle">{c.mission.heading}</p>
              {c.mission.paragraphs.map((p, i) => (
                <p className="mx-hist__mpara" key={i}>{p}</p>
              ))}
              <a className="mx-btn mx-btn--text" href={c.mission.cta.href}>{c.mission.cta.label} <MxArrow /></a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
