"use client";
import { useEffect, useRef, useState } from "react";

/* Auto-scroll zoom collage — a mosaic of crew photos that scales up, "diving" into
   the lead photo until it fills the frame, then the careers invitation fades in over
   it. The section PINS (sticky over a tall track) and the dive is driven by scroll
   progress; while it's pinned and unfinished it AUTO-ADVANCES (the page eases itself
   forward), so the effect plays on its own — but the user can scroll to push it along
   faster. Once the dive completes the auto-advance stops and the page scrolls normally.

   Rebuilt the repo way: NO framer-motion / lenis / tailwind. One rAF loop reads the
   section's scroll progress over a FIXED dive distance (--dive-vh viewport-heights),
   writes the per-photo scale (--s) and overlay reveal (--reveal), and nudges the
   scroll forward each frame while pinned. prefers-reduced-motion skips it (finished
   frame, no auto-scroll).

   IMAGE QUALITY: the CENTRE photo (index 0, the one that fills the frame at the
   landing) is laid out at its FINAL size (100vw×100vh) and scaled DOWN (0.25→1)
   instead of a small 25vw bitmap being scaled UP — so the landing photo rasterizes
   at full resolution and stays crisp. Its max layer is one viewport, so this adds
   no giant compositor layers. The off-centre photos sweep off-frame during the
   dive, so they keep the lightweight scale-up. */

// Per-photo zoom factor. Index 0 (centre) hits 4 → fills; the rest run larger so
// they sweep past. CAP is how large each frame is LAID OUT relative to its mosaic box
// (then scaled down) — laying out large keeps it crisp instead of upscaling a small
// bitmap. Centre = its full zoom (4) so it's crisp at full size; the others are capped
// at 3× to stay crisp the whole time they're on screen while keeping layers bounded
// (they only mildly upscale near the very end, by which point they've swept off-frame).
const ZOOM = [4, 5, 6, 5, 6, 8, 9];
const CAP = [4, 3, 3, 3, 3, 3, 3];
// The overlay (scrim) + copy fade/slide in across this window of the progress — they
// begin partway through and reach full opacity only when the dive completes (pd 1),
// i.e. when the centre photo reaches full size.
const REVEAL_START = 0.70;
const REVEAL_END = 1.0;
const DIVE_MS = 2600; // base auto-advance pace (start speed); it accelerates to 2× by the end

export function ZoomCollage01({ photos = [], children, autoScroll = true }) {
  const rootRef = useRef(null);
  const cellRefs = useRef([]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;

    // The dive plays over a FIXED scroll distance (--dive-vh viewport-heights); extra
    // track beyond it is a short freeze where the finished frame holds.
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
        const cap = CAP[i % CAP.length];
        // Frame is laid out at cap× its mosaic box; scaling the cell by (1/cap)(1+pd(z-1))
        // gives the same on-screen size/position as before (mosaic box at pd 0 → box×z at
        // pd 1), but rasterized from the larger layout → crisp instead of upscaled.
        const s = (1 / cap) * (1 + pd * (z - 1));
        el.style.setProperty("--s", s.toFixed(4));
      }
      const reveal = Math.min(1, Math.max(0, (pd - REVEAL_START) / (REVEAL_END - REVEAL_START)));
      root.style.setProperty("--reveal", reveal.toFixed(3));
      if (reveal > 0.5) root.setAttribute("data-shown", "1");
      else root.removeAttribute("data-shown");
    };

    let running = false;
    let lastTs = 0;
    let lastY = 0;
    let cancelled = false; // user scrolled up mid-run → auto-scroll killed until it unpins
    let lastUserTs = -1e9; // last time the user actively scrolled (wheel/touch)
    const USER_IDLE_MS = 160; // pause auto-advance for this long after user scroll input
    // The user drives the scroll; our auto-nudge must not fight it. While the user is
    // actively scrolling we PAUSE the nudge so their (smooth) scroll registers fully —
    // an instant programmatic scroll would otherwise cancel their in-flight scroll and
    // "eat" the input. The nudge resumes once they're idle.
    const onUserScroll = (e) => { lastUserTs = e.timeStamp; };

    const loop = (ts) => {
      raf = requestAnimationFrame(loop);
      const dt = lastTs ? Math.min(50, ts - lastTs) : 16.7; // clamp big gaps (tab switches)
      lastTs = ts;
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight || 1;
      const diveDist = (diveVh / 100) * vh;
      // Progress is tied to scroll position (scrubbed) — scrolling up reverses it.
      const pd = diveDist > 0 ? Math.min(1, Math.max(0, -rect.top / diveDist)) : 0;
      apply(pd);
      if (autoScroll) {
        const y = window.scrollY;
        const pinned = rect.top <= 0 && rect.bottom > vh;
        const userActive = ts - lastUserTs < USER_IDLE_MS;
        // Re-arm once the section UNPINS on the way back up (its top drops below the
        // viewport top) — i.e. the user scrolled up past the pin point.
        if (rect.top > 0) cancelled = false;
        // If the user scrolls UP while pinned, kill the auto-scroll entirely. It stays
        // cancelled (the section is now plain scroll-scrubbed) until it unpins.
        if (!cancelled && pinned && pd < 1 && y < lastY - 1) cancelled = true;
        // Auto-advance only while pinned, unfinished, not cancelled, AND the user isn't
        // mid-scroll (so their scroll-to-speed-up isn't cancelled by our nudge).
        // The pace ACCELERATES across the dive: it begins slow (≈0.66× base) and ends at
        // ≈1.33× — i.e. the finish is twice the starting speed. behavior:"instant" bypasses
        // the page's scroll-behavior:smooth.
        if (pinned && pd < 1 && !cancelled && !userActive) {
          const v = (diveDist / DIVE_MS) * 0.924 * (1 + 3 * pd); // 40% faster overall (start 0.92× → end 3.7×)
          window.scrollBy({ top: v * dt, behavior: "instant" });
        }
        lastY = window.scrollY;
      }
    };

    const start = () => {
      if (running) return;
      running = true; lastTs = 0; lastY = window.scrollY;
      readVars();
      if (autoScroll) {
        window.addEventListener("wheel", onUserScroll, { passive: true });
        window.addEventListener("touchmove", onUserScroll, { passive: true });
      }
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      if (autoScroll) {
        window.removeEventListener("wheel", onUserScroll);
        window.removeEventListener("touchmove", onUserScroll);
      }
      cancelAnimationFrame(raf); raf = 0;
    };

    if (mq.matches) {
      setReduced(true);
      apply(1); // reduced motion: finished frame, no auto-scroll
      return;
    }

    // Run the loop only while the section is in view (re-arming is handled in the loop
    // when the section unpins on the way back up).
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) start(); else stop(); },
      { threshold: 0 },
    );
    io.observe(root);
    window.addEventListener("resize", readVars, { passive: true });
    apply(0);
    return () => { io.disconnect(); stop(); window.removeEventListener("resize", readVars); };
  }, [autoScroll]);

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
