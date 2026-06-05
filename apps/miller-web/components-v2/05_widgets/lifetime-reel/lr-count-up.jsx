"use client";
import { useEffect, useRef } from "react";

// Count-up numeral for the lifetime reel. Ref-based (writes node.textContent — no
// per-frame React re-render), rAF easeOutCubic. The final value is rendered once
// as an invisible SIZER so the live numeral never reflows its frame. Animating
// digits are aria-hidden; an sr-only span carries the final value so screen
// readers announce it once. prefers-reduced-motion shows the final value
// immediately.
//
// The count starts only when the element is BOTH in view (IntersectionObserver)
// AND `play` is true — so the reel can hold a mounted diamond dark until its turn
// in the sequence, then start it exactly on cue. Until it starts, the live span
// is empty (nothing shows). onStart fires the instant counting begins (used to
// draw the seal in lockstep); onComplete fires once when it settles.
//
// onStart/onComplete are held in refs so the effect does not depend on their
// identity — a parent re-render must never restart the count.
export function LrCountUp({ value, suffix = "", duration = 1600, play = true, onStart, onComplete, className }) {
  const liveRef = useRef(null);
  const doneRef = useRef(false);
  const startedRef = useRef(false);
  const inViewRef = useRef(false);
  const beginRef = useRef(null);
  const playRef = useRef(play);
  const onStartRef = useRef(onStart);
  const onCompleteRef = useRef(onComplete);
  onStartRef.current = onStart;
  onCompleteRef.current = onComplete;
  const fmt = (n) => n.toLocaleString("en-US");
  const finalText = fmt(value) + suffix;

  useEffect(() => {
    const node = liveRef.current;
    if (!node) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let startTs = 0;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const finish = () => {
      node.textContent = finalText;
      if (!doneRef.current) { doneRef.current = true; onCompleteRef.current && onCompleteRef.current(); }
    };
    const step = (ts) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      node.textContent = fmt(Math.round(ease(p) * value)) + suffix;
      if (p < 1) raf = requestAnimationFrame(step); else finish();
    };
    const begin = () => {
      if (startedRef.current || !inViewRef.current || !playRef.current) return;
      startedRef.current = true;
      onStartRef.current && onStartRef.current();
      if (mq.matches) { finish(); return; }
      raf = requestAnimationFrame(step);
    };
    beginRef.current = begin;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { io.unobserve(e.target); inViewRef.current = true; begin(); }
      }
    }, { threshold: 0.4 });
    io.observe(node);
    // Fallback: the observer's async initial callback can be missed when the
    // element is already on screen at mount — notably after a Fast-Refresh
    // remount while the reel is in view, which otherwise leaves the count stuck
    // at 0 forever (no scroll event to re-fire the observer). If a meaningful
    // slice of the numeral is already visible, start synchronously. begin() is
    // idempotent, so this never double-starts alongside the observer.
    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
    const r = node.getBoundingClientRect();
    if (vh && r.height && r.top < vh - r.height * 0.4 && r.bottom > r.height * 0.4) {
      inViewRef.current = true;
      begin();
    }
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      // If this effect is torn down before the count finished (StrictMode's
      // double-invoke, a deps re-run, or a Fast-Refresh remount), allow the next
      // run to restart — otherwise startedRef stays true, begin() bails, and the
      // numeral freezes at whatever value it had reached.
      if (!doneRef.current) startedRef.current = false;
      beginRef.current = null;
    };
  }, [value, suffix, duration, finalText]);

  // When play flips on (the reel reaches this diamond's turn), start if in view.
  useEffect(() => { playRef.current = play; if (play && beginRef.current) beginRef.current(); }, [play]);

  return (
    <span className={`mw-lr-cu ${className || ""}`}>
      <span className="mw-lr-cu__sizer" aria-hidden="true">{finalText}</span>
      <span className="mw-lr-cu__live" ref={liveRef} aria-hidden="true" />
      <span className="tl-sr-only">{finalText}</span>
    </span>
  );
}
