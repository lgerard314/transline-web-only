"use client";
import { useEffect, useRef, useState } from "react";

/* Scroll-scrubbed zoom collage — a sticky stage where a mosaic of crew photos
   scales up as the section travels through the viewport, "diving" into the lead
   photo until it fills the frame, then the careers invitation fades in over it.

   Ported from a framer-motion reference (scroll-linked scale) and rebuilt the
   repo way: NO framer-motion / lenis / tailwind. One rAF-coalesced scroll reader
   maps the section's progress (0 when its top hits the top of the viewport, 1
   when its bottom hits the bottom — the reference's ['start start','end end'])
   to a per-photo scale written as a CSS var (--s); CSS composes the transform so
   the positions stay declarative. The last slice of progress drives --reveal,
   which fades the overlay in. prefers-reduced-motion pins progress to 1 (the
   landing photo filled, copy shown) and collapses the scroll track.

   IMAGE QUALITY: the CENTRE photo (index 0, the one that fills the frame at the
   landing) is laid out at its FINAL size (100vw×100vh) and scaled DOWN (0.25→1)
   instead of a small 25vw bitmap being scaled UP — so the landing photo rasterizes
   at full resolution and stays crisp. Its max layer is one viewport, so this adds
   no giant compositor layers. The off-centre photos sweep off-frame during the
   dive, so they keep the lightweight scale-up. */

// Per-photo zoom factor. Index 0 (centre) hits 4 → fills; the rest run larger so
// they sweep past. The centre is handled with the laid-out-large / scale-down trick;
// the others scale up from their small box.
const ZOOM = [4, 5, 6, 5, 6, 8, 9];
// The overlay (scrim) + copy fade/slide in across this window — they begin a little
// early and are FULLY rendered by REVEAL_END (where the dive settles), rather than
// only starting their entrance there.
const REVEAL_START = 0.70;
const REVEAL_END = 0.82;

export function ZoomCollage01({ photos = [], children }) {
  const rootRef = useRef(null);
  const cellRefs = useRef([]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;

    // The dive plays over a FIXED scroll distance (--dive-vh viewport-heights) so it
    // feels identical regardless of how much extra track is added. The extra track
    // beyond the dive is the freeze: progress clamps at 1, holding the finished
    // photo+copy pinned for that short scroll before the section releases.
    let diveVh = 200;
    const readVars = () => {
      const v = parseFloat(getComputedStyle(root).getPropertyValue("--dive-vh"));
      if (v) diveVh = v;
    };

    const apply = (pd) => {
      for (let i = 0; i < cellRefs.current.length; i++) {
        const el = cellRefs.current[i];
        if (!el) continue;
        const z = ZOOM[i % ZOOM.length];
        // Centre photo: laid out at final size, scale DOWN 1/z → 1 (crisp landing).
        // Off-centre photos: scale UP 1 → z from their small box.
        const s = i === 0 ? 1 / z + pd * (1 - 1 / z) : 1 + pd * (z - 1);
        el.style.setProperty("--s", s.toFixed(4));
      }
      const reveal = Math.min(1, Math.max(0, (pd - REVEAL_START) / (REVEAL_END - REVEAL_START)));
      root.style.setProperty("--reveal", reveal.toFixed(3));
      if (reveal > 0.5) root.setAttribute("data-shown", "1");
      else root.removeAttribute("data-shown");
    };

    const render = () => {
      raf = 0;
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight || 1;
      const diveDist = (diveVh / 100) * vh;
      const pd = diveDist > 0 ? Math.min(1, Math.max(0, -rect.top / diveDist)) : 0;
      apply(pd);
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(render); };
    const onResize = () => { readVars(); onScroll(); };

    let attached = false;
    const attach = () => {
      if (attached) return;
      attached = true;
      readVars();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });
      render();
    };
    const detach = () => {
      if (!attached) return;
      attached = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    };

    const sync = () => {
      if (mq.matches) { setReduced(true); detach(); apply(1); }
      else { setReduced(false); detach(); attach(); }
    };
    sync();
    mq.addEventListener("change", sync);
    return () => { detach(); mq.removeEventListener("change", sync); };
  }, []);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="mw-czoom__track" ref={rootRef} data-reduced={reduced ? "1" : undefined}>
      <div className="mw-czoom__stage">
        <div className="mw-czoom__mosaic" aria-hidden="true">
          {photos.slice(0, 7).map((photo, i) => (
            <div className="mw-czoom__cell" key={photo.src} style={{ "--i": i }} ref={(el) => { cellRefs.current[i] = el; }}>
              <div className="mw-czoom__frame">
                <img src={photo.src} alt="" loading="lazy" />
              </div>
            </div>
          ))}
        </div>
        <div className="mw-czoom__overlay">{children}</div>
      </div>
    </div>
  );
}
