"use client";
// Sticky top nav. Renders the desktop bar + a mobile drawer (outside the
// header so its position:fixed isn't trapped by the bar's backdrop-filter
// containing block). Body scroll is locked when the drawer is open.
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logomark } from "./Logomark";
import { NAV_ITEMS, pageIdFromPath } from "@/lib/nav";

export function TopNav() {
  const pathname = usePathname();
  const page = pageIdFromPath(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  // React 19's "reset state on prop change" pattern: track the previous
  // pathname; if it changed, force the menu closed. Runs during render so
  // we don't need an effect (effect-based syncing trips the
  // react-hooks/set-state-in-effect rule).
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMenuOpen(false);
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

  // Close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <header className="tl-topbar" data-menu-open={menuOpen ? "1" : "0"}>
        <div className="tl-topbar__inner">
          <Link href="/" className="tl-logo" aria-label="TransLine49° home">
            <Logomark />
            <span>
              TransLine<span className="tl-logo__deg">49°</span>
            </span>
          </Link>

          <nav className="tl-nav-desktop" aria-label="Primary">
            <ul className="tl-nav-list">
              {NAV_ITEMS.map((n) => (
                <li key={n.id}>
                  <Link href={n.path} aria-current={page === n.id ? "page" : undefined}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="tl-topbar__cta">
            <a className="tl-callphone tl-mono" href="tel:+13149342133">
              <strong>(314) 934-2133</strong>
            </a>
            <Link href="/contact" className="tl-btn tl-btn--primary tl-cta-desktop">
              Start a Project <span className="tl-btn-arr">→</span>
            </Link>
            <button
              type="button"
              className="tl-menu-btn"
              data-tl-menu-btn=""
              aria-expanded={menuOpen}
              aria-controls="tl-mobile-nav"
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

      {/* Drawer rendered outside the topbar so its fixed positioning isn't
          trapped by the topbar's backdrop-filter containing block. */}
      <div
        id="tl-mobile-nav"
        className="tl-mobile-nav"
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
            </li>
          ))}
        </ul>
        <div className="tl-mobile-nav__foot">
          <Link href="/contact" className="tl-btn tl-btn--primary tl-btn--lg">
            Start a Project <span className="tl-btn-arr">→</span>
          </Link>
          <a className="tl-btn tl-btn--ghost-light tl-btn--lg" href="tel:+13149342133">
            Call (314) 934-2133
          </a>
        </div>
      </div>
    </>
  );
}
