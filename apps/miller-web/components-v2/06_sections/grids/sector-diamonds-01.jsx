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
    content.push({ t: "photo", slot: "a", ci: k, col: 2 + ox, row: 1, slug: it[0].slug, name: it[0].name }); // a top
    content.push({ t: "photo", slot: "b", ci: k, col: 3 + ox, row: 2, slug: it[1].slug, name: it[1].name }); // b right
    content.push({ t: "photo", slot: "c", ci: k, col: 2 + ox, row: 3, slug: it[2].slug, name: it[2].name }); // c bottom
    content.push({ t: "photo", slot: "d", ci: k, col: 1 + ox, row: 2, slug: it[3].slug, name: it[3].name }); // d left
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

// ── Sub-sector labels + stems (desktop) ───────────────────────────────────────────────
// Each photo's name sits in the cream just above/below ITS OWN diamond (aligned to the
// diamond's centre column) and is joined to it by a thin VERTICAL stem dropping straight to
// the diamond's tip. Because every stem sits at its diamond's centre x, the stems are all
// parallel → they never cross, and they run down the cream seams between diamonds.
//
// Within a cluster the four photos form a small diamond — a on TOP, c on the BOTTOM, d/b in
// the MIDDLE (left/right). The label tiers mirror that vertical stack so a label is never
// higher than a label whose diamond sits above it: the top/bottom diamonds (a, c) take the
// OUTER tier, the two middle diamonds (d, b) the INNER tier. Parity picks each middle label's
// margin. Math is in LATTICE units (1 cell = 1 unit) → converted to % for HTML / the SVG.
const TIER_MID = 0.32; //  the two middle diamonds (d, b) — inner tier (close to the band)
const TIER_PERIM = 0.95; // the top/bottom diamonds (a, c) — outer tier, just clear of the middles
const STEM_GAP = 0.12; //  blank gap between a label and the start of its stem
const STEM_FRAC = 1; //    stem spans the full label→edge distance (labels sit close, stems connect)
const T_FRAC = 1 / 3; //   where along the angled face the stem attaches (0 = tip … 1 = side vertex)
const LINE_SCALE = 0.75; // default leaders 25% shorter: label pulled 25% back toward its face attach point
// Per-sector overrides (by slug) — these leaders run 50% shorter than full length; every
// other leader uses the LINE_SCALE default. (agriculture/mining and crown-insurers/
// construction-and-demolition leader lengths were swapped.)
const LINE_SCALE_BY_SLUG = {
  "mining": 0.5,
  "education-and-healthcare": 0.5,
  "crown-insurers": 0.5,
};

function labelSide(slot, k) {
  const even = k % 2 === 0;
  if (slot === "a") return "top";
  if (slot === "c") return "bottom";
  if (slot === "d") return even ? "top" : "bottom";
  return even ? "bottom" : "top"; // b
}

// Which angled FACE the stem comes out of: its side (top/bottom from labelSide) plus a
// horizontal direction h (-1 = the diamond's LEFT face, +1 = its RIGHT face). Every diamond
// attaches on the face that points into open cream (its OWN outward edge), and the perimeter
// diamonds (a, c) lean away from the middle label that shares their margin — so no stem
// crosses a photo or another stem.
function faceDir(slot, k) {
  const even = k % 2 === 0;
  if (slot === "a") return even ? 1 : -1; // lean away from d (left, even) / b (right, odd)
  if (slot === "c") return even ? -1 : 1; // lean away from b (right, even) / d (left, odd)
  if (slot === "d") return -1; //            left diamond → its left face
  return 1; //                               b: right diamond → its right face
}

export function SectorDiamonds01({ content, config = {} }) {
  const { headingId, eyebrow, title, lead, cards } = content;
  const { cells, cols, rows } = buildGrid(cards);
  const sx = 100 / cols;
  const sy = 100 / rows;

  // One label per photo, joined to its diamond by a VERTICAL stem. The stem still attaches to
  // the diamond's angled SIDE FACE (at T_FRAC along the edge), and the label is moved directly
  // over that attach point so the stem stays straight up-and-down. Perimeter outer, middle inner.
  const annotations = cells
    .filter((c) => c.t === "photo")
    .map((c) => {
      const side = labelSide(c.slot, c.ci);
      const isMid = c.slot === "d" || c.slot === "b";
      const off = isMid ? TIER_MID : TIER_PERIM;
      const cx = c.col + 1; // diamond centre column (lattice)
      const cy = c.row + 1; // diamond centre row (lattice)
      // Attach point on the angled face: from the near tip, T_FRAC of the way toward the side
      // vertex (h picks left/right face). Both coords shift by T_FRAC since the edge is at 45°.
      const h = faceDir(c.slot, c.ci);
      const ex = cx + h * T_FRAC;
      const ey = side === "top" ? cy - 1 + T_FRAC : cy + 1 - T_FRAC;
      // Full label anchor, then pulled (scale) of the way back toward the face point (ey) so the
      // whole leader (stem + its label) shortens while still meeting the face at ey.
      const labLatYFull = side === "top" ? -off : rows + off;
      const scale = LINE_SCALE_BY_SLUG[c.slug] ?? LINE_SCALE;
      const labLatY = ey + scale * (labLatYFull - ey); // label anchor (lattice y)
      // vertical stem at the attach x, from near the label down/up to the face point
      const labelEndY = side === "top" ? labLatY + STEM_GAP : labLatY - STEM_GAP;
      const y1 = ey + STEM_FRAC * (labelEndY - ey);
      return {
        labX: (ex / cols) * 100, // label sits directly over its attach point
        labY: (labLatY / rows) * 100,
        side,
        name: c.name,
        stem: { x1: ex, y1, x2: ex, y2: ey },
      };
    });

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

        <div className="mw-secd__field">
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
                  {/* Sub-sector label — footed in the lower diamond on a walnut wash so it
                      echoes the solid-walnut category diamonds. Clipped to the rhombus, so it
                      can never bleed into a neighbour; alt text already names the photo, so the
                      visible label is aria-hidden. */}
                  <span className="mw-secd__photo-label" aria-hidden="true">
                    <span className="mw-secd__photo-label-text">{c.name}</span>
                  </span>
                </span>
              </div>
            );
          })}
        </div>

          {/* Sub-sector labels + stems (desktop) — each name parked just above/below its own
              diamond and joined to its angled SIDE FACE by a straight stem. The SVG shares the
              grid's lattice coordinates (viewBox = cols × rows). aria-hidden: the photos
              already carry each name as alt text. */}
          <div className="mw-secd__annot" aria-hidden="true">
            <svg className="mw-secd__leaders" viewBox={`0 0 ${cols} ${rows}`} preserveAspectRatio="xMidYMid meet">
              {annotations.map((a, i) => (
                <line
                  key={`st-${i}`}
                  className="mw-secd__leader"
                  x1={a.stem.x1.toFixed(3)}
                  y1={a.stem.y1.toFixed(3)}
                  x2={a.stem.x2.toFixed(3)}
                  y2={a.stem.y2.toFixed(3)}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>
            {annotations.map((a, i) => (
              <span
                key={`lab-${i}`}
                className={`mw-secd__tag mw-secd__tag--${a.side}`}
                style={{ left: `${a.labX.toFixed(3)}%`, top: `${a.labY.toFixed(3)}%` }}
              >
                <span className="mw-secd__tag-text">{a.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <SectorGridMotion />
    </section>
  );
}
