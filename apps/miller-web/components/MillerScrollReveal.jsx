"use client";
// Miller-specific scroll-reveal driver. Replaces the brand baseline
// ScrollReveal which fires animations ~400px BELOW the viewport — by
// the time the user scrolls to the element the motion has already
// completed. We trigger when the element actually enters the viewport
// (5% intersection past the bottom edge) so the user sees the motion
// play instead of seeing a static post-state.
//
// The accompanying CSS (in app/styles/02-primitives.css, "Scroll reveal" block)
// provides a SINGLE keyframe (mw-rv): a quick, subtle fade with a short
// upward settle, used by every element with `data-reveal`.
//
// data-reveal-stagger on a container: its direct children are each
// observed individually (so each fires on its OWN top), and also get a
// --reveal-order delay equal to their column index within their row, so
// the LEFT element of a row reveals before the ones to its right. Plain
// data-reveal elements leave --reveal-order unset → 0 delay.

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MillerScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          // Defer one frame so the painter has committed the hidden
          // state before the visible-state cascade kicks in.
          const target = e.target;
          requestAnimationFrame(() => target.setAttribute("data-in", "1"));
          io.unobserve(target);
        }
      },
      {
        // Use threshold: 0 so the trigger is "ANY part of the element has
        // crossed the line" rather than "X% of the element's area is
        // visible." With a ratio threshold, a card half the size of its
        // sibling at the same top would fire earlier (because its 8% is
        // fewer pixels) — that's why Environmental Remediation was firing
        // before the taller Industrial Waste Treatment anchor even though
        // they share the same top.
        //
        // Bottom rootMargin is 0: the trigger line IS the viewport bottom,
        // so an element reveals as it scrolls INTO view and the motion
        // plays on-screen. A positive bottom margin (previously +120px)
        // pre-fired elements while still off-screen — on a slow scroll the
        // 320ms animation finished before the element was visible, so no
        // motion was seen; worse, content sitting just below the fold (the
        // certifications band) fired on initial page load and was already
        // settled by the time the user scrolled down to it.
        threshold: 0,
        rootMargin: "0px",
      },
    );

    const attach = () => {
      // Every element with data-reveal is observed individually so it
      // fires when IT crosses the viewport edge. Direct children of a
      // [data-reveal-stagger] container are ALSO observed individually
      // — the stagger attribute only signals "these children should
      // cascade left-to-right when several enter together," not
      // "fire all at once when the parent enters."
      document
        .querySelectorAll("[data-reveal], [data-reveal-stagger] > *")
        .forEach((el) => {
          if (el.getAttribute("data-in") !== "1") io.observe(el);
        });
    };

    // Assign a --reveal-order to each stagger child = its COLUMN index
    // within its visual row, so within every row the LEFT element reveals
    // first and the ones to its right trail by one step. Each element
    // still fires its own animation when its top crosses the viewport
    // edge; --reveal-order only adds a small delay on top of that, reset
    // to 0 at the start of each row so lower rows stay snappy (a global
    // rank would make a card in row 4 sit blank for hundreds of ms after
    // it appears).
    //
    // Rows are grouped by VERTICAL OVERLAP, not by equal `top`. Two-column
    // splits (e.g. a heading with `align-items: end`) bottom-align their
    // columns, so their tops differ by tens of px even though they share a
    // row — a top-equality test would wrongly split them and lose the
    // left→right order. Each row's band is fixed to its TOPMOST element's
    // box (we do NOT extend the band downward for tall members), which
    // also stops a tall grid cell that spans two visual rows from merging
    // them into one over-delayed band.
    const ROW_OVERLAP_EPS_PX = 8;
    const assignOrder = () => {
      document.querySelectorAll("[data-reveal-stagger]").forEach((container) => {
        const items = Array.from(container.children)
          .map((el) => ({ el, r: el.getBoundingClientRect() }))
          // Skip zero-box children (e.g. display:contents wrappers): they
          // have no geometry to order and can't be observed anyway.
          .filter(({ r }) => r.width > 0 && r.height > 0)
          .sort((a, b) => a.r.top - b.r.top);

        const rows = [];
        let cur = null;
        for (const it of items) {
          if (!cur || it.r.top >= cur.bandBottom - ROW_OVERLAP_EPS_PX) {
            cur = { bandBottom: it.r.bottom, members: [it] };
            rows.push(cur);
          } else {
            cur.members.push(it);
          }
        }
        for (const row of rows) {
          row.members.sort((a, b) => a.r.left - b.r.left);
          row.members.forEach(({ el }, col) =>
            el.style.setProperty("--reveal-order", col),
          );
        }
      });
    };

    // Two early passes catch nodes React commits in a second tick (async
    // chunks); the load pass catches order shifts after lazy images and
    // fonts settle (without it, a row that reflows post-paint keeps the
    // stale column order computed before its images loaded).
    const t1 = setTimeout(() => { attach(); assignOrder(); }, 60);
    const t2 = setTimeout(() => { attach(); assignOrder(); }, 280);
    const onLoad = () => { attach(); assignOrder(); };
    window.addEventListener("load", onLoad);

    // ResizeObserver on <body> recomputes order on any reflow — viewport
    // resize, font swap, or a lazy image below the fold loading and
    // pushing layout. rAF-coalesced so a burst of image loads recomputes
    // once. Setting --reveal-order writes no layout, so this can't loop.
    let rafId = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(assignOrder);
    });
    ro.observe(document.body);

    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("load", onLoad);
    };
  }, [pathname]);

  return null;
}
