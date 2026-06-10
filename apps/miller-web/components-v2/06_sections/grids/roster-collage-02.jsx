"use client";
// L3 · roster-collage-02 — services as a "team roster" showcase: a navigable menu
// column beside a staggered collage of photo cards. Hovering / focusing either side
// spotlights the matching service (the photo zooms, the card lifts, and the body
// paragraph reveals). Every card and row links to its service page.
//
// EDITABLE COPY of roster-collage-01 (the home "services" section). Namespaced
// .mw-roster2* / --r2-* so edits here never touch the original.
//
// COLLAGE SCROLL MODEL — "windowed scroll": the collage column is taller than the
// viewport, so it scrolls INSIDE a viewport-tall window that's pinned to the screen
// with a strip of section background (exactly one card-gap) always showing at the very
// top and bottom of the screen. The window (.mw-roster2__window) is position:sticky and
// clipped; the inner grid is translated up 1:1 with page scroll while the window is
// pinned, so cards pass through the window at natural scroll speed but never reach the
// screen edges. The per-card clip-path WIPE reveal of earlier revisions is gone — cards
// are simply visible; the window does the framing. Middle-column parallax is retained.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
import { sectionProps } from "@/components-v2/section-config";

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
    menuLabel: ctaCard?.menuLabel ?? "Other services",
  };
  const items = buildItems(content);
  const ctaIndex = items.length; // the catch-all card sits after the service items
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState([]); // per-row scroll-reveal flags (React-owned)
  const [cardRevealed, setCardRevealed] = useState([]); // per-card scroll-reveal flags (React-owned)
  const [riseDone, setRiseDone] = useState([]); // per-card: rise (card-in) transition has settled
  const [headRevealed, setHeadRevealed] = useState([]); // [eyebrow, title, intro] reveal flags
  const sectionRef = useRef(null);
  const collageRef = useRef(null); // the pin "track" — JS sizes it to the grid's height
  const windowRef = useRef(null);  // the sticky, clipped viewport-tall window
  const gridRef = useRef(null);
  const railRef = useRef(null);
  const rowRefs = useRef([]);
  const cardRefs = useRef([]);
  const headRefs = useRef([]); // [eyebrow, title, intro] — each reveals individually
  const hoverAnchor = useRef(null); // pointer pos of the last hover-accepted selection
  const lastScrollAt = useRef(-Infinity); // timestamp of the most recent scroll (ms)

  // Hovering a list row scrolls the pinned collage only within this section's own scroll
  // track. The target is grouped by the responsive column count: every set of N list items
  // maps to one grid row, using the row's first-column card as the alignment anchor. Exact
  // list-to-grid alignment wins until it would leave the pinned travel or clip the active row.
  // Once the page has already moved past the pinned track, hover only spotlights the row; it
  // never scrolls the page backward and re-pins the section.
  const bringCardIntoView = (i) => {
    const collage = collageRef.current;
    const win = windowRef.current;
    const grid = gridRef.current;
    if (!collage || !win || !grid) return;
    if (window.innerWidth <= 1024) return; // stacked: no window, normal flow
    const fullyRendered = revealed.length > 0 && revealed.every(Boolean);
    if (!fullyRendered) return;

    const cols = Math.max(1, getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length);
    const groupStart = Math.floor(i / cols) * cols;
    const alignRow = rowRefs.current[groupStart];
    const ref = cardRefs.current[groupStart]; // the set's column-0 card (never parallaxed)
    if (!alignRow || !ref) return;

    const stickyTop = parseFloat(getComputedStyle(win).top) || 0; // window's pinned offset (topbar + gap)
    const gap = parseFloat(getComputedStyle(grid).rowGap) || 0;
    const winH = Math.max(0, window.innerHeight - stickyTop - gap); // full (pinned) band height
    const maxTrackTy = Math.max(0, grid.scrollHeight - winH); // furthest the grid can translate up
    const gridTop = grid.getBoundingClientRect().top;
    const refRect = ref.getBoundingClientRect();
    const cardTopInGrid = refRect.top - gridTop;
    const cardBottomInGrid = cardTopInGrid + refRect.height;
    const alignRowTop = alignRow.getBoundingClientRect().top;
    const peek = Math.min(8, Math.max(3, gap * 0.35));
    let ty = cardTopInGrid - (alignRowTop - stickyTop - peek);

    // Keep the selected grid row fully visible. This is the edge-case clamp for tall list
    // rows / short viewports: exact alignment is preferred, but not at the cost of cutting
    // off the card row the user is asking to see.
    const minVisibleTy = Math.max(0, cardBottomInGrid - winH);
    const maxVisibleTy = Math.max(0, cardTopInGrid);
    if (ty < minVisibleTy) ty = minVisibleTy;
    if (ty > maxVisibleTy) ty = maxVisibleTy;
    if (ty > maxTrackTy) ty = maxTrackTy;
    if (ty < 0) ty = 0;

    // ty = scrollY − (trackDocTop − stickyTop) ⇒ scrollY = trackDocTop − stickyTop + ty
    const trackDocTop = collage.getBoundingClientRect().top + window.scrollY;
    const pinStart = Math.max(0, trackDocTop - stickyTop);
    const pinEnd = pinStart + maxTrackTy;
    if (window.scrollY > pinEnd + 2) return;

    let target = Math.max(0, Math.round(pinStart + ty));
    target = target < pinStart ? pinStart : target > pinEnd ? pinEnd : target;
    if (Math.abs(target - window.scrollY) < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });
  };

  // Hover-select a row. The catch: wheel-scrolling with the cursor resting on the list slides a
  // new row under it (firing mouseenter) WITHOUT changing the pointer's clientX/clientY, which
  // makes the selection jump around as you scroll. So ONLY in the brief window right after a
  // scroll do we require ≥40px of real pointer travel before re-selecting (tiny jitter and pure
  // scroll move ≈0px → ignored). Once the user stops scrolling for a second, the rule lifts and
  // hovering selects immediately as normal. Keyboard focus is unaffected (it calls setActive).
  const HOVER_MOVE_MIN = 40;
  const SCROLL_GUARD_MS = 1000;
  const selectFromHover = (i, e) => {
    const justScrolled = performance.now() - lastScrollAt.current < SCROLL_GUARD_MS;
    const a = hoverAnchor.current;
    if (justScrolled && a && Math.hypot(e.clientX - a.x, e.clientY - a.y) < HOVER_MOVE_MIN) return;
    hoverAnchor.current = { x: e.clientX, y: e.clientY };
    setActive(i);
    bringCardIntoView(i);
  };

  // Stamp the time of USER scrolling so selectFromHover knows whether we're inside the
  // post-scroll guard window. We listen for `wheel` (mouse wheel / trackpad), NOT `scroll`:
  // every hover-select runs bringCardIntoView, which smooth-scrolls and fires `scroll` events —
  // using `scroll` here would re-arm the guard on every selection, so it would never release.
  // `wheel` fires only on real user scroll input, so the guard correctly lapses ~1s after the
  // user stops scrolling.
  useEffect(() => {
    const onWheel = () => { lastScrollAt.current = performance.now(); };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  // The active border (the card's ::after ring) must stay hidden while a card is still rising
  // into view, and only appear once that motion finishes. We flag a card "rise-done" when its
  // card-in finishes its transform transition while revealed; the ring CSS requires that flag.
  const handleCardRiseEnd = (i, e) => {
    if (e.propertyName !== "transform") return;
    const el = e.target;
    if (!el.classList || !el.classList.contains("mw-roster2__card-in")) return;
    const risen = !!el.parentElement && el.parentElement.classList.contains("is-revealed");
    setRiseDone((prev) => (!!prev[i] === risen ? prev : Object.assign([...prev], { [i]: risen })));
  };
  // Drop the flag the instant a card un-reveals, so the ring hides immediately (never lingers
  // around a card that's dropping back into its mask) and never shows during a re-rise.
  useEffect(() => {
    setRiseDone((prev) => {
      let changed = false;
      const next = cardRevealed.map((rev, i) => {
        const v = rev ? !!prev[i] : false;
        if (v !== !!prev[i]) changed = true;
        return v;
      });
      return changed ? next : prev;
    });
  }, [cardRevealed]);

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
  //
  // The CARDS reveal the same way (same hero rise effect, see .mw-roster2__card-in): each card
  // rises out of its own mask when its slot enters the visible window band. We measure the CARD
  // rect (the reveal transform rides on the inner .mw-roster2__card-in, not the card, so the
  // card rect stays a stable slot) against the window's bottom edge — the band bottom when
  // pinned, the viewport bottom when stacked. A card stays revealed while at/above the band and
  // re-hides only when it drops back below it, so it never re-masks while scrolling up and out.
  useEffect(() => {
    let raf = 0;
    const sameArr = (prev, next) =>
      prev.length === next.length && prev.every((v, i) => v === next[i]) ? prev : next;
    // Reveal when `enter` becomes true; reset ONLY once the element is fully below the viewport
    // (`below`), where the reset is invisible. In between, hold the current state. Net effect:
    // the motion plays as you scroll DOWN onto something and re-arms (off-screen) below it, but
    // scrolling back UP never visibly resets it — it stays revealed until it's gone past the
    // bottom edge. So effects only reset/replay on the way down, never on the way up.
    const resolve = (prev, i, enter, below) => (enter ? true : below ? false : !!prev[i]);
    const update = () => {
      raf = 0;
      const vh = window.innerHeight || document.documentElement.clientHeight;

      setRevealed((prev) => {
        const next = rowRefs.current.map((el, i) => {
          if (!el) return false;
          const r = el.getBoundingClientRect();
          return resolve(prev, i, r.top >= 0 && r.bottom <= vh, r.top >= vh);
        });
        return sameArr(prev, next);
      });

      // Header bits (eyebrow, title, intro) each reveal individually once the WHOLE element fits.
      setHeadRevealed((prev) => {
        const next = headRefs.current.map((el, i) => {
          if (!el) return false;
          const r = el.getBoundingClientRect();
          return resolve(prev, i, r.top >= 0 && r.bottom <= vh, r.top >= vh);
        });
        return sameArr(prev, next);
      });

      const win = windowRef.current;
      const grid = gridRef.current;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const windowed = !!win && !reduce && window.innerWidth > 1024;
      const gap = grid ? parseFloat(getComputedStyle(grid).rowGap) || 0 : 0;
      const bandBottom = windowed ? vh - gap : vh; // a card reveals once its slot tops this line
      setCardRevealed((prev) => {
        const next = cardRefs.current.map((el, i) => {
          if (!el) return false;
          const top = el.getBoundingClientRect().top;
          return resolve(prev, i, top < bandBottom, top >= vh);
        });
        return sameArr(prev, next);
      });
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

  // Windowed scroll: pin the collage to a viewport-tall, clipped window (CSS: position:sticky
  // top = topbar + card-gap, height = the band below it) and translate the inner grid up 1:1
  // with page scroll while it's pinned, so cards scroll through the window at natural speed but
  // a card-gap strip of section always shows at the top and bottom of the screen. We size the
  // collage "track" to the grid's full height so the window pins for exactly the grid's overflow.
  //
  // The window's bottom is also clamped to (viewport bottom − gap) EVERY frame, not just when
  // pinned: while the section is still ENTERING (window not yet stuck, flowing up from the
  // bottom of the screen) the fixed-height sticky box would otherwise extend past the screen
  // bottom and cards would butt against the screen edge with no gap. Setting the height so the
  // bottom always lands at vh − gap keeps the bottom strip present throughout. Plain transform,
  // no time easing (scrubs with scroll). Disabled when stacked (≤1024) or reduced-motion.
  useEffect(() => {
    const collage = collageRef.current;
    const win = windowRef.current;
    const grid = gridRef.current;
    if (!collage || !win || !grid) return;

    let active = false;
    let stickyTop = 0, gap = 0, fullBand = 0, maxTy = 0, vh = 0;

    const clear = () => {
      collage.style.height = "";
      grid.style.transform = "";
      win.style.height = "";
      grid.style.removeProperty("--r2-tail-pad");
    };
    const measure = () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      active = !reduce && window.innerWidth > 1024;
      if (!active) { clear(); return; }
      vh = window.innerHeight;
      stickyTop = parseFloat(getComputedStyle(win).top) || 0;   // topbar + gap (sticky offset)
      gap = parseFloat(getComputedStyle(grid).rowGap) || 0;     // the card gap, resolved
      fullBand = Math.max(0, vh - stickyTop - gap);             // window height once pinned
      const gridStyle = getComputedStyle(grid);
      const cols = Math.max(1, gridStyle.gridTemplateColumns.split(" ").filter(Boolean).length);
      const tailPad = parseFloat(gridStyle.paddingBottom) || 0;
      const baseGridH = Math.max(0, grid.scrollHeight - tailPad);
      const baseMaxTy = Math.max(0, baseGridH - fullBand);
      const gridTop = grid.getBoundingClientRect().top;
      const peek = Math.min(8, Math.max(3, gap * 0.35));
      let maxAlignedTy = 0;

      for (let groupStart = 0; groupStart < cardRefs.current.length; groupStart += cols) {
        const ref = cardRefs.current[groupStart];
        const alignRow = rowRefs.current[groupStart];
        if (!ref || !alignRow) continue;
        const refRect = ref.getBoundingClientRect();
        const cardTopInGrid = refRect.top - gridTop;
        const cardBottomInGrid = cardTopInGrid + refRect.height;
        const alignRowTop = alignRow.getBoundingClientRect().top;
        let ty = cardTopInGrid - (alignRowTop - stickyTop - peek);
        const minVisibleTy = Math.max(0, cardBottomInGrid - fullBand);
        const maxVisibleTy = Math.max(0, cardTopInGrid);
        if (ty < minVisibleTy) ty = minVisibleTy;
        if (ty > maxVisibleTy) ty = maxVisibleTy;
        if (ty > maxAlignedTy) maxAlignedTy = ty;
      }

      const nextTailPad = Math.max(0, Math.ceil(maxAlignedTy - baseMaxTy));
      if (Math.abs(nextTailPad - tailPad) > 0.5) {
        grid.style.setProperty("--r2-tail-pad", `${nextTailPad}px`);
      }
      const gridH = baseGridH + nextTailPad;
      maxTy = Math.max(0, gridH - fullBand);                    // overflow the grid scrolls through
      collage.style.height = `${gridH}px`;                      // track = grid height → pins for the overflow
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      if (!active) return;
      // Translate the grid by how far we've scrolled past the sticky offset (0 while entering,
      // maxTy while leaving) → cards scrub through the pinned window.
      let ty = stickyTop - collage.getBoundingClientRect().top;
      ty = ty < 0 ? 0 : ty > maxTy ? maxTy : ty;
      grid.style.transform = `translateY(${(-ty).toFixed(1)}px)`;
      // Keep the window's bottom at vh − gap (the bottom strip) even before it pins; clamp to
      // the full band so the leaving phase just scrolls away normally.
      const winTop = win.getBoundingClientRect().top;
      let h = vh - gap - winTop;
      h = h < 0 ? 0 : h > fullBand ? fullBand : h;
      win.style.height = `${h.toFixed(1)}px`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onResize = () => { measure(); onScroll(); };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // Re-measure when the grid's content box changes (font swap, lazy images) so the track
    // height + overflow stay correct. Transform writes don't change layout size → no loop.
    const ro = new ResizeObserver(() => { measure(); onScroll(); });
    ro.observe(grid);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      clear();
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
          onMouseEnter={(e) => selectFromHover(i, e)}
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
        className={`mw-roster2__card${i === active ? " is-active" : ""}${cardRevealed[i] ? " is-revealed" : ""}${riseDone[i] ? " is-rise-done" : ""}`}
        onMouseEnter={() => setActive(i)}
        onFocus={() => setActive(i)}
        onTransitionEnd={(e) => handleCardRiseEnd(i, e)}
        aria-label={it.title}
      >
        {/* card-in is the riser that rises out of the card's mask (hero-style reveal). */}
        <span className="mw-roster2__card-in">
          <span className="mw-roster2__card-photo" style={{ backgroundImage: `url(${it.photo})` }} aria-hidden="true" />
          <span className="mw-roster2__card-arr" aria-hidden="true">→</span>
          <span className="mw-roster2__card-overlay">
            <span className="mw-roster2__card-title">{it.title}</span>
            {/* Body paragraph: hidden at rest, revealed (expand + fade) when spotlit. */}
            <span className="mw-roster2__card-reveal">
              <span className="mw-roster2__card-text">{it.summary}</span>
            </span>
          </span>
        </span>
      </Tag>
    );
  });

  return (
    <section ref={sectionRef} className="mw-roster2" aria-labelledby={headingId} {...sectionProps(config)}>
      <div className="mw-inner">
        {/* Eyebrow, title and intro each reveal individually (own fade-up; the title's clay
            stop-period also stamps in) the moment that element fully fits on screen. They re-arm
            only once scrolled fully past (below the viewport), so the effect replays on the way
            DOWN but never visibly resets on the way up. Driven by headRevealed state from the
            reveal effect above (NOT the house data-reveal, which is one-shot and whole-block). */}
        <header className="mw-roster2__head">
          <span
            ref={(el) => { headRefs.current[0] = el; }}
            className={`mw-roster2__eyebrow${headRevealed[0] ? " is-head-in" : ""}`}
          >
            <Eyebrow01 label={eyebrow} />
          </span>
          <h2
            id={headingId}
            ref={(el) => { headRefs.current[1] = el; }}
            className={`mw-section-title mw-roster2__title${headRevealed[1] ? " is-head-in" : ""}`}
          >
            <span className="mw-roster2__title-line">{title.lead}</span>
            <span className="mw-roster2__title-line mw-roster2__title-em">
              <StopText01>{title.em}</StopText01>
            </span>
          </h2>
          {intro ? (
            <p
              ref={(el) => { headRefs.current[2] = el; }}
              className={`mw-roster2__lead${headRevealed[2] ? " is-head-in" : ""}`}
            >
              {intro}
            </p>
          ) : null}
        </header>

        <div className="mw-roster2__layout">
          {/* LEFT — roster menu (center-sticky; see the rail effect above). */}
          <div ref={railRef} className="mw-roster2__rail">
            <ul
              className="mw-roster2__menu"
              aria-label="Services"
              onMouseLeave={() => { hoverAnchor.current = null; }}
            >
              {menuItems}
              {/* Row for the text-only catch-all card (last cell in the grid). */}
              <li>
                <Link
                  href={cta.href}
                  ref={(el) => { rowRefs.current[ctaIndex] = el; }}
                  className={`mw-roster2__row${active === ctaIndex ? " is-active" : ""}${revealed[ctaIndex] ? " is-revealed" : ""}`}
                  onMouseEnter={(e) => selectFromHover(ctaIndex, e)}
                  onFocus={() => { setActive(ctaIndex); bringCardIntoView(ctaIndex); }}
                >
                  <span className="mw-roster2__row-mark" aria-hidden="true" />
                  <span className="mw-roster2__row-name">{cta.menuLabel}</span>
                  <span className="mw-roster2__row-arr" aria-hidden="true">→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* RIGHT — photo-card collage, closed out by the photo-less catch-all / contact tile
              as the final cell. The collage is the pin "track" (JS sizes it to the grid's
              height); the window pins + clips to a viewport-tall frame and the grid scrolls
              inside it (see the windowed-scroll effect above). */}
          <div ref={collageRef} className="mw-roster2__collage">
            <div ref={windowRef} className="mw-roster2__window">
              <div ref={gridRef} className="mw-roster2__grid">
                {cards}
                <article
                  ref={(el) => { cardRefs.current[ctaIndex] = el; }}
                  className={`mw-roster2__card mw-roster2__card--cta${active === ctaIndex ? " is-active" : ""}${cardRevealed[ctaIndex] ? " is-revealed" : ""}${riseDone[ctaIndex] ? " is-rise-done" : ""}`}
                  onTransitionEnd={(e) => handleCardRiseEnd(ctaIndex, e)}
                >
                  {/* card-in rises out of the card's mask, same as the photo cards. */}
                  <span className="mw-roster2__card-in">
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
                  </span>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
