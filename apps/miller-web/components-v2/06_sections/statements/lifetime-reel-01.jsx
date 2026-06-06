import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { LifetimeReel } from "@/components-v2/05_widgets/lifetime-reel/lifetime-reel";
import { sectionProps } from "@/components-v2/section-config";

// L6 · lifetime-reel-01 — the home page's signature "money shot": a full-bleed
// deep-walnut band carrying THREE highlight diamonds that auto-advance once the
// section scrolls into view, joined by one continuous "growing line" of seal
// stroke + measured connector. D1 lands centred with a long lead below it, parks
// left as D2 enters, then D2 parks right and D3 splits in (final L→R: D1, D3, D2).
// Each diamond's numeral counts up in lockstep with its seal drawing closed; the
// short label sits beneath, and a longer reveal paragraph surfaces on hover/tap.
// Server shell; the animated reel (and its count-up leaves) is a client widget.
//
// Content keys consumed:
//   headingId   — id on the sr-only <h2>; referenced by aria-labelledby on <section>
//   srHeading   — visually-hidden section heading text
//   eyebrow     — mono eyebrow label (rendered inverted for the dark surface)
//   highlights  — [{ value:Number, suffix, unit, label, reveal }] — the three diamonds
// Config: scheme / token overrides via sectionProps.
export function LifetimeReel01({ content, config = {} }) {
  const { headingId, srHeading, eyebrow, highlights } = content;
  return (
    <section className="mw-lr" aria-labelledby={headingId} {...sectionProps(config)}>
      {/* Faint Canada outline map wash — drifts with the shared viewport
          parallax (same depth feel as the hero photo), tuned to travel more on
          scroll for a deeper sense of the map sitting behind the content. The
          NEGATIVE speed inverts the drift so scrolling down reveals more of the
          map's bottom. Decorative only. */}
      <div className="mw-lr__bg" data-parallax-img data-parallax-speed="-0.34" data-parallax-max="0.2" aria-hidden="true" />
      <h2 id={headingId} className="tl-sr-only">{srHeading}</h2>
      <div className="mw-inner mw-lr__inner">
        <Eyebrow01 label={eyebrow} invert reveal />
        <LifetimeReel highlights={highlights} />
      </div>
    </section>
  );
}
