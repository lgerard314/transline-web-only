import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { SectorGridMotion } from "@/components-v2/06_sections/grids/sector-grid-motion";
import { sectionProps } from "@/components-v2/section-config";

const PHOTO_BASE = "/miller/custom";
const GUTTER_COLS = 7; // decorative diamonds extending off the left edge

// Who-we-serve as ONE uniform diamond grid. Every cell sits on a single argyle
// lattice (cells share edges at ±1,±1 in half-step units); empty cells are simply
// not rendered, so they read as transparent gaps. Per category: four photo diamonds
// form a small diamond (a top · b right · c bottom · d left) and the category's solid
// walnut diamond anchors the LEFT — lower-left for even columns, upper-left for odd —
// which makes the band zig-zag. The CONTENT cells start at col 0 (aligned to the body
// content's left edge); GHOST cells are added at negative columns so the lattice
// continues off the left of the page (gutter + clipped overflow) purely as decoration.
// Every cell carries an x-fraction (fx, 0 = far gutter … 1 = right edge) that
// SectorGridMotion uses to scrub a left→right reveal on scroll.
function buildGrid(cards) {
  const content = [];
  cards.forEach((cat, k) => {
    // 4-column pitch: photo diamonds point-touch between clusters and the relocated
    // category diamonds fill the columns between them → ONE continuous band.
    const ox = k * 4;
    const it = cat.items;
    content.push({ t: "photo", col: 2 + ox, row: 1, slug: it[0].slug, name: it[0].name }); // a top
    content.push({ t: "photo", col: 3 + ox, row: 2, slug: it[1].slug, name: it[1].name }); // b right
    content.push({ t: "photo", col: 2 + ox, row: 3, slug: it[2].slug, name: it[2].name }); // c bottom
    content.push({ t: "photo", col: 1 + ox, row: 2, slug: it[3].slug, name: it[3].name }); // d left
    content.push({ t: "cat", col: 0 + ox, row: k % 2 === 0 ? 3 : 1, title: cat.title });
  });
  // Normalise CONTENT so its first column is 0 (= body-content left) and its top row 0.
  const minCol = Math.min(...content.map((c) => c.col));
  const minRow = Math.min(...content.map((c) => c.row));
  content.forEach((c) => { c.col -= minCol; c.row -= minRow; });
  const cols = Math.max(...content.map((c) => c.col)) + 2; // grid spans the inner width
  const rows = Math.max(...content.map((c) => c.row)) + 2;

  // Decorative ghost diamonds continuing the argyle lattice into negative columns.
  const ghosts = [];
  for (let col = -1; col >= -GUTTER_COLS; col--) {
    // start at row 1 (skip the top row) so the gutter lattice doesn't poke a diamond
    // up above the content's lower-left edge.
    for (let row = 1; row <= rows - 2; row++) {
      if ((col + row) % 2 === 0) ghosts.push({ t: "ghost", col, row });
    }
  }

  const cells = [...ghosts, ...content];
  const minC = Math.min(...cells.map((c) => c.col));
  const maxC = Math.max(...cells.map((c) => c.col));
  const span = maxC - minC || 1;
  cells.forEach((c) => { c.fx = (c.col - minC) / span; });
  return { cells, cols, rows };
}

export function SectorDiamonds01({ content, config = {} }) {
  const { headingId, eyebrow, title, lead, cards } = content;
  const { cells, cols, rows } = buildGrid(cards);
  const sx = 100 / cols;
  const sy = 100 / rows;

  return (
    <section className="mw-secd" aria-labelledby={headingId} {...sectionProps(config)}>
      <div className="mw-inner">
        <header className="mw-secd__head">
          <Eyebrow01 label={eyebrow} reveal />
          <div className="mw-secd__head-solo" data-reveal-stagger>
            <h2 id={headingId} className="mw-secd__title"><StopText01>{title}</StopText01></h2>
            <p className="mw-secd__lead">{lead}</p>
          </div>
        </header>

        <div className="mw-secd__grid" style={{ aspectRatio: `${cols} / ${rows}` }}>
          {cells.map((c, i) => {
            const style = { left: `${c.col * sx}%`, top: `${c.row * sy}%`, width: `${2 * sx}%`, "--fx": c.fx.toFixed(3) };
            if (c.t === "ghost") {
              return (
                <div className="mw-secd__ghost" style={style} aria-hidden="true" key={`gh-${i}`}>
                  <svg className="mw-secd__ghost-svg" viewBox="0 0 200 200" preserveAspectRatio="none" aria-hidden="true">
                    <polygon className="mw-secd__ghost-shape" points="100,2 198,100 100,198 2,100" />
                  </svg>
                </div>
              );
            }
            if (c.t === "cat") {
              return (
                <div className="mw-secd__cat" style={style} key={`cat-${i}`}>
                  <svg className="mw-secd__cat-svg" viewBox="0 0 200 200" aria-hidden="true">
                    <rect className="mw-secd__cat-fill" x="29.3" y="29.3" width="141.4" height="141.4" rx="15" transform="rotate(45 100 100)" />
                  </svg>
                  <span className="mw-secd__cat-face"><h3 className="mw-secd__cat-name">{c.title}</h3></span>
                </div>
              );
            }
            return (
              <div className="mw-secd__photo" style={style} key={`ph-${i}`}>
                <span className="mw-secd__photo-clip">
                  <img className="mw-secd__photo-img" src={`${PHOTO_BASE}/${c.slug}.webp`} alt={c.name} loading="lazy" decoding="async" />
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <SectorGridMotion />
    </section>
  );
}
