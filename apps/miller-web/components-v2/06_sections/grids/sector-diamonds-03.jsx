import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { SectorGridMotion03 } from "@/components-v2/06_sections/grids/sector-grid-motion-03";
import { sectionProps } from "@/components-v2/section-config";

// "Who we serve 2" — ENHANCED diamond grid. Forked from SectorDiamonds01 and given the arc
// gallery's interaction model:
//   1) the decorative left-gutter ghost diamonds are gone,
//   2) the always-on leader lines + in-photo sub-sector labels are gone (a caption now appears
//      only on hover),
//   3) an arc-style staggered reveal that REPLAYS each time the section scrolls back in,
//   4) hovering a category diamond spotlights that category's four photos, and
//   5) hovering a single photo lifts it and reveals its label.
// It reuses the shared .mw-secd__* base styling; every new behaviour is scoped under the
// `.mw-secd--int` modifier so the catalog's SectorDiamonds01 stays byte-identical. Photo cells
// position via inline --lx/--ly/--w custom props (read by CSS) so the hover states can move them
// without fighting inline left/top.
const PHOTO_BASE = "/miller/custom";
const SLOT_INDEX = { a: 0, b: 1, c: 2, d: 3 }; // gather-row order within a category (0…3 → left…right)

// Same argyle lattice as SectorDiamonds01, but with NO gutter ghosts. Each category contributes
// four photo diamonds (a top · b right · c bottom · d left) plus its solid walnut category diamond
// anchored at the left of the cluster (lower-left for even columns, upper-left for odd → zig-zag).
function buildGrid(cards) {
  const content = [];
  cards.forEach((cat, k) => {
    const ox = k * 4;
    const it = cat.items;
    content.push({ t: "photo", slot: "a", ci: k, col: 2 + ox, row: 1, slug: it[0].slug, name: it[0].name });
    content.push({ t: "photo", slot: "b", ci: k, col: 3 + ox, row: 2, slug: it[1].slug, name: it[1].name });
    content.push({ t: "photo", slot: "c", ci: k, col: 2 + ox, row: 3, slug: it[2].slug, name: it[2].name });
    content.push({ t: "photo", slot: "d", ci: k, col: 1 + ox, row: 2, slug: it[3].slug, name: it[3].name });
    content.push({ t: "cat", ci: k, col: 0 + ox, row: k % 2 === 0 ? 3 : 1, title: cat.title });
  });
  // Normalise so the first content column is 0 (= body-content left) and the top row 0.
  const minCol = Math.min(...content.map((c) => c.col));
  const minRow = Math.min(...content.map((c) => c.row));
  content.forEach((c) => { c.col -= minCol; c.row -= minRow; });
  const cols = Math.max(...content.map((c) => c.col)) + 2;
  const rows = Math.max(...content.map((c) => c.row)) + 2;
  const span = Math.max(...content.map((c) => c.col)) || 1;
  content.forEach((c) => { c.fx = c.col / span; }); // 0 = left … 1 = right → reveal stagger
  return { cells: content, cols, rows };
}

export function SectorDiamonds03({ content, config = {} }) {
  const { headingId, eyebrow, title, lead, cards } = content;
  const { cells, cols, rows } = buildGrid(cards);
  const sx = 100 / cols;
  const sy = 100 / rows;

  return (
    <section className="mw-secd mw-secd--int" aria-labelledby={headingId} {...sectionProps(config)}>
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
            if (c.t === "cat") {
              const style = { left: `${c.col * sx}%`, top: `${c.row * sy}%`, width: `${2 * sx}%`, "--fx": c.fx.toFixed(3) };
              return (
                // data-cat ties the category to its 4 photos so a category hover can spotlight them (CSS :has()).
                <div className="mw-secd__cat" data-cat={c.ci} style={style} key={`cat-${i}`}>
                  <svg className="mw-secd__cat-svg" viewBox="0 0 200 200" aria-hidden="true">
                    <rect className="mw-secd__cat-fill" x="29.3" y="29.3" width="141.4" height="141.4" rx="15" transform="rotate(45 100 100)" />
                  </svg>
                  <span className="mw-secd__cat-face"><h3 className="mw-secd__cat-name">{c.title}</h3></span>
                </div>
              );
            }
            // Photo cell: position via vars so hover states can move it; --si = gather order in its category.
            const style = { "--lx": `${c.col * sx}%`, "--ly": `${c.row * sy}%`, "--w": `${2 * sx}%`, "--fx": c.fx.toFixed(3), "--si": SLOT_INDEX[c.slot] };
            return (
              <div className="mw-secd__photo" data-cat={c.ci} style={style} key={`ph-${i}`}>
                <span className="mw-secd__photo-clip">
                  <img className="mw-secd__photo-img" src={`${PHOTO_BASE}/${c.slug}.webp`} alt={c.name} loading="lazy" decoding="async" />
                </span>
                {/* caption — hidden at rest; revealed on single-photo hover (#5) and category spotlight (#4).
                    Non-breaking space after each "&" so it never wraps onto its own line. */}
                <span className="mw-secd__cap" aria-hidden="true">{c.name.replace(/ & /g, " & ")}</span>
              </div>
            );
          })}
        </div>
      </div>
      <SectorGridMotion03 />
    </section>
  );
}
