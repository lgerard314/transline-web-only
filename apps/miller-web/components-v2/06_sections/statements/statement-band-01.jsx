import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { sectionProps } from "@/components-v2/section-config";

// L6 · statement-band-01 — editorial "creed" interlude. A photo-free breath
// between dense sections: an oversized brand statement (Barlow Condensed, clay
// stop period, terracotta accent phrase) beside a single crescendo stat, on a
// warm cream surface with the shared 49° paper-grain wash. No links — this is a
// quiet pause, not a conversion section. Server component (no "use client").
//
// Content keys consumed:
//   headingId  — id on the <h2>; referenced by aria-labelledby on <section>
//   eyebrow    — string in the mono diamond eyebrow
//   statement  — { lead, em } — lead set plain, em set in accent with the stop
//   body       — supporting paragraph (plain prose)
//   stat       — { label, value, unit, note } — the oversized crescendo figure
export function StatementBand01({ content, config = {} }) {
  const { headingId, eyebrow, statement, body, stat } = content;
  return (
    <section className="mw-creed" aria-labelledby={headingId} {...sectionProps(config)}>
      <div className="mw-inner">
        <div className="mw-creed__grid" data-reveal-stagger>
          <div className="mw-creed__lead">
            <Eyebrow01 label={eyebrow} />
            <h2 id={headingId} className="mw-creed__statement">
              {statement.lead}{" "}
              <span className="mw-creed__em"><StopText01>{statement.em}</StopText01></span>
            </h2>
            <p className="mw-creed__body">{body}</p>
          </div>
          <div className="mw-creed__stat">
            <p className="mw-creed__stat-label">{stat.label}</p>
            <p className="mw-creed__stat-fig">
              <span className="mw-creed__stat-num">{stat.value}</span>
              <span className="mw-creed__stat-unit">{stat.unit}</span>
            </p>
            <p className="mw-creed__stat-note">{stat.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
