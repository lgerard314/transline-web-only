import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { CountUp01 } from "@/components-v2/05_widgets/counters/count-up-01";
import { sectionProps } from "@/components-v2/section-config";

// L6 · scale-band-01 — the home page's signature "moment": a full-bleed deep-
// walnut band carrying ONE hero-scale figure that counts up on scroll-in, a
// supporting line, and a quiet secondary trio. The dark field is the page's
// mid-scroll anchor in the long light stretch; the drama is scale, not motion.
// Server shell; only the <CountUp01> number is a client leaf.
//
// Content keys consumed:
//   headingId  — id on the <h2>; referenced by aria-labelledby on <section>
//   eyebrow    — mono eyebrow label (rendered inverted for the dark surface)
//   figure     — { value:Number, suffix, unit } — the hero count-up + its unit
//   body       — supporting sentence (cream prose)
//   support    — [{ value, label }] — the quiet secondary figures (no count-up)
export function ScaleBand01({ content, config = {} }) {
  const { headingId, eyebrow, figure, body, support } = content;
  return (
    <section className="mw-scale" aria-labelledby={headingId} {...sectionProps(config)}>
      <div className="mw-inner">
        <Eyebrow01 label={eyebrow} invert reveal />
        <h2 id={headingId} className="mw-scale__fig" data-reveal>
          <CountUp01 value={figure.value} suffix={figure.suffix} className="mw-scale__num" />
          <span className="mw-scale__unit">{figure.unit}</span>
        </h2>
        <p className="mw-scale__body" data-reveal>{body}</p>
        <ul className="mw-scale__support" data-reveal-stagger>
          {support.map((s) => (
            <li key={s.label} className="mw-scale__support-item">
              <span className="mw-scale__support-val">{s.value}</span>
              <span className="mw-scale__support-label">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
