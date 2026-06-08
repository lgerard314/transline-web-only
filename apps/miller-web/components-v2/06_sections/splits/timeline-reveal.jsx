"use client";
// Section-local reveal driver for the history milestone list. Unlike the shared
// MillerScrollReveal (which fires each element the instant its own top peeks in at
// the viewport bottom), here each item is held until there is room to fit the WHOLE
// item + 40px above the fold — i.e. its rest-bottom has risen at least 40px above the
// viewport bottom. At that point the CSS transition slides it up from the bottom of
// the screen into its slot (the hidden state parks it one item-height + 40px below
// rest, which is the bottom of the viewport at that moment). The exit mirrors this at
// the top: the moment an item's rest-top reaches the top of the screen we flip
// [data-out] and the same transition slides it up out of the top edge and fades it —
// symmetric with the entry, and reversible (scroll back down → drops [data-out]).
//
// These items opt out of the shared [data-reveal] observer (the JSX drops that attr)
// and are driven here instead; the CSS reveal is keyed on [data-in="1"]. We "arm" the
// list (data-rev-armed) only once this effect is running, so the hidden state never
// applies pre-hydration / with JS disabled — the milestones stay visible in that
// case. Under prefers-reduced-motion we don't arm or attach at all, leaving every
// item shown.
//
// We read each item's REST position from the untransformed list rect plus the item's
// offsetTop/offsetHeight (layout metrics, immune to the item's own reveal transform),
// so the parked translate of a hidden item can't corrupt its own trigger. Mirrors
// MillerParallax's rAF/passive-listener shape.

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
      lists = Array.from(document.querySelectorAll("[data-timeline-reveal]")).map((list) => {
        const grid = list.closest(".mw-ten3__grid");
        return {
          list,
          // The image banner in the same record — the timeline holds until the banner's
          // bottom edge has passed the bottom of the screen; the eyebrow above the list is
          // revealed the moment the banner is fully rendered (its --wipe completes).
          banner: grid ? grid.querySelector(".mw-ten3__banner") : null,
          eyebrow: grid ? grid.querySelector("[data-record-eyebrow]") : null,
          items: Array.from(list.querySelectorAll(".mw-ten3__item")).map((el) => ({
            el,
            // Seed from the DOM so the change-guard stays consistent across re-collects.
            on: el.hasAttribute("data-in"),
            out: el.hasAttribute("data-out"),
          })),
        };
      });
    };

    const render = () => {
      raf = 0;
      const vh = window.innerHeight;
      // The fixed header (.tl-topbar past-hero state) overlays the top HDR px of the viewport, so
      // that band is the real TOP fold for the timeline — an item must leave before it slides under
      // the header, or it reads as cut off. Mirror the entry's 40px clearance on this fold.
      const HDR = 56;
      const writes = [];
      for (const { list, items, banner, eyebrow } of lists) {
        // GATE: don't begin revealing any milestone until the banner's bottom edge has
        // passed the bottom of the screen (banner fully on-screen). No banner → ready.
        const ready = !banner || banner.getBoundingClientRect().bottom <= vh;
        // EYEBROW: reveal it the instant the banner is fully rendered (its wipe completes).
        if (eyebrow) {
          const wipe = banner ? parseFloat(getComputedStyle(banner).getPropertyValue("--wipe")) : NaN;
          const rendered = isNaN(wipe) || wipe >= 0.999;
          const has = eyebrow.hasAttribute("data-in");
          if (rendered && !has) eyebrow.setAttribute("data-in", "1");
          else if (!rendered && has) eyebrow.removeAttribute("data-in");
        }
        // READ phase. The <ol> is never transformed, so its rect top is a stable
        // reference; combined with each item's layout offsetTop/offsetHeight (which a
        // transform does not affect) it yields the item's REST bottom even while the
        // item is parked below the fold by the hidden-state translate.
        const listTop = list.getBoundingClientRect().top;
        for (let i = 0; i < items.length; i++) {
          const el = items[i].el;
          const restTop = listTop + el.offsetTop;
          const restBottom = restTop + el.offsetHeight;
          // Reveal once the highlights are fully out AND there's room for the WHOLE item +
          // 40px above the BOTTOM fold (the viewport bottom)...
          const on = ready && restBottom + 40 <= vh;
          // ...and LEAVE symmetrically at the TOP fold: the moment its rest-top rises within 40px
          // of the header's bottom edge, so it slides up + fades OUT before the header can clip it
          // (mirror of the entry — same 40px clearance, measured from the header instead of vh=0).
          const out = restTop <= HDR + 40;
          if (on !== items[i].on || out !== items[i].out) writes.push([items[i], on, out]);
        }
      }
      // WRITE phase.
      for (const [it, on, out] of writes) {
        it.on = on;
        it.out = out;
        if (on) it.el.setAttribute("data-in", "1");
        else it.el.removeAttribute("data-in"); // repeat: re-hide so it replays on re-entry
        if (out) it.el.setAttribute("data-out", "");
        else it.el.removeAttribute("data-out"); // repeat: restore as it scrolls back down
      }
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(render); };
    const onResize = () => { collect(); onScroll(); };

    const arm = (on) => lists.forEach(({ list, eyebrow }) => {
      if (on) {
        list.setAttribute("data-rev-armed", "");
        if (eyebrow) eyebrow.setAttribute("data-armed", "");
      } else {
        list.removeAttribute("data-rev-armed");
        if (eyebrow) eyebrow.removeAttribute("data-armed");
      }
    });

    const clear = () => lists.forEach(({ items, eyebrow }) => {
      items.forEach((it) => {
        it.el.removeAttribute("data-in");
        it.el.removeAttribute("data-out");
        it.on = false;
        it.out = false;
      });
      if (eyebrow) eyebrow.removeAttribute("data-in");
    });

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
