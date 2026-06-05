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

    let T0 = 0, range = 0, rowPitch = 1, maxStep = 1, dist = 1, v0 = 0, lastT = null, lastTk = "", lastBk = "", raf = 0, enabled = false;

    const apply = (ty) => {
      if (ty === lastT) return;
      lastT = ty;
      grid.style.transform = `translate3d(0, ${ty.toFixed(1)}px, 0)`;
    };
    const update = () => {
      raf = 0;
      if (!enabled) return;
      const top = wrap.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, (v0 - top) / dist));
      // Chunked snap: advance the grid by whole card-rows (one chunk = rowPitch =
      // card height + gap). The CSS transition animates each jump; the final chunk
      // clamps to the exact end so the last row lands flush at the bottom pad.
      const step = Math.min(maxStep, Math.round(p * maxStep));
      apply(T0 - Math.min(range, step * rowPitch));
      // Gate the edge fades by snap step: TOP fade off at step 0 (nothing clipped above),
      // BOTTOM fade off at the last step (last row fully revealed). Transitioned in CSS.
      const tk = step > 0 ? "1" : "0";
      const bk = step < maxStep ? "1" : "0";
      if (tk !== lastTk) { frame.style.setProperty("--mw-tk", tk); lastTk = tk; }
      if (bk !== lastBk) { frame.style.setProperty("--mw-bk", bk); lastBk = bk; }
      if (section) section.classList.toggle("is-pinned", top <= v0 && top > v0 - dist);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    const clearFade = () => {
      ["--mw-top-mid", "--mw-top-out", "--mw-bot-mid", "--mw-bot-out", "--mw-tk", "--mw-bk"]
        .forEach((p) => frame.style.removeProperty(p));
      lastTk = lastBk = "";
    };

    const disable = () => { // small screen / reduced motion: clear everything, flow normally
      enabled = false;
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
      // PER-COLUMN edge-fade bands, derived from the stagger. The middle column sits
      // `spread` higher than the outer columns, so at the TOP its full row lands at `pad`
      // (short fade) while the outer rows land at `pad + spread` (longer fade). At the
      // BOTTOM the middle column's partial row reaches higher, so it gets the longer fade
      // and the outer columns the shorter one. Bottom bands span the whole partial row so
      // it ramps fully out ("barely visible once pushed out").
      const fullRows = Math.max(1, Math.floor((clipH - pad - spread - cardH) / rowPitch) + 1);
      const botMid = Math.max(pad, Math.min(rowPitch, clipH - pad - fullRows * rowPitch));
      const botOut = Math.max(0, botMid - spread);
      frame.style.setProperty("--mw-top-mid", `${pad}px`);
      frame.style.setProperty("--mw-top-out", `${pad + spread}px`);
      frame.style.setProperty("--mw-bot-mid", `${botMid}px`);
      frame.style.setProperty("--mw-bot-out", `${botOut}px`);

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
      lastT = null;
      update();
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
      if (raf) cancelAnimationFrame(raf);
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
