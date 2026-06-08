import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { SectorGridMotion02 } from "@/components-v2/06_sections/grids/sector-grid-motion-02";
import { sectionProps } from "@/components-v2/section-config";

// ARCED PHOTO DISPLAY — a reusable section that fans a set of photos along a rainbow arch. Ported
// from an external arc-hero reference (Tailwind + rounded cards + JS resize) and rebuilt natively:
// CSS-only, clay tokens, SQUARED photos (no radius). The 16 sub-industry photos fan along the arch.
// Below it, on the SAME arc geometry (dropped down by --cat-drop), the 4 primary categories sit as
// small clay DIAMOND markers with their full-size labels centred on top — evenly spaced, with the
// end margins equal to the gaps between them. Angle/arc position are precomputed here and handed to
// CSS as custom props, so this stays a server component — radii/sizes scale per breakpoint in CSS,
// and the staggered fade-up reveal is driven by SectorGridMotion02 (no per-frame JS).
// (Formerly SectorDiamonds02 — the home "who we serve" arc; kept as a general arced-photo template.)
const PHOTO_BASE = "/miller/custom";
const START_ANGLE = 20; // degrees — right-hand foot of the arch
const END_ANGLE = 160; //  degrees — left-hand foot of the arch

export function ArcPhotoDisplay01({ content, config = {} }) {
  const { headingId, eyebrow, title, lead, cards } = content;
  // Swap the first and last categories (Industrial ↔ Community) — and, through the flatMap below,
  // their photos too — so Community takes the right end of the arc and Industrial the left.
  const orderedCards = cards.length >= 2 ? [cards[cards.length - 1], ...cards.slice(1, -1), cards[0]] : cards;
  // Flatten the categories down to their 16 sub-industry photos (skip the category tiles).
  const photos = orderedCards.flatMap((cat) => cat.items);
  const count = Math.max(photos.length, 2);
  const step = (END_ANGLE - START_ANGLE) / (count - 1);
  // Even horizontal distribution of the 4 categories across the arc's cos-span — used both to place
  // the category markers AND to centre each spotlight row above its own category.
  const cosStart = Math.cos((START_ANGLE * Math.PI) / 180);
  const cosEnd = Math.cos((END_ANGLE * Math.PI) / 180);
  const catCosAt = (k) => cosStart + (cosEnd - cosStart) * ((k + 1) / (orderedCards.length + 1));

  return (
    <section className="mw-secd2" aria-labelledby={headingId} {...sectionProps(config)}>
      {/* The arch — spans the full body-content width (.mw-inner). Each card sits on an
          ELLIPTICAL arc: horizontal radius is a % of the content width (--arc-rx) so the feet
          reach the column edges, vertical radius is a flatter px rise (--arc-ry). */}
      <div className="mw-secd2__arc mw-inner">
        {photos.map((p, i) => {
          const angle = START_ANGLE + step * i;
          const rad = (angle * Math.PI) / 180;
          const ci = Math.floor(i / 4); // which category this photo belongs to
          const catCos = catCosAt(ci);
          const isEndCat = ci === 0 || ci === orderedCards.length - 1;
          const style = {
            "--cosA": Math.cos(rad).toFixed(4), // x along the arc (−1 left … 1 right)
            "--sinA": Math.sin(rad).toFixed(4), // y along the arc (0 feet … 1 apex)
            "--rot": (angle / 4).toFixed(2), //   gentle outward lean, like the reference
            "--ai": i, //                         reveal-stagger index
            "--z": count - i, //                  right cards overlap left
            "--gi": (1.5 - (i % 4)).toFixed(1), // signed group position (rightmost +1.5 … leftmost −1.5) — fans OUTWARD on category hover
            "--cat-cx": catCos.toFixed(4), //                          x-centre of this photo's category → row centres above it
            "--cat-cy": Math.sqrt(1 - catCos * catCos).toFixed(4), //  its height on the arc → row sits a constant gap above the label
            "--cat-dy-cat": isEndCat ? "7px" : "-40px", //             ends nudge down 7px; middle two ride up 40px (negative = up) so their gather row tracks the raised label
            "--cat-dx-cat": isEndCat ? "0px" : (catCos >= 0 ? "30px" : "-30px"), // middle two shift their gather row 30px OUTWARD (toward the nearer edge) to track the nudged label
            "--cat-hl-dy": isEndCat ? "0px" : "-67px", //              middle two (Institutional/Infrastructure) drop their gather row ~67px so the sub-industry labels' tops line up with the arch's highest photo
          };
          return (
            // data-cat ties each photo to its category so a category hover can spotlight its 4 photos (see CSS :has()).
            <div className="mw-secd2__card" data-cat={ci} style={style} key={p.slug}>
              <div className="mw-secd2__card-inner">
                <img className="mw-secd2__card-img" src={`${PHOTO_BASE}/${p.slug}.webp`} alt={p.name} loading="lazy" decoding="async" />
              </div>
              {/* sub-industry caption — hidden until this photo's category is spotlighted (see CSS).
                  Non-breaking space after each "&" glues it to the next word so it never wraps alone. */}
              <span className="mw-secd2__card-cap" aria-hidden="true">{p.name.replace(/ & /g, " & ")}</span>
            </div>
          );
        })}
      </div>

      {/* Second arc — SAME arc geometry as the photos (--arc-rx/--arc-ry), dropped straight down
          by --cat-drop. Each category is a small clay diamond marker with its full-size label
          centred on the same arc point; the 4 are evenly spaced (equal end margins). Zero-height
          .mw-inner layer so its children share the photo arch's baseline + content-width
          coordinate system. Collapses to a 2×2 grid on mobile (see CSS). */}
      <div className="mw-secd2__cats mw-inner">
        {orderedCards.map((cat, k) => {
          // Distribute the 4 cards EVENLY HORIZONTALLY along the arc (equal x-gaps + equal end
          // margins): evenly-spaced cosA across the arc's horizontal span, then derive sinA so each
          // card still sits on the arc curve. (Even angles ≠ even x, since x = cosθ.)
          const cosA = catCosAt(k);
          const sinA = Math.sqrt(1 - cosA * cosA);
          // Nudge the two END cards (Industrial + Community, now first/last) down a hair.
          const isEnd = k === 0 || k === orderedCards.length - 1;
          const style = {
            "--cosA": cosA.toFixed(4),
            "--sinA": sinA.toFixed(4),
            "--ai": count + k, // settle in just after the 16 photos land
            "--z": cards.length - k,
            "--cat-dy": isEnd ? "7px" : "-40px", // ends nudge down 7px; middle two (Institutional/Infrastructure) ride up 40px
            "--cat-dx": isEnd ? "0px" : (cosA >= 0 ? "30px" : "-30px"), // middle two shift 30px OUTWARD horizontally (left one left, right one right)
          };
          return (
            <div className="mw-secd2__cat" data-cat={k} style={style} key={cat.title}>
              <span className="mw-secd2__cat-mark" aria-hidden="true" />
              <span className="mw-secd2__cat-name">{cat.title}</span>
            </div>
          );
        })}
      </div>

      {/* Intro copy nested under the arch — eyebrow/title/lead. The three lines rise in on the
          same .is-in reveal as the arch (so they reset with it); see CSS for the staggered timing
          that lands them just after the photo sweep. Eyebrow's own data-reveal is dropped so it
          doesn't double-animate. */}
      <div className="mw-secd2__intro">
        <Eyebrow01 label={eyebrow} />
        <h2 id={headingId} className="mw-secd2__title"><StopText01>{title}</StopText01></h2>
        <p className="mw-secd2__lead">{lead}</p>
      </div>

      <SectorGridMotion02 />
    </section>
  );
}
