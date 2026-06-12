import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
import { GhostPhoneCta01 } from "@/components-v2/02_buttons/ghost/ghost-phone-cta-01";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
import { IconLink01 } from "@/components-v2/03_cards/icon-link/icon-link-01";
import { Fac2Dumptruck01 } from "@/components-v2/05_widgets/graphics/fac2-dumptruck-01";
import { FinalWashDrive } from "@/components-v2/06_sections/callouts/final-wash-drive";
import { sectionProps } from "@/components-v2/section-config";

/* Faint tiled dumptruck wash (logan 2026-06-11) — replaces the old truck photo +
   logomark side columns. The VBEC dumptruck (Fac2Dumptruck01, defined ONCE in <defs>
   and stamped with one-node <use> instances) repeats across the band on the house
   −30° diagonal, every other row flipped to drive the opposite way, at half the VBEC
   stage's prominence (same --fac2-truck-* recipe, 0.5 opacity — set in final-cta.css).
   viewBox + slice keeps the texture density consistent on every viewport. */
/* Tuning (logan): trucks 25% smaller (scale 0.15), −30° diagonal, row gap cut to a
   quarter (truck h 141 + 35 gap → stepY 177) — a much denser weave. Alternating rows
   are BRICK-OFFSET half a step (never column-stacked) and split into two LANE groups:
   the truck art faces LEFT, so unflipped rows drive local −x and flipped rows local
   +x — and because the lanes sit INSIDE the rotated group, a plain translateX in CSS
   is movement along the 30° heading on screen. <FinalWashDrive> steers both lanes
   from the mouse via --wash-drive (final-cta.css). */
const WASH = { vbW: 2000, vbH: 1400, scale: 0.15, stepX: 420, stepY: 177, x0: -1600, y0: -1000, cols: 14, rows: 20, truckW: 1672 };

function FinalTruckWash() {
  const ltr = []; // flipped rows — trucks face RIGHT, drive local +x
  const rtl = []; // unflipped rows — trucks face LEFT, drive local −x
  for (let r = 0; r < WASH.rows; r++) {
    const y = WASH.y0 + r * WASH.stepY;
    const flipped = r % 2 === 1;
    const brick = flipped ? WASH.stepX / 2 : 0;
    for (let c = 0; c < WASH.cols; c++) {
      const x = WASH.x0 + brick + c * WASH.stepX;
      (flipped ? ltr : rtl).push(
        <use
          key={`${r}-${c}`}
          href="#mw-final-truck"
          transform={flipped
            ? `translate(${x + WASH.truckW * WASH.scale} ${y}) scale(-${WASH.scale} ${WASH.scale})`
            : `translate(${x} ${y}) scale(${WASH.scale})`}
        />,
      );
    }
  }
  /* TWO OVERLAID SVG LAYERS, one per lane, parallax-translated in SCREEN space along
     the ±30° heading via CSS on the <svg> ELEMENTS themselves — replaced elements
     composite on the GPU, so the scrub is a pure transform with NO repaint. (The
     first cut transformed <g> groups INSIDE one svg, which re-rasterized all 280
     trucks every scroll frame — visibly choppy.) <use href> resolves document-wide,
     so the defs live in the first layer only. */
  const rotate = `rotate(-30 ${WASH.vbW / 2} ${WASH.vbH / 2})`;
  const viewBox = `0 0 ${WASH.vbW} ${WASH.vbH}`;
  return (
    <div className="mw-final__wash" aria-hidden="true">
      <svg className="mw-final__wash-layer mw-final__wash-layer--rtl" viewBox={viewBox} preserveAspectRatio="xMidYMid slice">
        <defs>
          <g id="mw-final-truck"><Fac2Dumptruck01 /></g>
        </defs>
        <g transform={rotate}>{rtl}</g>
      </svg>
      <svg className="mw-final__wash-layer mw-final__wash-layer--ltr" viewBox={viewBox} preserveAspectRatio="xMidYMid slice">
        <g transform={rotate}>{ltr}</g>
      </svg>
    </div>
  );
}

export function MultiColumnCta01({ content, config = {} }) {
  const { eyebrow, title, body, primaryCta, ghostPhone, socials, socialsAriaLabel, headingId } = content;
  return (
    <section className="mw-final" aria-labelledby={headingId} {...sectionProps(config)}>
      <FinalTruckWash />
      <FinalWashDrive />
      <div className="mw-final__grid" data-reveal-stagger data-layout={config.layout}>
        <div className="mw-final__col mw-final__col--content">
          <p className="mw-section-tag mw-final__tag" aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">{eyebrow}</span>
          </p>
          <h2 id={headingId} className="mw-final__title"><StopText01>{title.replace(/\.\s*$/, "")}</StopText01></h2>
          <p className="mw-final__body">{body}</p>
          <div className="mw-final__row">
            <SolidCta01 href={primaryCta.href}>{primaryCta.label} <ActionArrow01 /></SolidCta01>
            <GhostPhoneCta01 sup={ghostPhone.sup} num={ghostPhone.num} href={ghostPhone.href} ariaLabel={`Call 24/7 emergency: ${ghostPhone.num}`} />
          </div>
          <span className="mw-final__divider" aria-hidden="true" />
          <ul className="mw-final__socials" aria-label={socialsAriaLabel}>
            {socials.map((so) => (<li key={so.label}><IconLink01 label={so.label} href={so.href} path={so.path} /></li>))}
          </ul>
        </div>
      </div>
    </section>
  );
}
