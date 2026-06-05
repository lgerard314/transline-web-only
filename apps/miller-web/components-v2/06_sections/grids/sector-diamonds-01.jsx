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

// ── Leader-line annotation geometry ──────────────────────────────────────────────────
// Each name is pulled OUT of its diamond into the cream margin and joined back by a leader
// that leaves the CENTRE of one diamond edge PERPENDICULAR to that edge (a short 45° stub,
// since every edge sits at 45°) and then runs STRAIGHT — at whatever angle it needs — to the
// label. Only the exit is fixed at 90°; the rest is free. All math is in LATTICE units (1
// cell = 1 unit); the SVG uses viewBox "0 0 cols rows", so 45° in lattice space renders as a
// true 45° on screen and HTML left%/top% line up exactly with the SVG coordinates.
//
// Exit edge + margin are chosen by the cluster's parity so the stub always fires into an
// EMPTY lattice cell (never across the category diamond or a neighbour). The band zig-zags,
// so for odd clusters the two middle labels (d, b) swap which margin they sit in.
//
// NO CROSSINGS: per margin the labels are laid on a single tier line and spread by an
// ORDER-PRESERVING min-spacing pass (sorted by stub-x, then pushed apart). Straight leaders
// from stub-ends to labels that share an x-order and a common tier line cannot cross.
const M = Math.SQRT1_2; // 1/√2 — the 45° component
const EDGE = {
  tr: { dx: 1.5, dy: 0.5, n: [M, -M] }, // top-right edge centre + outward normal
  tl: { dx: 0.5, dy: 0.5, n: [-M, -M] },
  br: { dx: 1.5, dy: 1.5, n: [M, M] },
  bl: { dx: 0.5, dy: 1.5, n: [-M, M] },
};
const STUB = 0.4; // length of the perpendicular stub off the edge
const TIER_OFF = 1.6; // lattice units the label tier sits beyond the band edge
const LAB_MIN = 1.75; // minimum centre-to-centre label spacing along a tier
const LAB_PAD = 0.6; // keep labels this far inside the grid's left/right span

function routeFor(slot, k) {
  const even = k % 2 === 0;
  if (slot === "a") return { corner: even ? "tr" : "tl", side: "top" };
  if (slot === "c") return { corner: even ? "bl" : "br", side: "bottom" };
  if (slot === "d") return { corner: even ? "tl" : "bl", side: even ? "top" : "bottom" };
  return { corner: even ? "br" : "tr", side: even ? "bottom" : "top" }; // b
}

// Order-preserving spread: sort by anchor x, push apart to LAB_MIN, then nudge back inside
// [xMin,xMax]. Mutates each item's labX. Preserved x-order → straight leaders never cross.
function spreadTier(items, xMin, xMax) {
  items.sort((a, b) => a.p1[0] - b.p1[0]);
  const xs = items.map((it) => it.p1[0]);
  for (let i = 1; i < xs.length; i++) xs[i] = Math.max(xs[i], xs[i - 1] + LAB_MIN);
  const over = xs[xs.length - 1] - xMax;
  if (over > 0) for (let i = 0; i < xs.length; i++) xs[i] -= over;
  if (xs[0] < xMin) {
    const d = xMin - xs[0];
    for (let i = 0; i < xs.length; i++) xs[i] += d;
  }
  items.forEach((it, i) => { it.labX = xs[i]; });
}

export function SectorDiamonds01({ content, config = {} }) {
  const { headingId, eyebrow, title, lead, cards } = content;
  const { cells, cols, rows } = buildGrid(cards);
  const sx = 100 / cols;
  const sy = 100 / rows;

  // Leader-line annotations (desktop): perpendicular stub off an edge centre, then a
  // straight run to a label spread along the top/bottom tier so no two leaders cross.
  const items = cells
    .filter((c) => c.t === "photo")
    .map((c) => {
      const { corner, side } = routeFor(c.slot, c.ci);
      const e = EDGE[corner];
      const p0 = [c.col + e.dx, c.row + e.dy];
      const p1 = [p0[0] + e.n[0] * STUB, p0[1] + e.n[1] * STUB];
      return { p0, p1, side, name: c.name };
    });
  const tierY = { top: -TIER_OFF, bottom: rows + TIER_OFF };
  spreadTier(items.filter((it) => it.side === "top"), LAB_PAD, cols - LAB_PAD);
  spreadTier(items.filter((it) => it.side === "bottom"), LAB_PAD, cols - LAB_PAD);
  const annotations = items.map((it) => {
    const labY = tierY[it.side];
    const pts = [it.p0, it.p1, [it.labX, labY]]
      .map(([x, y]) => `${x.toFixed(3)},${y.toFixed(3)}`)
      .join(" ");
    return {
      pts,
      dotX: (it.p0[0] / cols) * 100,
      dotY: (it.p0[1] / rows) * 100,
      labX: (it.labX / cols) * 100,
      labY: (labY / rows) * 100,
      side: it.side,
      name: it.name,
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

          {/* Leader-line annotation layer (desktop) — overlays the grid box exactly; the
              elbow leaders + labels overflow up/down into the field's reserved padding.
              aria-hidden: the photos already carry each name as alt text. The SVG shares the
              grid's lattice coordinates (viewBox = cols × rows) so 45° stays 45°. */}
          <div className="mw-secd__annot" aria-hidden="true">
            <svg className="mw-secd__leaders" viewBox={`0 0 ${cols} ${rows}`} preserveAspectRatio="xMidYMid meet">
              {annotations.map((a, i) => (
                <polyline
                  key={`ld-${i}`}
                  className="mw-secd__leader"
                  points={a.pts}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>
            {annotations.map((a, i) => (
              <span
                key={`dot-${i}`}
                className="mw-secd__leader-dot"
                style={{ left: `${a.dotX.toFixed(3)}%`, top: `${a.dotY.toFixed(3)}%` }}
              />
            ))}
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
