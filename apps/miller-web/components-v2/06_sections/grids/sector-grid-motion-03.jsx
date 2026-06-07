"use client";
import { useEffect } from "react";

// Reveal driver for the enhanced diamond grid (SectorDiamonds03 / .mw-secd--int). Mirrors the arc
// gallery's driver: arm the grid hidden, then TOGGLE `.is-in` whenever the section is on screen, so
// the staggered reveal replays each time it scrolls back into view and only resets once the section
// is completely out of view (no rootMargin). A separate observer eager-loads + decodes the photos
// ~800px ahead so they're painted before the reveal plays. prefers-reduced-motion shows it at rest.
export function SectorGridMotion03() {
  useEffect(() => {
    const grid = document.querySelector(".mw-secd--int .mw-secd__grid");
    if (!grid) return;

    const imgs = Array.from(grid.querySelectorAll("img"));
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
    pre.observe(grid);

    let io;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      grid.classList.add("is-armed");
      const section = grid.closest(".mw-secd") || grid;
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) grid.classList.toggle("is-in", e.isIntersecting);
        },
        { threshold: 0 },
      );
      io.observe(section);
    }

    return () => { pre.disconnect(); if (io) io.disconnect(); };
  }, []);

  return null;
}
