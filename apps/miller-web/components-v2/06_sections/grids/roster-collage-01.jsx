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

    let rowPitch = 1, maxStep = 0, dist = 1, v0 = 0, lastStep = -1, raf = 0, enabled = false, baseOffset = 0;

    const apply = (step) => {
      if (step === lastStep) return;
      lastStep = step;
      // baseOffset bottom-anchors the 2 rows (whitespace above); each step lifts one row.
      grid.style.transform = `translate3d(0, ${(baseOffset - step * rowPitch).toFixed(1)}px, 0)`;
    };
    const update = () => {
      raf = 0;
      if (!enabled) return;
      const top = wrap.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, (v0 - top) / dist));
      const step = Math.min(maxStep, Math.floor(p * (maxStep + 1)));
      apply(step);
      if (section) section.classList.toggle("is-pinned", top <= v0 && top > v0 - dist);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const measure = () => {
      const cards = [...grid.querySelectorAll(".mw-roster__card")];
      // Below the single-column breakpoint the snap-pin is off (CSS flows normally).
      if (window.innerWidth <= 1024 || cards.length < 4) {
        enabled = false;
        pinEl.style.height = "";
        frame.style.height = "";
        grid.style.transform = "";
        lastStep = -1;
        setPinHeight(null);
        if (section) section.classList.remove("is-pinned");
        return;
      }
      enabled = true;
      const cardH = cards[0].offsetHeight;
      rowPitch = cards[3].offsetTop - cards[0].offsetTop; // same column, next row
      const totalRows = Math.ceil(cards.length / 3);
      maxStep = Math.max(0, totalRows - 2); // 2 rows visible at a time
      const maxTy = Math.max(0, ...cards.map(tyOf)); // staggered overhang of the lowest column
      // Frame holds exactly 2 rows incl. the stagger overhang; the grid snaps by a
      // full rowPitch so the previous row clips cleanly at the frame's top edge.
      // The 2-row frame is bottom-anchored inside the full-screen container, so the
      // leftover height becomes whitespace ABOVE the cards — the runway they scroll
      // up into (and overflow past, clipped by the nav).
      const frameH = Math.round(maxTy + rowPitch + cardH);
      frame.style.height = `${frameH}px`;
      const chrome = parseFloat(getComputedStyle(pinEl).top) || 0;
      const fullH = Math.round(window.innerHeight - chrome); // container fills the screen below the nav
      pinEl.style.height = `${fullH}px`;
      const padTop = parseFloat(getComputedStyle(layout).paddingTop) || 0;
      baseOffset = fullH - frameH - padTop; // drop the cards to the bottom → whitespace runway above
      const headerOffset = docTop(pinEl) - docTop(wrap);
      const stepScroll = Math.max(320, Math.round(window.innerHeight * 0.45)); // scroll per snap
      dist = Math.max(1, (maxStep + 1) * stepScroll);
      v0 = chrome - headerOffset;
      setPinHeight(`${Math.round(headerOffset + fullH + dist)}px`);
      lastStep = -1; // re-apply after a re-measure
      update();
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(grid);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      grid.style.transform = "";
      frame.style.height = "";
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
