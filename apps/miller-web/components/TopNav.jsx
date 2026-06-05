"use client";
// Miller top nav. Desktop renders the primary bar with a mega-menu for
// Services (10 children laid out as a 2-column flyout) and simpler
// dropdowns for About / Locations / Careers (≤5 children each). Mobile
// drawer mirrors the TL49 pattern (focus trap behaviour, body-scroll
// lock, Escape close).
//
// Right slot: phone link + "Contact Miller" CTA. The "(204) 925-9600"
// general number is taken from the design spec (§2.5). The 24/7 emergency
// number lives in `EmergencyBanner`, not here.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, pageIdFromPath } from "../lib/nav";
import { GENERAL_PHONE } from "../lib/content/brand";

const GENERAL_PHONE_DISPLAY = GENERAL_PHONE;
const GENERAL_PHONE_HREF    = `tel:+1${GENERAL_PHONE.replace(/\D/g, "")}`;

export function TopNav() {
  const pathname = usePathname();
  const page = pageIdFromPath(pathname);
  // Trailing-slash-insensitive match for highlighting the active submenu child.
  const normPath = (p) => (p || "").replace(/\/+$/, "") || "/";
  const isActivePath = (p) => normPath(pathname) === normPath(p);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [openSubmenu, setOpenSub] = useState(null); // id of currently-open desktop submenu
  const [scrollState, setScrollState] = useState("top"); // "top" | "past-hero"
  const [logoSwapped, setLogoSwapped] = useState(false); // maple leaf → logomark once past the hero mark

  // Once the user scrolls past the hero section, hide the emergency
  // banner and collapse the topnav to a compact fixed bar at the very
  // top of the viewport. Threshold: bottom of the first <section> under
  // <main>, with a 60vh fallback if no hero is found.
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      const hero = document.querySelector("main > section:first-of-type, .mw-hero, .tl-hero");
      const threshold = hero
        ? hero.getBoundingClientRect().bottom + window.scrollY - 80
        : window.innerHeight * 0.6;
      setScrollState(window.scrollY > threshold ? "past-hero" : "top");

      // Logo swap: the hero mark (logomark + since 1996) sits at the
      // lower-right of the home hero. While it is still below the fixed
      // bar the nav shows the maple leaf; once it has scrolled up behind the
      // bar, swap to the Miller logomark — reading as the hero logo rising
      // into the nav and replacing the leaf. Routes with no hero mark (every
      // non-home page) start already swapped to the logomark.
      const mark = document.querySelector(".mw-hero__mark");
      const bar = document.querySelector(".tl-topbar");
      setLogoSwapped(
        !mark || !bar
          ? true
          : mark.getBoundingClientRect().bottom <= bar.getBoundingClientRect().bottom,
      );
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        compute();
        raf = 0;
      });
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  // Expose EB height as a CSS var so the topnav can sit flush below it
  // and the body spacer matches exactly. Measured on mount + on resize.
  useEffect(() => {
    const sync = () => {
      const eb = document.querySelector(".miller-eb");
      const h = eb ? eb.getBoundingClientRect().height : 0;
      document.documentElement.style.setProperty("--mw-eb-h", `${Math.round(h)}px`);
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  // Close the mobile drawer + any open desktop submenu whenever the route
  // changes. React 19's "reset on prop change" pattern — runs during
  // render so we don't need an effect (which would trip
  // react-hooks/set-state-in-effect).
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMenuOpen(false);
    setOpenSub(null);
  }

  // Lock body scroll while drawer is open.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  // Escape closes the drawer + any desktop submenu.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      setOpenSub(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Click outside any open submenu closes it.
  const barRef = useRef(null);
  useEffect(() => {
    if (openSubmenu === null) return;
    const onDown = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) {
        setOpenSub(null);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openSubmenu]);

  return (
    <>
      <header
        className="tl-topbar mw-topbar"
        data-menu-open={menuOpen ? "1" : "0"}
        data-scroll-state={scrollState}
      >
        <div className="tl-topbar__inner" ref={barRef}>
          <Link href="/" className="tl-logo" aria-label="Miller Environmental home">
            <span className="mw-navlogo" data-swapped={logoSwapped ? "1" : "0"} aria-hidden="true">
              <span className="mw-navlogo__diamond" />
              <img className="mw-navlogo__leaf" src="/miller/custom/maple-leaf-graphic.png" alt="" />
              <img className="mw-navlogo__mark" src="/miller/logo/miller-logomark-1.webp" alt="" />
            </span>
            <span>Miller Environmental</span>
          </Link>

          <nav className="tl-nav-desktop" aria-label="Primary">
            <ul className="tl-nav-list">
              {NAV_ITEMS.map((n) => {
                const hasChildren = Array.isArray(n.children) && n.children.length > 0;
                const isOpen = openSubmenu === n.id;
                if (!hasChildren) {
                  return (
                    <li key={n.id}>
                      <Link href={n.path} aria-current={page === n.id ? "page" : undefined}>
                        {n.label}
                      </Link>
                    </li>
                  );
                }
                return (
                  <li
                    key={n.id}
                    className="mw-nav-item--has-children"
                    onMouseEnter={() => setOpenSub(n.id)}
                    onMouseLeave={() => setOpenSub((prev) => (prev === n.id ? null : prev))}
                  >
                    <button
                      type="button"
                      className="mw-nav-trigger"
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      aria-current={page === n.id ? "page" : undefined}
                      // Click toggles based on the rendered `aria-expanded`
                      // state at the moment of click, NOT on stale prev
                      // state. Previously this read `prev === n.id` and
                      // toggled it off — but in mouse interactions the
                      // mouseEnter handler had already set prev to n.id,
                      // so the click immediately closed the menu the user
                      // was trying to keep open. Reading from `isOpen`
                      // (a render-time snapshot of the visible state)
                      // keeps mouse-hover-then-click idempotent on open
                      // and only closes on a deliberate second click.
                      onClick={() => setOpenSub(isOpen ? null : n.id)}
                    >
                      {n.label}
                      <span aria-hidden="true" className="mw-nav-caret">▾</span>
                    </button>
                    {isOpen && (
                      <div
                        className="mw-submenu"
                        data-variant={n.id === "services" ? "mega" : "drop"}
                        role="menu"
                      >
                        <ul>
                          {n.children.map((c) => (
                            <li key={c.path} role="none">
                              <Link
                                href={c.path}
                                role="menuitem"
                                aria-current={isActivePath(c.path) ? "page" : undefined}
                              >
                                <span className="mw-submenu__lbl">{c.label}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="tl-topbar__cta">
            <a className="tl-callphone tl-mono" href={GENERAL_PHONE_HREF}>
              <strong>{GENERAL_PHONE_DISPLAY}</strong>
            </a>
            <Link href="/contact-us" className="tl-btn tl-btn--primary tl-cta-desktop">
              <span className="tl-cta-desktop__full">Contact us <span className="tl-btn-arr">→</span></span>
              <span className="tl-cta-desktop__compact">Connect</span>
            </Link>
            <button
              type="button"
              className="tl-menu-btn"
              data-tl-menu-btn=""
              aria-expanded={menuOpen}
              aria-controls="mw-mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="tl-menu-btn__bars" aria-hidden="true">
                <span /><span /><span />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer — outside the header so its position:fixed isn't
          trapped by any backdrop-filter containing block. Rendered as a
          <nav> landmark so the inner menu items are inside an a11y region
          (avoids the axe `region` violation). */}
      <nav
        id="mw-mobile-nav"
        className="tl-mobile-nav mw-mobile-nav"
        data-tl-mobile-nav=""
        data-open={menuOpen ? "1" : "0"}
        aria-label="Mobile"
        // `inert` removes the closed drawer from a11y tree + tab order
        // (replaces aria-hidden + manual tabIndex juggling). Avoids the
        // axe `aria-hidden-focus` violation: an aria-hidden container
        // with focusable descendants. inert is widely supported
        // (Chromium 102+, Safari 15.5+, FF 112+). React 19: pass a
        // real boolean — empty-string triggers "not a valid boolean
        // attribute value" warnings. Spread-conditional keeps the
        // attribute absent entirely when the drawer is open.
        {...(menuOpen ? {} : { inert: true })}
      >
        <ul className="tl-mobile-nav__list">
          {NAV_ITEMS.map((n, i) => (
            <li key={n.id}>
              <Link href={n.path} aria-current={page === n.id ? "page" : undefined}>
                <span className="tl-mono tl-mobile-nav__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="tl-mobile-nav__lbl">{n.label}</span>
                <span className="tl-mobile-nav__arr" aria-hidden="true">→</span>
              </Link>
              {Array.isArray(n.children) && n.children.length > 0 && (
                <ul className="mw-mobile-sub">
                  {n.children.map((c) => (
                    <li key={c.path}>
                      <Link href={c.path}>{c.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className="tl-mobile-nav__foot">
          <Link href="/contact-us" className="tl-btn tl-btn--primary tl-btn--lg">
            Contact Miller <span className="tl-btn-arr">→</span>
          </Link>
          <a className="tl-btn tl-btn--ghost-light tl-btn--lg" href={GENERAL_PHONE_HREF}>
            Call {GENERAL_PHONE_DISPLAY}
          </a>
        </div>
      </nav>
    </>
  );
}
