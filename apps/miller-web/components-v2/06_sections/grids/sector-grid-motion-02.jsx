"use client";
import { useEffect } from "react";

// Scroll-reveal driver for the SectorDiamonds02 arc gallery. When the arch scrolls into view
// we add `.is-in`; the cards then run a staggered CSS fade-up (delay = each card's --ai index).
// When the arch is scrolled FULLY out of view (past the top or the bottom) we remove `.is-in`,
// so it re-arms and the reveal replays the next time it scrolls back in — in either direction.
// A separate observer eagerly loads + decodes the arc photos ~800px ahead so they're painted
// before the reveal plays. No scroll handler, no per-frame JS. prefers-reduced-motion skips the
// animation and shows the arch at rest. Scoped to `.mw-secd2__arc` so it only drives the v1 copy.
export function SectorGridMotion02() {
  useEffect(() => {
    const arc = document.querySelector(".mw-secd2__arc");
    if (!arc) return;

    // Preload + decode the photos ahead of the reveal.
    const imgs = Array.from(arc.querySelectorAll("img"));
    const pre = new IntersectionObserver(
      (entries, obs) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        imgs.forEach((img) => {
          try { img.loading = "eager"; if (img.decode) img.decode().catch(() => {}); } catch {}
        });
        obs.disconnect();
      },
      { rootMargin: "0px 0px 800px 0px" },
    );
    pre.observe(arc);

    let io;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      arc.classList.add("is-armed"); // hold the cards hidden until they animate in
      // Watch the whole SECTION (not just the arch): play (.is-in) while any part of the section is
      // on screen, and reset only once it is COMPLETELY out of view (no rootMargin → never resets
      // while the intro below the arch is still visible). Toggling means the reveal replays on
      // re-entry from either direction, with no dead-zone when the section re-enters bottom-first.
      const section = arc.closest(".mw-secd2") || arc;
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) arc.classList.toggle("is-in", e.isIntersecting);
        },
        { threshold: 0 },
      );
      io.observe(section);
    }

    return () => { pre.disconnect(); if (io) io.disconnect(); };
  }, []);

  return null;
}
