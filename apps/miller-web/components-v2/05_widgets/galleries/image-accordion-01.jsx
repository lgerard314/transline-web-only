"use client";
import { useEffect, useRef, useState } from "react";

// ImageAccordion01 — a hover-expand image accordion (horizontal on desktop,
// vertical on mobile). One panel is open at a time (hover / focus / tap); the
// open panel fills the band with the full photo + a horizontal mono caption, the
// rest collapse to clay slivers carrying a vertical caption spine. Placed full-bleed
// so the row runs from the content column to the RIGHT edge of the screen.
// Styling: app/styles/04-home.css (.mw-iacc*).
//
// Entrance is SCROLL-DRIVEN (the home page's hero / "our history" plate gesture): each
// photo panel reveals as a clay plate whose window opens — a clip-path inset opening to
// 0, a zoom layer that settles (scale 1.22 -> 1), and the panel rising + fading in —
// staggered LEFT-TO-RIGHT across the row, the image carrying its diagonal parallax. Once
// the photos are in, the sibling intro text mask-rises (this widget sets --p on
// .mw-fac2__intro). All scrubbed by one scroll timeline; reduced-motion rests everything.
//
// Props: photos — [{ src, alt, caption }]
//        highlightsDone — when true (VBEC pin: after the 3-figure band finishes), a light
//          mouse parallax runs on the open panel only (scroll parallax + photo scale unchanged).
export function ImageAccordion01({ photos, label = "Facility photo gallery", reveal = true, highlightsDone = false }) {
  const [open, setOpen] = useState(0);
  const rootRef = useRef(null);

  // Light mouse parallax on the open (big) photo once scroll parallax is disabled.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !highlightsDone) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const HOVER_X = 11;
    const HOVER_Y = 8;

    const resetHover = () => {
      root.querySelectorAll(".mw-iacc__img").forEach((img) => {
        img.style.setProperty("--hx", "0px");
        img.style.setProperty("--hy", "0px");
      });
    };

    const onMove = (e) => {
      const panel = root.querySelector(".mw-iacc__panel.is-open");
      if (!panel) return;
      const img = panel.querySelector(".mw-iacc__img");
      if (!img) return;
      const r = panel.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
      resetHover();
      img.style.setProperty("--hx", `${(nx * HOVER_X).toFixed(2)}px`);
      img.style.setProperty("--hy", `${(ny * HOVER_Y).toFixed(2)}px`);
    };

    root.addEventListener("mousemove", onMove);
    root.addEventListener("mouseleave", resetHover);
    return () => {
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", resetHover);
      resetHover();
    };
  }, [highlightsDone, open]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const panels = Array.from(root.querySelectorAll(".mw-iacc__panel"));
    if (!panels.length) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // The intro text lives in the sibling left column; its four masked parts rise after.
    const grid = root.closest(".mw-fac2__grid");
    const intro = grid ? grid.querySelector(".mw-fac2__intro") : null;
    const risers = intro ? Array.from(intro.querySelectorAll(".mw-fac2__rise")) : [];

    const setAll = (v) => {
      for (const p of panels) p.style.setProperty("--p", v);
      for (const el of risers) el.style.setProperty("--p", v);
    };

    // When the entrance is owned by a parent (e.g. MediaSplit01's column-slide fill), skip the
    // scroll-scrubbed cascade entirely and rest every photo fully shown (--p = 1).
    if (!reveal) { setAll("1"); return; }

    // SCROLL-SCRUBBED plate-window cascade — each photo opens (window opens + zoom-settles
    // + rises + fades), staggered LEFT-TO-RIGHT so the big/open photo lands FIRST; then the
    // intro text mask-rises top-down — but tied to the SCROLLBAR instead of a timer. The gallery's
    // approach up through the lower viewport maps to a virtual timeline T ∈ [0, TOTAL];
    // each panel/riser reads its OWN slice of T exactly as the timed version did, so the
    // sequence + start point are identical — it just tracks scroll position and reverses
    // on scroll-up. The section pins shortly after, freezing T at TOTAL (fully revealed).
    // We measure the (non-transformed) root rect for the trigger — reading a panel's own
    // transformed rect would feed its --p translate back and deadlock. Reduced-motion rests
    // everything at --p = 1.
    const ease = (x) => 1 - Math.pow(1 - x, 3);          // easeOutCubic
    const PHOTO_DUR = 640, PHOTO_STAG = 130;             // per-photo span / stagger (timeline units)
    const TEXT_GAP = 120, TEXT_DUR = 600, TEXT_STAG = 110;
    const photoTotal = (panels.length - 1) * PHOTO_STAG + PHOTO_DUR;
    const textTotal = risers.length ? (risers.length - 1) * TEXT_STAG + TEXT_DUR : 0;
    const TOTAL = photoTotal + TEXT_GAP + textTotal;
    const START = 0.9, END = 0.36;   // mobile fallback scrub: T=0 at root.top 90% vh → TOTAL at 36% vh
    // (Desktop anchors the cascade END to the big photo's bottom instead — see compute().)

    let raf = 0;
    const apply = (T) => {
      for (let i = 0; i < panels.length; i++) {
        // Stagger: the big/open photo (panel 0) opens FIRST and the small sliver photos
        // follow LEFT-TO-RIGHT, so the headline picture leads the cascade.
        const stagIdx = i;
        const l = (T - stagIdx * PHOTO_STAG) / PHOTO_DUR;
        const v = l <= 0 ? 0 : l >= 1 ? 1 : ease(l);
        panels[i].style.setProperty("--p", v.toFixed(4));
      }
      for (let i = 0; i < risers.length; i++) {
        const l = (T - photoTotal - TEXT_GAP - i * TEXT_STAG) / TEXT_DUR;
        const v = l <= 0 ? 0 : l >= 1 ? 1 : ease(l);
        risers[i].style.setProperty("--p", v.toFixed(4));
      }
    };
    const compute = () => {
      raf = 0;
      if (mq.matches) { setAll("1"); return; }
      const vh = window.innerHeight || document.documentElement.clientHeight || 1;
      const top = root.getBoundingClientRect().top;   // root is NOT transformed → safe
      // DESKTOP: end the PHOTO cascade exactly when the big photo's bottom is JUST ABOVE the
      // screen bottom. The root is not transformed and its height equals the big/open photo's
      // height, so root.bottom == the big photo's bottom. Photos finish (T = photoTotal) at
      // root.bottom = vh - END_MARGIN (i.e. root.top = vh - END_MARGIN - rootH); the cascade
      // starts at root.top = START*vh, and the text rise continues at the same scroll rate and
      // still completes before the section pins. (Mobile keeps the fixed START → END fraction.)
      let T;
      if (window.matchMedia("(min-width: 901px)").matches) {
        const END_MARGIN = Math.round(vh * 0.03);      // "just above" the screen bottom
        const rootH = root.offsetHeight;
        const topStart = START * vh;
        const topPhotoEnd = vh - END_MARGIN - rootH;
        const slope = Math.max(0.001, (topStart - topPhotoEnd) / photoTotal); // px of scroll per timeline unit
        T = Math.min(TOTAL, Math.max(0, (topStart - top) / slope));
      } else {
        const p = Math.min(1, Math.max(0, (START * vh - top) / ((START - END) * vh)));
        T = p * TOTAL;
      }
      apply(T);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute); };

    if (mq.matches) { setAll("1"); }
    else {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      compute();
    }
    const onMq = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } compute(); };
    mq.addEventListener("change", onMq);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mq.removeEventListener("change", onMq);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [photos, reveal]);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="mw-iacc" role="group" aria-label={label} ref={rootRef}>
      <div className="mw-iacc__track">
        {photos.map((photo, i) => {
          const isOpen = i === open;
          const num = String(i + 1).padStart(2, "0");
          const cap = photo.caption || photo.alt || `Photo ${num}`;
          return (
            <button
              key={i}
              type="button"
              className={"mw-iacc__panel" + (isOpen ? " is-open" : "")}
              style={{ "--p": reveal ? 0 : 1 }}
              aria-pressed={isOpen}
              aria-label={cap}
              onMouseEnter={() => setOpen(i)}
              onFocus={() => setOpen(i)}
              onClick={() => setOpen(i)}
            >
              {/* media → zoom → img: clip window, entrance zoom layer, and the
                  photo with its own diagonal parallax drift (hero/history technique). */}
              <span className="mw-iacc__media">
                <span className="mw-iacc__zoom">
                  <img
                    className="mw-iacc__img"
                    src={photo.src}
                    alt={isOpen ? (photo.alt || "") : ""}
                    loading="lazy"
                    draggable="false"
                    data-parallax-img=""
                    data-parallax-x="1"
                    data-parallax-max="0.14"
                  />
                </span>
              </span>
              <span className="mw-iacc__spine" aria-hidden="true">{cap}</span>
              <span className="mw-iacc__cap">
                <span className="mw-iacc__cap-mark" aria-hidden="true" />
                <span className="mw-iacc__cap-text">{cap}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
