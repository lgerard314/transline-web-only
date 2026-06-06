"use client";
// Section-local reveal driver for the history milestone list. Unlike the shared
// MillerScrollReveal (which fires each element on ITS OWN top crossing the viewport
// bottom), here each item is held until the NEXT item's top crosses that same entry
// line — so an item only animates once the following card begins to enter from the
// bottom (the last item uses the list's own bottom edge, since there is no card
// after it). Items therefore reveal when they sit comfortably in view rather than
// the instant they peek in at the bottom edge.
//
// These items opt out of the shared [data-reveal] observer (the JSX drops that attr)
// and are driven here instead; the CSS still uses the section's mw-ten3-wave keyframe
// keyed on [data-in="1"]. We "arm" the list (data-rev-armed) only once this effect is
// running, so the hidden state never applies pre-hydration / with JS disabled — the
// milestones stay visible in that case. Under prefers-reduced-motion we don't arm or
// attach at all, leaving every item shown.
//
// Mirrors MillerParallax's rAF/passive-listener shape; reads all geometry before any
// attribute write so a reveal can't invalidate the next item's measurement.

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function TimelineReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lists = [];
    let raf = 0;
    let attached = false;

    const collect = () => {
      lists = Array.from(document.querySelectorAll("[data-timeline-reveal]")).map((list) => ({
        list,
        items: Array.from(list.querySelectorAll(".mw-ten3__item")).map((el) => ({
          el,
          // Seed from the DOM so the change-guard stays consistent across re-collects.
          on: el.hasAttribute("data-in"),
        })),
      }));
    };

    const render = () => {
      raf = 0;
      const vh = window.innerHeight;
      const writes = [];
      for (const { items } of lists) {
        // READ phase — gather every measurement before any write below.
        const tops = items.map((it) => it.el.getBoundingClientRect().top);
        for (let i = 0; i < items.length; i++) {
          // The NEXT item's top is the trigger. The last item has no following card,
          // and the list's bottom never reaches the viewport bottom in this layout,
          // so it falls back to its OWN top — the only signal guaranteed to fire (its
          // top still enters from the bottom). It thus reveals alongside the second-
          // to-last (both keyed to the last item's top crossing the entry line).
          const triggerTop = i + 1 < items.length ? tops[i + 1] : tops[i];
          const on = triggerTop <= vh;
          if (on !== items[i].on) writes.push([items[i], on]);
        }
      }
      // WRITE phase.
      for (const [it, on] of writes) {
        it.on = on;
        if (on) it.el.setAttribute("data-in", "1");
        else it.el.removeAttribute("data-in"); // repeat: re-hide so it replays on re-entry
      }
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(render); };
    const onResize = () => { collect(); onScroll(); };

    const arm = (on) => lists.forEach(({ list }) => {
      if (on) list.setAttribute("data-rev-armed", "");
      else list.removeAttribute("data-rev-armed");
    });

    const clear = () => lists.forEach(({ items }) => items.forEach((it) => {
      it.el.removeAttribute("data-in");
      it.on = false;
    }));

    const enable = () => {
      if (attached) return;
      collect();
      if (!lists.length) return;
      attached = true;
      arm(true); // JS confirmed running → the hidden state may apply
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });
      render();
    };

    const disable = () => {
      if (!attached) return;
      attached = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      clear();
      arm(false); // un-hide everything (reduced-motion / teardown)
    };

    const sync = () => (mq.matches ? disable() : enable());

    // Collect after first paint and again once async layout / fonts settle (item
    // tops shift, which changes when each trigger crosses).
    const t1 = setTimeout(sync, 60);
    const t2 = setTimeout(() => { if (attached) { collect(); arm(true); onScroll(); } }, 280);
    const onLoad = () => { if (attached) { collect(); arm(true); onScroll(); } else sync(); };
    window.addEventListener("load", onLoad);
    mq.addEventListener("change", sync);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("load", onLoad);
      mq.removeEventListener("change", sync);
      disable();
    };
  }, [pathname]);

  return null;
}
