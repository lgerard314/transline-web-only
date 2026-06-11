"use client";
import { useEffect, useRef, useState } from "react";

// ImageAccordion01 — a hover-expand image accordion (horizontal on desktop,
// vertical on mobile). One panel is open at a time (hover / focus / tap); the
// open panel fills the band with the full photo + a horizontal mono caption, the
// rest collapse to clay slivers carrying a vertical caption spine. Placed full-bleed
// so the row runs from the content column to the RIGHT edge of the screen.
// Styling: app/styles/home/facility.css (.mw-iacc*).
//
// Entrance is SCROLL-DRIVEN (the home page's hero / "our history" plate gesture): each
// photo panel reveals as a clay plate whose window opens — a clip-path inset opening to
// 0, a zoom layer that settles (scale 1.22 -> 1), and the panel rising + fading in —
// staggered LEFT-TO-RIGHT across the row, the image carrying its diagonal parallax. Once
// the photos are in, the sibling intro text mask-rises (this widget sets --p on
// .mw-fac2__intro). All scrubbed by one scroll timeline; reduced-motion rests everything.
//
// Props: photos — [{ src, alt, caption }]
//        reveal={false} (VBEC) — parent-owned entrance; mouse parallax on the open panel
//          is armed via data-iacc-hover on .mw-fac2__media (set by MediaSplit01).
export function ImageAccordion01({ photos, label = "Facility photo gallery", reveal = true }) {
  const [open, setOpen] = useState(0);
  const rootRef = useRef(null);

  // VBEC — mouse parallax on the open (big) panel photo while hovering the image clip.
  // Offset is applied on .mw-iacc__zoom (separate layer from scroll parallax on the <img>).
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reveal) return;
    const mediaCol = root.closest(".mw-fac2__media");
    if (!mediaCol) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const HOVER_X = 22;
    const HOVER_Y = 16;
    let hitEl = null;

    const resetHover = () => {
      root.querySelectorAll(".mw-iacc__zoom").forEach((z) => {
        z.style.removeProperty("--hover-x");
        z.style.removeProperty("--hover-y");
      });
    };

    const onMove = (e) => {
      if (!hitEl || !mediaCol.hasAttribute("data-iacc-hover")) return;
      const panel = root.querySelector(".mw-iacc__panel.is-open");
      const zoom = panel?.querySelector(".mw-iacc__zoom");
      if (!zoom) return;
      const r = hitEl.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
      root.querySelectorAll(".mw-iacc__panel:not(.is-open) .mw-iacc__zoom").forEach((z) => {
        z.style.removeProperty("--hover-x");
        z.style.removeProperty("--hover-y");
      });
      zoom.style.setProperty("--hover-x", `${(nx * HOVER_X).toFixed(2)}px`);
      zoom.style.setProperty("--hover-y", `${(ny * HOVER_Y).toFixed(2)}px`);
    };

    const unbind = () => {
      if (!hitEl) return;
      hitEl.removeEventListener("mousemove", onMove);
      hitEl.removeEventListener("mouseleave", resetHover);
      hitEl = null;
    };

    const bind = () => {
      unbind();
      if (!mediaCol.hasAttribute("data-iacc-hover")) return;
      const panel = root.querySelector(".mw-iacc__panel.is-open");
      const media = panel?.querySelector(".mw-iacc__media");
      if (!media) return;
      hitEl = media;
      hitEl.addEventListener("mousemove", onMove);
      hitEl.addEventListener("mouseleave", resetHover);
    };

    const obs = new MutationObserver(bind);
    obs.observe(mediaCol, { attributes: true, attributeFilter: ["data-iacc-hover"] });
    bind();
    return () => {
      obs.disconnect();
      unbind();
      resetHover();
    };
  }, [reveal, open]);

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
    const PHOTO_DUR = 640, STAG = 130;                   // per-item span / stagger (timeline units)
    const TEXT_DUR = 600;
    // CASCADE ORDER FOLLOWS THE VISUAL ORDER, not the DOM: the targets (photo panels +
    // intro text risers) are slotted by their on-screen position — top first, then left —
    // so when CSS re-composes the section (e.g. the ≤900 single column places the field
    // line ABOVE the photo strip), the reveal sweeps exactly what the eye sees, top to
    // bottom. Recomputed on resize (orientation/breakpoint changes re-order the page).
    // Panels all share the same resting --p translate, so relative order is unaffected
    // by measuring mid-pose; a 24px tolerance treats same-row items as ties (sorted by
    // left, so a horizontal strip sweeps left → right).
    const targets = [
      ...panels.map((el) => ({ el, dur: PHOTO_DUR })),
      ...risers.map((el) => ({ el, dur: TEXT_DUR })),
    ];
    let ordered = null;
    const ensureOrder = () => {
      if (ordered) return ordered;
      const measured = targets.map((t) => {
        const r = t.el.getBoundingClientRect();
        return { ...t, top: r.top + window.scrollY, left: r.left };
      });
      measured.sort((a, b) => (Math.abs(a.top - b.top) > 24 ? a.top - b.top : a.left - b.left));
      measured.forEach((t, k) => { t.start = k * STAG; });
      ordered = measured;
      return ordered;
    };
    const TOTAL = (targets.length - 1) * STAG + Math.max(PHOTO_DUR, TEXT_DUR);
    const photoTotal = TOTAL; // the desktop slope anchors the whole cascade to the photo bottom
    const START = 0.9, END = 0.36;   // mobile fallback scrub: T=0 at root.top 90% vh → TOTAL at 36% vh
    // (Desktop anchors the cascade END to the big photo's bottom instead — see compute().)

    let raf = 0;
    const apply = (T) => {
      for (const t of ensureOrder()) {
        const l = (T - t.start) / t.dur;
        const v = l <= 0 ? 0 : l >= 1 ? 1 : ease(l);
        t.el.style.setProperty("--p", v.toFixed(4));
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
        // SUBTLE ZOOM-OUT (≤900 strip): the photos rest slightly zoomed-in and ease OUT as
        // the strip rises through the viewport — one var on the root, consumed by the zoom
        // layer in CSS (facility-pin.css), scrubbing 0 → 1 from entry to ~22% viewport.
        const zo = Math.min(1, Math.max(0, (0.92 * vh - top) / (0.7 * vh)));
        root.style.setProperty("--iacc-zo", zo.toFixed(3));
      }
      apply(T);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute); };
    const onResize = () => { ordered = null; onScroll(); }; // re-slot: layout may have re-ordered

    if (mq.matches) { setAll("1"); }
    else {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });
      compute();
    }
    const onMq = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } compute(); };
    mq.addEventListener("change", onMq);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", onMq);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [photos, reveal]);

  if (!photos || photos.length === 0) return null;

  return (
    <div className={"mw-iacc" + (!reveal ? " mw-iacc--hover-px" : "")} role="group" aria-label={label} ref={rootRef}>
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
