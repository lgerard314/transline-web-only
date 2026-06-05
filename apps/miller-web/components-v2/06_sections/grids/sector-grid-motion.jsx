"use client";
import { useEffect } from "react";

// One-shot LEFT→RIGHT reveal for the SectorDiamonds grid — fired by IntersectionObserver,
// played entirely by CSS. When the grid scrolls into view we add `.is-in`; the cells then
// run a `@keyframes` fade + slide-in whose `animation-delay` is staggered by each diamond's
// x-fraction (`--fx`), so it sweeps gutter-first to the right. There is NO scroll handler and
// NO per-frame JS — the browser composites the animation, so it stays smooth at any scroll
// speed. A separate observer eagerly loads + decodes the photos ~800px before the grid
// enters, so they're painted by the time the reveal plays (no pop-in on a fast scroll).
// prefers-reduced-motion skips the animation and shows the grid at rest.
export function SectorGridMotion() {
  useEffect(() => {
    const grid = document.querySelector(".mw-secd__grid");
    if (!grid) return;

    // Preload + decode the photos ahead of the reveal.
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
      grid.classList.add("is-armed"); // hold the cells hidden until they animate in
      io = new IntersectionObserver(
        (entries, obs) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            e.target.classList.add("is-in"); // fire the CSS keyframe cascade (once)
            obs.disconnect();
          }
        },
        { threshold: 0, rootMargin: "0px 0px -8% 0px" },
      );
      io.observe(grid);
    }

    return () => { pre.disconnect(); if (io) io.disconnect(); };
  }, []);

  return null;
}
