"use client";
// Chain-of-custody thread — the home page's signature motif made literal.
//
// A fixed clay hairline at the left margin (sharing the x of the hero's
// vertical hairline) that "draws" downward as the page is scrolled, a
// small diamond stamp travelling at its leading edge. It turns the
// documented-line / chain-of-custody concept from copy into a visible
// through-line: the further you read, the more of the line is "on record."
//
// Scroll progress is written to a CSS custom property once per frame (rAF
// coalesced, passive listener); all visual work is CSS (scaleY + a top
// offset), so there is no per-frame layout. Decorative (aria-hidden) and
// home-only — the motif belongs to the home narrative, not interior pages.
// CSS hides it where the left gutter is too tight and swaps the travelling
// stamp for a static rule under prefers-reduced-motion.

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MillerCustodyThread() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;
    const el = document.getElementById("mw-thread");
    if (!el) return;

    let raf = 0;
    const render = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      el.style.setProperty("--mw-thread-p", p.toFixed(4));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(render); };

    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("load", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("load", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  if (pathname !== "/") return null;
  return (
    <div id="mw-thread" className="mw-thread" aria-hidden="true">
      <span className="mw-thread__fill" />
      <span className="mw-thread__tip" />
    </div>
  );
}
