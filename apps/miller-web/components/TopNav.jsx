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
import { Logomark } from "./Logomark";
import { NAV_ITEMS, pageIdFromPath } from "../lib/nav";

const GENERAL_PHONE_DISPLAY = "(204) 925-9600";
const GENERAL_PHONE_HREF    = "tel:+12049259600";

export function TopNav() {
  const pathname = usePathname();
  const page = pageIdFromPath(pathname);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [openSubmenu, setOpenSub] = useState(null); // id of currently-open desktop submenu

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
      <header className="tl-topbar mw-topbar" data-menu-open={menuOpen ? "1" : "0"}>
        <div className="tl-topbar__inner" ref={barRef}>
          <Link href="/" className="tl-logo" aria-label="Miller Environmental home">
            <Logomark />
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
                      onClick={() => setOpenSub((prev) => (prev === n.id ? null : n.id))}
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
                              <Link href={c.path} role="menuitem">
                                {c.label}
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
              Contact Miller <span className="tl-btn-arr">→</span>
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
          trapped by any backdrop-filter containing block. */}
      <div
        id="mw-mobile-nav"
        className="tl-mobile-nav mw-mobile-nav"
        data-tl-mobile-nav=""
        data-open={menuOpen ? "1" : "0"}
        aria-hidden={!menuOpen}
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
      </div>
    </>
  );
}
