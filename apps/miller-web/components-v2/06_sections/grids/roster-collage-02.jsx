"use client";
// L3 · roster-collage-02 — services as a "team roster" showcase: a navigable menu
// column beside a staggered collage of photo cards. Hovering / focusing either side
// spotlights the matching service (the photo zooms, the card lifts, and the body
// paragraph reveals). Every card and row links to its service page.
//
// EDITABLE COPY of roster-collage-01 (the home "services" section). Namespaced
// .mw-roster2* / --r2-* so edits here never touch the original. The scroll-pin /
// sticky scroll-jacking behavior of -01 has been REMOVED — this section now flows
// normally in the page: the full collage is visible and nothing pins or snaps.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
import { sectionProps } from "@/components-v2/section-config";

// Card scroll-reveal tuning — shared by the reveal effect AND the hover-scroll, so the
// hover knows exactly how far to scroll for a card's wipe to FINISH (p=1).
const CARD_REVEAL_WIDTH = 0.38;          // scroll-through span over which a card wipes fully open
const CARD_COL_OFFSETS = [0, 0.1, 0.05]; // per-column scroll-phase offset (col0, col1, col2)
const cardColOffset = (c) => CARD_COL_OFFSETS[c] ?? (0.1 + (c - 1) * 0.04);

function buildItems({ services = [], externalTile }) {
  const items = services.map((s) => ({
    key: s.id || s.slug,
    title: s.title,
    summary: s.summary,
    photo: s.photo,
    href: `/industrial-services/${s.slug}/`,
    external: false,
  }));
  if (externalTile) {
    items.push({
      key: "cross-border",
      title: externalTile.titleLines.join(" "),
      summary: externalTile.summary,
      photo: externalTile.photo,
      href: externalTile.href,
      external: true,
    });
  }
  return items;
}

export function RosterCollage02({ content, config = {} }) {
  const {
    headingId,
    eyebrow,
    title,
    intro,
    ctaCard,
  } = content;
  // Final "catch-all" grid tile (no photo). Replaces the old rail Learn-more button:
  // it completes the collage and invites inquiries for anything not listed. Copy is
  // overridable via content.ctaCard; defaults cover the common case.
  const cta = {
    eyebrow: ctaCard?.eyebrow ?? "And everything else",
    title: ctaCard?.title ?? "Need something else?",
    text:
      ctaCard?.text ??
      "Not on the list? We probably still do it — get in touch and we'll sort it out.",
    label: ctaCard?.label ?? "Contact us",
    href: ctaCard?.href ?? "/contact-us/",
  };
  const items = buildItems(content);
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState([]); // per-row scroll-reveal flags (React-owned)
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const railRef = useRef(null);
  const rowRefs = useRef([]);
  const cardRefs = useRef([]);

  // Hovering a list row snaps the grid so that row — a "set" of N (= column count) cards —
  // is framed in the viewport, using the SAME snap point for every card in the set. The
  // effect is GATED: it does nothing until the list is fully rendered (all rows revealed)
  // AND pinned (sticky-centered). Snapping centers the row, which frames the whole set incl.
  // the parallax extremes (top of the highest card for the first set, bottom of the lowest
  // for the last) and puts the wipe well past complete, so no card is cut off.
  const bringCardIntoView = (i) => {
    const grid = gridRef.current;
    const rail = railRef.current;
    if (!grid || !rail) return;

    // Gate — only once the list is fully rendered and pinned.
    const fullyRendered = revealed.length === items.length && revealed.every(Boolean);
    const stuckTop = parseFloat(rail.style.top);
    const pinned = !Number.isNaN(stuckTop) && Math.abs(rail.getBoundingClientRect().top - stuckTop) < 2;
    if (!fullyRendered || !pinned) return;

    const layout = grid.closest(".mw-roster2__layout");
    if (!layout) return;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const cols = Math.max(1, getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length);
    const ref = cardRefs.current[Math.floor(i / cols) * cols]; // the set's column-0 card (never parallaxed)
    if (!ref) return;
    const sy = window.scrollY;
    const railH = rail.getBoundingClientRect().height;
    const layoutRect = layout.getBoundingClientRect();
    // The scroll range over which the list stays pinned. Clamping the snap into it means the
    // list never unpins — and the clamp is what makes the FIRST set show the grid's top
    // (clamped to pinStart) and the LAST set its bottom (clamped to pinEnd); middle sets center.
    const pinStart = layoutRect.top + sy - stuckTop;
    const pinEnd = layoutRect.bottom + sy - stuckTop - railH;
    const refRect = ref.getBoundingClientRect();
    const rowCenterDoc = refRect.top + sy + refRect.height / 2;
    let target = rowCenterDoc - vh / 2;                          // center this set's grid row…
    target = Math.max(pinStart, Math.min(pinEnd, target));       // …clamped to the pinned range
    target = Math.max(0, Math.round(target));
    if (Math.abs(target - sy) < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });
  };

  // Center-sticky offset for the list. The rail uses native position:sticky; we set its
  // `top` to (viewportHeight − railHeight)/2 so it engages exactly when the list reaches
  // the vertical middle of the screen, then holds there while the collage scrolls. No
  // scroll handler — only recomputed on resize / when the rail's own height changes.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const setTop = () => {
      if (window.innerWidth <= 1024) { rail.style.top = ""; return; } // stacked: CSS makes it static
      const t = Math.max(0, Math.round((window.innerHeight - rail.offsetHeight) / 2));
      rail.style.top = `${t}px`;
    };
    setTop();
    window.addEventListener("resize", setTop);
    const ro = new ResizeObserver(setTop);
    ro.observe(rail);
    return () => {
      window.removeEventListener("resize", setTop);
      ro.disconnect();
      rail.style.top = "";
    };
  }, []);

  // Middle-column parallax: as the section passes through the viewport, drift the
  // middle column (cards :nth-child(3n+2), which read --r2-mid) relative to the
  // outer columns. One rAF-throttled scroll listener writes a single CSS var — no
  // per-frame layout/paint. Reduced-motion off, and gated to the 3-column breakpoint.
  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const AMP = 150; // total px the middle column travels across the full scroll pass
    let raf = 0;
    let enabled = window.innerWidth > 560;

    const update = () => {
      raf = 0;
      if (!enabled) { grid.style.removeProperty("--r2-mid"); return; }
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // 0 when the section's top first reaches the viewport bottom, 1 when its
      // bottom leaves the viewport top — a full, symmetric pass.
      const progress = (vh - rect.top) / (vh + rect.height);
      const clamped = Math.min(1, Math.max(0, progress));
      const shift = (0.5 - clamped) * AMP; // centered: +AMP/2 entering → −AMP/2 leaving
      grid.style.setProperty("--r2-mid", `${shift.toFixed(1)}px`);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onResize = () => { enabled = window.innerWidth > 560; onScroll(); };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      grid.style.removeProperty("--r2-mid");
    };
  }, []);

  // Scroll-reveal the list rows, in order. Detached from the cards: a row reveals only
  // once there's room to show it ENTIRELY on screen (its whole box fits in the viewport).
  // Because rows stack top→bottom, they naturally light up in order as the list scrolls
  // in, and hide again as they leave — reversible, no card/parallax coupling. rAF-throttled.
  // Reveal flags live in React STATE (not classList) so a hover-driven re-render — which
  // rewrites each row's className from JSX — can't wipe the reveal class. setRevealed is
  // change-gated, so it only re-renders when a row actually crosses the threshold.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const next = rowRefs.current.map((el) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top >= 0 && r.bottom <= vh; // enough room for the whole row
      });
      setRevealed((prev) =>
        prev.length === next.length && prev.every((v, i) => v === next[i]) ? prev : next
      );
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Cards "hard"-reveal (clip-path wipe), 100% SCROLL-LINKED — the wipe amount is a pure
  // function of scroll position (no CSS transition / time easing), so scrolling scrubs it
  // open/closed. Each row's progress is read from its COLUMN-0 card (never parallaxed, so
  // the middle column can't desync); a per-column phase offset makes the three wipe
  // left→right. The offset is compressed so column 3 starts just behind the middle (0.14)
  // rather than far behind (was 0.20). Driven imperatively via inline clip-path (React
  // doesn't own the cards' style → no re-renders, no hover wipe-out). reduced-motion: open.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = [...grid.querySelectorAll(".mw-roster2__card")];
    if (!cards.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cards.forEach((c) => { c.style.clipPath = "none"; });
      return;
    }

    let cols = 3;
    const readCols = () => {
      cols = Math.max(1, getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length);
    };
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      for (let i = 0; i < cards.length; i++) {
        const col = i % cols;
        const ref = cards[Math.floor(i / cols) * cols] || cards[i]; // row's column-0 card
        const refTop = ref.getBoundingClientRect().top;
        const s = (vh - refTop) / vh;                  // 0 at viewport bottom → 1 at top (pure scroll fn)
        let p = (s - cardColOffset(col)) / CARD_REVEAL_WIDTH; // column-staggered window
        p = p < 0 ? 0 : p > 1 ? 1 : p;                 // clamp 0..1
        cards[i].style.clipPath = `inset(0 0 ${((1 - p) * 100).toFixed(2)}% 0)`;
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onResize = () => { readCols(); onScroll(); };

    readCols();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const menuItems = items.map((it, i) => {
    const Tag = it.external ? "a" : Link;
    const linkProps = it.external
      ? { href: it.href, target: "_blank", rel: "noopener noreferrer" }
      : { href: it.href };
    return (
      <li key={it.key}>
        <Tag
          {...linkProps}
          ref={(el) => { rowRefs.current[i] = el; }}
          className={`mw-roster2__row${i === active ? " is-active" : ""}${revealed[i] ? " is-revealed" : ""}`}
          onMouseEnter={() => { setActive(i); bringCardIntoView(i); }}
          onFocus={() => { setActive(i); bringCardIntoView(i); }}
        >
          <span className="mw-roster2__row-mark" aria-hidden="true" />
          <span className="mw-roster2__row-name">{it.title}</span>
          <span className="mw-roster2__row-arr" aria-hidden="true">→</span>
        </Tag>
      </li>
    );
  });

  const cards = items.map((it, i) => {
    const Tag = it.external ? "a" : Link;
    const linkProps = it.external
      ? { href: it.href, target: "_blank", rel: "noopener noreferrer" }
      : { href: it.href };
    return (
      <Tag
        key={it.key}
        {...linkProps}
        ref={(el) => { cardRefs.current[i] = el; }}
        className={`mw-roster2__card${i === active ? " is-active" : ""}`}
        onMouseEnter={() => setActive(i)}
        onFocus={() => setActive(i)}
        aria-label={it.title}
      >
        <span className="mw-roster2__card-photo" style={{ backgroundImage: `url(${it.photo})` }} aria-hidden="true" />
        <span className="mw-roster2__card-arr" aria-hidden="true">→</span>
        <span className="mw-roster2__card-overlay">
          <span className="mw-roster2__card-title">{it.title}</span>
          {/* Body paragraph: hidden at rest, revealed (expand + fade) when spotlit. */}
          <span className="mw-roster2__card-reveal">
            <span className="mw-roster2__card-text">{it.summary}</span>
          </span>
        </span>
      </Tag>
    );
  });

  return (
    <section ref={sectionRef} className="mw-roster2" aria-labelledby={headingId} {...sectionProps(config)}>
      <div className="mw-inner">
        <header className="mw-roster2__head">
          <span className="mw-roster2__eyebrow"><Eyebrow01 label={eyebrow} /></span>
          <h2 id={headingId} className="mw-section-title mw-roster2__title">
            <span className="mw-roster2__title-line">{title.lead}</span>
            <span className="mw-roster2__title-line mw-roster2__title-em">
              <StopText01>{title.em}</StopText01>
            </span>
          </h2>
          {intro ? <p className="mw-roster2__lead">{intro}</p> : null}
        </header>

        <div className="mw-roster2__layout">
          {/* LEFT — roster menu (center-sticky; see the rail effect above). */}
          <div ref={railRef} className="mw-roster2__rail">
            <ul className="mw-roster2__menu" aria-label="Services">{menuItems}</ul>
          </div>

          {/* RIGHT — photo-card collage (full grid, flows normally), closed out by the
              photo-less catch-all / contact tile as the final cell. */}
          <div className="mw-roster2__collage">
            <div ref={gridRef} className="mw-roster2__grid">
              {cards}
              <article className="mw-roster2__card mw-roster2__card--cta">
                <div className="mw-roster2__cta-head">
                  <span className="mw-roster2__cta-eyebrow"><Eyebrow01 label={cta.eyebrow} /></span>
                  <p className="mw-roster2__cta-title">{cta.title}</p>
                  <p className="mw-roster2__cta-text">{cta.text}</p>
                </div>
                <div className="mw-roster2__cta-foot">
                  <SolidCta01 href={cta.href}>
                    {cta.label} <ActionArrow01 />
                  </SolidCta01>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
