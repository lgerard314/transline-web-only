"use client";
// Miller-specific scroll-reveal driver. Replaces the brand baseline
// ScrollReveal which fires animations ~400px BELOW the viewport — by
// the time the user scrolls to the element the motion has already
// completed. We trigger when the element actually enters the viewport
// (5% intersection past the bottom edge) so the user sees the motion
// play instead of seeing a static post-state.
//
// The accompanying CSS (in globals.css, "MILLER reveal v2" block)
// provides distinct keyframe animations per data-reveal variant:
//   default | "up"     → fade-up
//   "title"            → rise + letter-spacing tighten + de-blur
//   "photo"            → clip-path mask reveal from bottom
//   "stat"             → scale overshoot (springy)
//   "card"             → rise + faint scale-in
//   "left" | "right"   → directional slide
//
// Plus data-reveal-stagger on a container cascades its direct children
// with 100ms-spaced delays using the "card" animation.

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
        // Use threshold: 0 with a pixel-based bottom margin so the
        // trigger is "ANY part of the element has crossed a line near
        // the viewport bottom" rather than "X% of the element's area
        // is visible." With a ratio threshold, a card half the size of
        // its sibling at the same top would fire earlier (because its
        // 8% is fewer pixels) — that's why Environmental Remediation
        // was firing before the taller Industrial Waste Treatment
        // anchor even though they share the same top.
        //
        // Positive bottom rootMargin extends the trigger zone BELOW the
        // viewport, so elements start animating just before they enter
        // visible area — less scrolling required to see them render.
        threshold: 0,
        rootMargin: "0px 0px 120px 0px",
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

    // Assign a --reveal-order CSS variable to each stagger child based on
    // its actual visual position — sorted by TOP, then by LEFT — so that
    // cascade order follows what the eye reads (top-to-bottom rows; within
    // a row, left-to-right). Two items at the same top with one further
    // left fire first by exactly one stagger-step. Recomputed on resize
    // because responsive layouts can reorder cells visually.
    const SAME_ROW_TOLERANCE_PX = 8;
    const assignOrder = () => {
      document.querySelectorAll("[data-reveal-stagger]").forEach((container) => {
        const children = Array.from(container.children);
        const ranked = children
          .map((el) => ({ el, rect: el.getBoundingClientRect() }))
          .sort((a, b) => {
            const dt = a.rect.top - b.rect.top;
            if (Math.abs(dt) > SAME_ROW_TOLERANCE_PX) return dt;
            return a.rect.left - b.rect.left;
          });
        ranked.forEach((item, order) => {
          item.el.style.setProperty("--reveal-order", order);
        });
      });
    };

    // Two passes catch any nodes that React commits in a second tick
    // (async chunks, image-driven layout shifts).
    const t1 = setTimeout(() => { attach(); assignOrder(); }, 60);
    const t2 = setTimeout(() => { attach(); assignOrder(); }, 280);
    const onResize = () => assignOrder();
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      io.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", onResize);
    };
  }, [pathname]);

  return null;
}
