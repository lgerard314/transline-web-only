"use client";
// L3 · roster-collage-01 — services as a "team roster" showcase: a navigable menu
// column beside a staggered collage of photo cards. Hovering / focusing either side
// spotlights the matching service (card-7 motion: the photo zooms, the card lifts,
// and the body paragraph reveals). Every card and row links to its service page.
//
// config.pin (home): the HEADER scrolls away normally; the container holding the
// list+grid pins to the top of the viewport while the collage + menu scroll through
// within it, then unpins into the next section. One scroll-linked transform (no
// per-frame layout/paint), reduced-motion-safe.
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

export function RosterCollage01({ content, config = {} }) {
  const {
    headingId,
    eyebrow,
    title,
    intro,
    learnMore = { label: "Learn more", href: "/industrial-services/" },
  } = content;
  const { pin = false } = config;
  const items = buildItems(content);
  const [active, setActive] = useState(0);
  const [pinHeight, setPinHeight] = useState(null);
  const wrapRef = useRef(null);
  const layoutRef = useRef(null);

  // Scroll-pin with ROW SNAP: the header scrolls away normally; the .mw-roster__pin
  // container (sized to exactly 2 card rows) is sticky. As the page scrolls we snap
  // the COLLAGE up one card-row at a time (the list stays static beside it), so rows
  // always land flush at the top and never get clipped mid-card.
  useEffect(() => {
    if (!pin) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pinEl = wrap.querySelector(".mw-roster__pin");
    const scroller = wrap.querySelector(".mw-roster__scroller");
    const layout = wrap.querySelector(".mw-roster__layout");
    const frame = wrap.querySelector(".mw-roster__collage"); // clip frame (2 rows tall)
    const grid = wrap.querySelector(".mw-roster__grid");      // the grid we snap-translate
    const rail = wrap.querySelector(".mw-roster__rail");
    const section = wrap.querySelector(".mw-roster");
    if (!pinEl || !scroller || !layout || !frame || !grid) return;

    const docTop = (el) => { let y = 0, n = el; while (n) { y += n.offsetTop; n = n.offsetParent; } return y; };
    const tyOf = (el) => new DOMMatrix(getComputedStyle(el).transform).m42; // card's --ty translate

    let T0 = 0, range = 0, rowPitch = 1, maxStep = 1, dist = 1, v0 = 0, lastT = null, lastTk = "", lastBk = "", enabled = false;
    let curTy = 0, tgtTy = 0, lerpK = 0.3, following = false, frameRaf = 0, snapTimer = 0;

    const apply = (ty) => {
      if (ty === lastT) return;
      lastT = ty;
      grid.style.transform = `translate3d(0, ${ty.toFixed(1)}px, 0)`;
    };
    const setGates = (tk, bk) => {
      if (tk !== lastTk) { frame.style.setProperty("--mw-tk", tk); lastTk = tk; }
      if (bk !== lastBk) { frame.style.setProperty("--mw-bk", bk); lastBk = bk; }
    };
    const readP = () => {
      const top = wrap.getBoundingClientRect().top;
      return { top, p: Math.min(1, Math.max(0, (v0 - top) / dist)) };
    };

    // One rAF loop eases the grid toward a target. While FOLLOWING (active scroll) the
    // target tracks the live scroll position continuously → smooth, no dead zones. Once
    // the scroll settles the target becomes the nearest whole-row position → it glides
    // onto a chunk. So the motion FEELS smooth but VISUALLY lands on rows.
    const tick = () => {
      frameRaf = 0;
      if (!enabled) return;
      if (following) {
        const { top, p } = readP();
        tgtTy = T0 - p * range;
        // Fades by live position: top engages once we leave the very start, bottom
        // disengages only at the very end.
        setGates(p > 0 ? "1" : "0", p < 1 ? "1" : "0");
        if (section) section.classList.toggle("is-pinned", top <= v0 && top > v0 - dist);
      }
      const diff = tgtTy - curTy;
      if (!following && Math.abs(diff) < 0.25) { // landed on a row and idle → stop the loop
        curTy = tgtTy;
        apply(curTy);
        return;
      }
      curTy += diff * lerpK;
      apply(curTy);
      frameRaf = requestAnimationFrame(tick);
    };
    const ensureTick = () => { if (!frameRaf) frameRaf = requestAnimationFrame(tick); };

    const endScroll = () => { // scrolling stopped → magnetically settle to the nearest row
      snapTimer = 0;
      if (!enabled) return;
      following = false;
      const { p } = readP();
      const step = Math.min(maxStep, Math.round(p * maxStep));
      tgtTy = T0 - Math.min(range, step * rowPitch);
      lerpK = 0.14;                                  // gentle ease onto the chunk
      // Fades settle to the snapped step (bottom fade off exactly when the last row lands).
      setGates(step > 0 ? "1" : "0", step < maxStep ? "1" : "0");
      ensureTick();
    };
    const onScroll = () => {
      if (!enabled) return;
      following = true;
      lerpK = 0.32;                                  // tight, responsive follow
      if (snapTimer) clearTimeout(snapTimer);
      snapTimer = window.setTimeout(endScroll, 120); // snap shortly after scrolling stops
      ensureTick();
    };

    const clearFade = () => {
      ["--mw-top-mid", "--mw-top-out", "--mw-bot-mid", "--mw-bot-out", "--mw-tk", "--mw-bk"]
        .forEach((p) => frame.style.removeProperty(p));
      lastTk = lastBk = "";
    };

    const disable = () => { // small screen / reduced motion: clear everything, flow normally
      enabled = false;
      following = false;
      if (frameRaf) { cancelAnimationFrame(frameRaf); frameRaf = 0; }
      if (snapTimer) { clearTimeout(snapTimer); snapTimer = 0; }
      pinEl.style.height = "";
      frame.style.height = "";
      clearFade();
      grid.style.transform = "";
      lastT = null;
      setPinHeight(null);
      if (section) section.classList.remove("is-pinned");
    };

    const measure = () => {
      const cards = [...grid.querySelectorAll(".mw-roster__card")];
      // Below the single-column breakpoint the filmstrip is off (CSS flows normally).
      if (window.innerWidth <= 1024 || cards.length < 4) { disable(); return; }

      // Per-card VISUAL geometry. --ty is the column-stagger transform (read from the
      // matrix): the MIDDLE column has the smallest --ty so it pokes HIGHEST, the outer
      // columns sit lowest. gridTop/gridBot are the true top/bottom pixels of the cards.
      const cardH = cards[0].offsetHeight;
      const tyVals = cards.map(tyOf);
      const tops = cards.map((c, i) => c.offsetTop + tyVals[i]);
      const gridTop = Math.min(...tops);                        // highest card pixel (middle col)
      const gridBot = Math.max(...tops.map((t) => t + cardH));  // lowest card pixel (outer col)
      const gridVisualH = gridBot - gridTop;
      rowPitch = cards[3].offsetTop - cards[0].offsetTop;       // same column, next row = one chunk
      const spread = Math.max(...tyVals) - Math.min(...tyVals); // column-stagger overhang

      const chrome = parseFloat(getComputedStyle(pinEl).top) || 0;
      const H = Math.round(window.innerHeight - chrome);        // pinned band = viewport below the nav
      pinEl.style.height = `${H}px`;

      // Clip window = the LIST column's height (first menu row → CTA button). CSS centers
      // the frame in the band, so the cards column is the same height as the list column
      // and vertically aligned with it. Fall back to the full band if the list is absent.
      const menu = rail && rail.querySelector(".mw-roster__menu");
      const footEl = rail && rail.querySelector(".mw-roster__foot");
      const clipH = menu
        ? Math.round((footEl || menu).getBoundingClientRect().bottom - menu.getBoundingClientRect().top)
        : H;
      frame.style.height = `${clipH}px`;

      // Equal pad above the FIRST row (at the very start) and below the LAST row (at the
      // very end). Kept small (≤40px) and capped so two whole staggered rows always fit.
      const twoRows = rowPitch + cardH + spread;
      const pad = Math.max(0, Math.min(40, Math.floor((clipH - twoRows) / 2)));
      // Edge-fade bands — UNIFORM across all three columns (no per-column variation), using
      // the SHORTER band on each edge: top = `pad`, bottom = the outer-column value (where
      // the lowest-staggered partial card reaches). All three mask layers get the same pair.
      const fullRows = Math.max(1, Math.floor((clipH - pad - spread - cardH) / rowPitch) + 1);
      const botMid = Math.max(pad, Math.min(rowPitch, clipH - pad - fullRows * rowPitch));
      const botShort = Math.max(0, botMid - spread);
      frame.style.setProperty("--mw-top-mid", `${pad}px`);
      frame.style.setProperty("--mw-top-out", `${pad}px`);
      frame.style.setProperty("--mw-bot-mid", `${botShort}px`);
      frame.style.setProperty("--mw-bot-out", `${botShort}px`);

      // Step 0 → highest card sits `pad` below the clip top; end → lowest card sits `pad`
      // above the clip bottom. The grid SNAPS between these in whole-row chunks (below).
      T0 = pad - gridTop;
      range = gridVisualH - (clipH - 2 * pad);
      if (range <= 0) { // whole grid already fits in the clip — nothing to scrub
        pinEl.style.height = "";
        frame.style.height = "";
        clearFade();
        grid.style.transform = "";
        enabled = false;
        setPinHeight(null);
        if (section) section.classList.remove("is-pinned");
        return;
      }
      enabled = true;

      const headerOffset = docTop(pinEl) - docTop(wrap);
      maxStep = Math.max(1, Math.ceil(range / rowPitch));        // number of whole-row chunks
      const scrollPerChunk = Math.max(300, Math.round(window.innerHeight * 0.5));
      dist = maxStep * scrollPerChunk;                           // even page-scroll per chunk
      v0 = chrome - headerOffset;
      setPinHeight(`${Math.round(headerOffset + H + dist)}px`);
      // Settle straight to the nearest row for the CURRENT scroll position (handles mount
      // at the top and re-measures mid-scroll) — no animation, just place it.
      following = false;
      const { top, p } = readP();
      const step = Math.min(maxStep, Math.round(p * maxStep));
      curTy = tgtTy = T0 - Math.min(range, step * rowPitch);
      lastT = null;
      apply(curTy);
      setGates(step > 0 ? "1" : "0", step < maxStep ? "1" : "0");
      if (section) section.classList.toggle("is-pinned", top <= v0 && top > v0 - dist);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(grid);
    if (rail) ro.observe(rail); // list height drives the clip window — re-measure if it reflows
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      ro.disconnect();
      if (frameRaf) cancelAnimationFrame(frameRaf);
      if (snapTimer) clearTimeout(snapTimer);
      grid.style.transform = "";
      frame.style.height = "";
      clearFade();
      pinEl.style.height = "";
      if (section) section.classList.remove("is-pinned");
    };
  }, [pin]);

  const menuItems = items.map((it, i) => {
    const Tag = it.external ? "a" : Link;
    const linkProps = it.external
      ? { href: it.href, target: "_blank", rel: "noopener noreferrer" }
      : { href: it.href };
    return (
      <li key={it.key}>
        <Tag
          {...linkProps}
          className={`mw-roster__row${i === active ? " is-active" : ""}`}
          onMouseEnter={() => setActive(i)}
          onFocus={() => setActive(i)}
        >
          <span className="mw-roster__row-mark" aria-hidden="true" />
          <span className="mw-roster__row-name">{it.title}</span>
          <span className="mw-roster__row-arr" aria-hidden="true">→</span>
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
        className={`mw-roster__card${i === active ? " is-active" : ""}`}
        onMouseEnter={() => setActive(i)}
        onFocus={() => setActive(i)}
        aria-label={it.title}
      >
        <span className="mw-roster__card-photo" style={{ backgroundImage: `url(${it.photo})` }} aria-hidden="true" />
        <span className="mw-roster__card-arr" aria-hidden="true">→</span>
        <span className="mw-roster__card-overlay">
          <span className="mw-roster__card-title">{it.title}</span>
          {/* Body paragraph: hidden at rest, revealed (expand + fade) when spotlit. */}
          <span className="mw-roster__card-reveal">
            <span className="mw-roster__card-text">{it.summary}</span>
          </span>
        </span>
      </Tag>
    );
  });

  return (
    <div ref={wrapRef} className={pin ? "mw-roster-pinwrap" : undefined} style={pin && pinHeight ? { height: pinHeight } : undefined}>
      <section className={`mw-roster${pin ? " mw-roster--pin" : ""}`} aria-labelledby={headingId} {...sectionProps(config)}>
        <div className="mw-inner">
          {/* Header — normal flow, scrolls away (does NOT pin). */}
          <header className="mw-roster__head">
            <span className="mw-roster__eyebrow"><Eyebrow01 label={eyebrow} /></span>
            <h2 id={headingId} className="mw-section-title mw-roster__title">
              <span className="mw-roster__title-line">{title.lead}</span>
              <span className="mw-roster__title-line mw-roster__title-em">
                <StopText01>{title.em}</StopText01>
              </span>
            </h2>
            {intro ? <p className="mw-roster__lead">{intro}</p> : null}
          </header>

          {/* The list+grid container is what pins. */}
          <div className="mw-roster__pin">
            <div className="mw-roster__scroller">
              <div className="mw-roster__layout" ref={layoutRef}>
                {/* LEFT — roster menu (with the intro paragraph at the top). */}
                <div className="mw-roster__rail">
                  <ul className="mw-roster__menu" aria-label="Services">{menuItems}</ul>
                  {learnMore ? (
                    <div className="mw-roster__foot">
                      <SolidCta01 href={learnMore.href}>
                        {learnMore.label} <ActionArrow01 />
                      </SolidCta01>
                    </div>
                  ) : null}
                </div>

                {/* RIGHT — staggered photo-card collage. The frame clips to 2 rows;
                    the inner grid snap-scrolls one row at a time inside it. */}
                <div className="mw-roster__collage">
                  <div className="mw-roster__grid">{cards}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
