"use client";
import { useEffect } from "react";

// Scroll-scrubbed reveal for the enhanced diamond grid (SectorDiamonds03/04 / .mw-secd--int).
// Cells start hidden (.is-armed); once EVERY diamond has cleared the viewport bottom (+ buffer)
// progress is read from live geometry (reverses on scroll-up). Off-screen below → fully shown;
// off-screen above → resting hidden pose. Eager-loads photos ~800px ahead.
const REVEAL_BUFFER = 48; // px cushion past the viewport bottom before the scrub arms
const REVEAL_VH = 0.42;   // scroll span (viewport-heights) to run the full staggered reveal
const STAGGER = 0.45;     // mirrors the original fx * 0.5s delay over the ~1.12s cascade
const START_SCALE = 0.25;
const START_ROT = -(210 + 120);
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = (x) => 1 - Math.pow(1 - clamp01(x), 3);

export function SectorGridMotion03() {
  useEffect(() => {
    const grid = document.querySelector(".mw-secd--int .mw-secd__grid");
    if (!grid) return;
    const section = grid.closest(".mw-secd") || grid;
    const cells = () => Array.from(grid.children);

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

    const mqRM = window.matchMedia("(prefers-reduced-motion: reduce)");

    const layoutBottom = (cell, gridTop) => gridTop + cell.offsetTop + cell.offsetHeight;

    const allDiamondsPastBottom = (vh, list) => {
      const gate = vh - REVEAL_BUFFER;
      const gridTop = grid.getBoundingClientRect().top;
      return list.length > 0 && list.every((cell) => layoutBottom(cell, gridTop) <= gate);
    };

    const applyProgress = (progress, list) => {
      for (const cell of list) {
        const fx = parseFloat(cell.style.getPropertyValue("--fx")) || 0;
        const raw = clamp01((progress - fx * STAGGER) / (1 - STAGGER));
        const spin = ease(raw);
        const boxW = cell.offsetWidth || 1;
        const startX = -boxW;
        const startY = -boxW * 0.5; // above final pose → settles down + right

        if (raw <= 0) {
          cell.style.setProperty("--secd3-op", "0");
          cell.style.setProperty("--secd3-sc", START_SCALE.toFixed(3));
          cell.style.setProperty("--secd3-tx", startX.toFixed(1) + "px");
          cell.style.setProperty("--secd3-ty", startY.toFixed(1) + "px");
          cell.style.setProperty("--secd3-rot", START_ROT + "deg");
          continue;
        }

        cell.style.setProperty("--secd3-op", ease(raw / 0.08).toFixed(3));
        cell.style.setProperty("--secd3-sc", (START_SCALE + (1 - START_SCALE) * spin).toFixed(3));
        cell.style.setProperty("--secd3-tx", ((1 - raw) * startX).toFixed(1) + "px");
        cell.style.setProperty("--secd3-ty", ((1 - raw) * startY).toFixed(1) + "px");
        cell.style.setProperty("--secd3-rot", ((1 - spin) * START_ROT).toFixed(1) + "deg");
      }
    };

    let raf = 0;

    const render = () => {
      raf = 0;
      const list = cells();
      if (!list.length) return;

      if (mqRM.matches) {
        applyProgress(1, list);
        return;
      }

      const vh = window.innerHeight || document.documentElement.clientHeight || 1;
      const gate = vh - REVEAL_BUFFER;
      const revealSpan = Math.max(280, REVEAL_VH * vh);
      const sectionRect = section.getBoundingClientRect();

      // Scrolled past below — keep the fully revealed frame (re-entering from below reverses from here).
      if (sectionRect.bottom < 0) {
        applyProgress(1, list);
        return;
      }
      // Not reached yet — resting hidden pose.
      if (sectionRect.top > vh) {
        applyProgress(0, list);
        return;
      }

      if (!allDiamondsPastBottom(vh, list)) {
        applyProgress(0, list);
        return;
      }

      // Geometry-scrubbed: progress grows as the grid rises past the gate (reverses on scroll-up).
      // Use layout geometry, not transformed bounds. Reading getBoundingClientRect() from cells here
      // feeds the reveal transform back into its own progress calculation, which can jitter on slow scroll.
      const gridTop = grid.getBoundingClientRect().top;
      const lastBottom = Math.max(...list.map((cell) => layoutBottom(cell, gridTop)));
      const progress = clamp01((gate - lastBottom) / revealSpan);
      applyProgress(progress, list);
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(render); };

    const applyMode = () => {
      if (mqRM.matches) grid.classList.remove("is-armed");
      else grid.classList.add("is-armed");
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    mqRM.addEventListener("change", applyMode);
    applyMode();

    return () => {
      pre.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mqRM.removeEventListener("change", applyMode);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
