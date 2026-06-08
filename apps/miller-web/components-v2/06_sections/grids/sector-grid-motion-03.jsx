"use client";
import { useEffect } from "react";

// Reveal driver for the enhanced diamond grid (SectorDiamonds03 / .mw-secd--int). Arms the grid
// hidden, then PLAYS the staggered reveal once the diamonds scroll into view — and DOES NOT replay
// when you scroll the section back into view. It only re-arms (so the next entry replays fresh) once
// the section has COMPLETELY left the viewport. Two observers:
//   • play  — adds `.is-in` when the grid reaches its trigger zone (never removes it), so scrolling
//             up/down while the section stays on screen doesn't restart the animation.
//   • reset — removes `.is-in` when the whole SECTION is fully out of view (threshold 0, no margin).
// A third observer eager-loads + decodes the photos ~800px ahead. prefers-reduced-motion shows it
// at rest.
export function SectorGridMotion03() {
  useEffect(() => {
    const grid = document.querySelector(".mw-secd--int .mw-secd__grid");
    if (!grid) return;
    const section = grid.closest(".mw-secd") || grid;

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

    let playIO, resetIO;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      grid.classList.add("is-armed");
      // PLAY: once the diamonds reach the trigger zone (18% up from the bottom), reveal — and leave it
      // revealed. Adding `.is-in` when it's already there is a no-op, so re-entering never replays.
      playIO = new IntersectionObserver(
        (entries) => {
          for (const e of entries) if (e.isIntersecting) grid.classList.add("is-in");
        },
        { threshold: 0, rootMargin: "0px 0px -18% 0px" },
      );
      playIO.observe(grid);
      // RESET: re-arm ONLY when the section has fully left via the BOTTOM — i.e. you scrolled UP above
      // it and it now sits entirely below the viewport (boundingClientRect.top > 0). Leaving via the TOP
      // (scrolling DOWN past it) must NOT reset, so scrolling back up to it does not replay.
      resetIO = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting && e.boundingClientRect.top > 0) grid.classList.remove("is-in");
          }
        },
        { threshold: 0 },
      );
      resetIO.observe(section);
    }

    return () => { pre.disconnect(); if (playIO) playIO.disconnect(); if (resetIO) resetIO.disconnect(); };
  }, []);

  return null;
}
