"use client";
import { useEffect, useRef } from "react";
import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
import { SectorGridMotion03 } from "@/components-v2/06_sections/grids/sector-grid-motion-03";
import { sectionProps } from "@/components-v2/section-config";

// "Who we serve 2" — CHECKMARK layout. Same diamond lattice + interaction model as SectorDiamonds03
// (hover spotlight, single-photo straighten, replaying reveal), but each category is arranged as a
// CHECKMARK (✓): the category diamond is the tip of the short left arm, it steps down-right to a
// bottom vertex, then up-right three steps (the long arm). Reuses the shared .mw-secd__* + the
// .mw-secd--int hover CSS untouched; a .mw-secd--check modifier is available for checkmark-only
// tweaks so templates #1/#2 stay byte-identical. Photo cells position via inline --lx/--ly/--w.
const PHOTO_BASE = "/miller/custom";
const STEP = 4; // columns between consecutive checkmarks: at 4 each mark's top tip (col4) lands on the next mark's category column, touching it tip-to-tip — the interlocked "every diamond touches the next" grid (6 would split them into a wider, smaller-diamond row).

// Per category: a checkmark of 5 diamonds. cat is the short-arm tip (col0,row0); it descends one
// step to the vertex (col1,row1 — the lowest point), then the four photos ride up the long arm.
// All cells keep (col+row) even so they sit on the argyle lattice.
function buildGrid(cards) {
  const content = [];
  cards.forEach((cat, k) => {
    const ox = k * STEP;
    const it = cat.items;
    content.push({ t: "cat", ci: k, col: ox + 0, row: 0, title: cat.title });
    content.push({ t: "photo", ci: k, si: 0, col: ox + 1, row: 1, slug: it[0].slug, name: it[0].name });  // vertex (bottom)
    content.push({ t: "photo", ci: k, si: 1, col: ox + 2, row: 0, slug: it[1].slug, name: it[1].name });  // up the long arm …
    content.push({ t: "photo", ci: k, si: 2, col: ox + 3, row: -1, slug: it[2].slug, name: it[2].name });
    content.push({ t: "photo", ci: k, si: 3, col: ox + 4, row: -2, slug: it[3].slug, name: it[3].name });  // top-right tip
  });
  // Normalise so the first content column is 0 (= body-content left) and the top row 0.
  const minCol = Math.min(...content.map((c) => c.col));
  const minRow = Math.min(...content.map((c) => c.row));
  content.forEach((c) => { c.col -= minCol; c.row -= minRow; });
  const cols = Math.max(...content.map((c) => c.col)) + 2;
  const rows = Math.max(...content.map((c) => c.row)) + 2;
  const span = Math.max(...content.map((c) => c.col)) || 1;
  content.forEach((c) => { c.fx = c.col / span; }); // 0 = left … 1 = right → reveal stagger
  // Each category's horizontal centre (as a fraction of grid width) so the hover spotlight can gather
  // that category's photos ABOVE its own diamond instead of in the middle of the whole grid.
  const catColById = {};
  content.forEach((c) => { if (c.t === "cat") catColById[c.ci] = c.col; });
  content.forEach((c) => { if (c.t === "photo") c.catcx = (catColById[c.ci] + 1) / cols; }); // +1 → box centre
  return { cells: content, cols, rows };
}

export function SectorDiamonds04({ content, config = {} }) {
  const { headingId, eyebrow, title, lead, cta, cards } = content;
  const { cells, cols, rows } = buildGrid(cards);
  const sx = 100 / cols;
  const sy = 100 / rows;
  const trackRef = useRef(null);
  const sectionRef = useRef(null);

  // PINNED REVEAL (desktop, tall viewport, motion-OK): the section is wrapped in a tall track and
  // made sticky, so it FREEZES once it fills the viewport. The pinned scroll progress P (0→1) drives
  // --secd-rev (0→1), which fades + rises the body paragraph in (it starts hidden). Mirrors the
  // lifetime-reel pin. Mobile / short / reduced-motion skip the pin (track collapses) and show the
  // paragraph normally — the CSS gates on the SAME query, and we clear --secd-rev so it falls back.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mqWide = window.matchMedia("(min-width: 721px)");
    const mqTall = window.matchMedia("(min-height: 820px)");
    const mqRM = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canPin = () => mqWide.matches && mqTall.matches && !mqRM.matches;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const track = trackRef.current, section = sectionRef.current;
      if (!track || !section) return;
      if (!canPin()) { section.style.removeProperty("--secd-rev"); section.classList.remove("is-secd-pinned"); return; }
      const vh = window.innerHeight || 1;
      const top = track.getBoundingClientRect().top;
      const total = Math.max(1, track.offsetHeight - vh);
      const scrolled = Math.min(Math.max(-top, 0), total);
      const P = scrolled / total;                       // 0 across approach; 0→1 across the pin
      // HOLD the title fully visible for the first ~30% of the pinned scroll, THEN crossfade to the
      // paragraph over the next ~25% (half the previous span → the swap is twice as quick), then hold.
      const rev = Math.min(1, Math.max(0, (P - 0.3) / 0.25));
      section.style.setProperty("--secd-rev", rev.toFixed(3));
      // Hide the eyebrow once the section is pinned (the track spans the viewport → section stuck at top).
      section.classList.toggle("is-secd-pinned", top <= 0 && (top + track.offsetHeight) >= vh);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    mqWide.addEventListener("change", onScroll);
    mqTall.addEventListener("change", onScroll);
    mqRM.addEventListener("change", onScroll);
    compute();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mqWide.removeEventListener("change", onScroll);
      mqTall.removeEventListener("change", onScroll);
      mqRM.removeEventListener("change", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="mw-secd-track" ref={trackRef}>
    <section ref={sectionRef} className="mw-secd mw-secd--int mw-secd--check" aria-labelledby={headingId} {...sectionProps(config)}>
      <div className="mw-inner">
        {/* Eyebrow ABOVE the diamonds, at the top of the section (title + lead stay below the grid). */}
        <div className="mw-secd__eyebrow-top">
          <Eyebrow01 label={eyebrow} reveal />
        </div>
        <div className="mw-secd__grid" style={{ aspectRatio: `${cols} / ${rows}`, "--secd-cols": cols }}>
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
            const style = { "--lx": `${c.col * sx}%`, "--ly": `${c.row * sy}%`, "--w": `${2 * sx}%`, "--fx": c.fx.toFixed(3), "--si": c.si, "--cat-cx": `${(c.catcx * 100).toFixed(2)}%` };
            return (
              <div className="mw-secd__photo" data-cat={c.ci} data-si={c.si} style={style} key={`ph-${i}`}>
                <span className="mw-secd__photo-clip">
                  <img className="mw-secd__photo-img" src={`${PHOTO_BASE}/${c.slug}.webp`} alt={c.name} loading="lazy" decoding="async" />
                </span>
                {/* caption — hidden at rest; revealed on single-photo hover (#5) and category spotlight (#4). */}
                <span className="mw-secd__cap" aria-hidden="true">{c.name.replace(/ & /g, " & ")}</span>
              </div>
            );
          })}
        </div>

        {/* Header BELOW the grid. Title + lead overlap in one cell (.mw-secd__swap); while pinned the
            paragraph REPLACES the title via a scroll-scrubbed crossfade (--secd-rev). No data-reveal here
            so --secd-rev fully owns both opacities; off the pin they just stack and show. */}
        <header className="mw-secd__head">
          <div className="mw-secd__swap">
            <h2 id={headingId} className="mw-secd__title"><StopText01>{title}</StopText01></h2>
            <div className="mw-secd__lead-group">
              <p className="mw-secd__lead">{lead}</p>
              {cta && <SolidCta01 href={cta.href}>{cta.label} <ActionArrow01 /></SolidCta01>}
            </div>
          </div>
        </header>
      </div>
      <SectorGridMotion03 />
    </section>
    </div>
  );
}
