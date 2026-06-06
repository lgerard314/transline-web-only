"use client";
import { useEffect, useRef } from "react";

// Count-up numeral for the lifetime reel. Ref-based (writes node.textContent — no
// per-frame React re-render), with two modes:
//
//   • CONTROLLED (scroll-scrubbed): pass a numeric `progress` (0..1). The live
//     numeral reflects it directly — empty until it starts, counting up linearly
//     as the scroll wipe crosses this diamond, final at 1 — and it reverses when
//     `progress` falls (scrolling back up). No internal timeline; the reel owns the
//     pacing via scroll position.
//   • AUTONOMOUS (self-timed): no `progress` prop → the original behavior — an
//     easeOutCubic rAF that starts when the element is BOTH in view and `play` is
//     true, firing onStart/onComplete. Kept for any non-scrubbed caller.
//
// The final value is rendered once as an invisible SIZER so the live numeral never
// reflows its frame. Animating digits are aria-hidden; an sr-only span carries the
// final value so screen readers announce it once. prefers-reduced-motion: in
// autonomous mode the final value shows immediately; in controlled mode the reel
// pins progress to 1, so the final value shows with no scrubbing.
//
// onStart/onComplete are held in refs so the effect does not depend on their
// identity — a parent re-render must never restart the count.
export function LrCountUp({ value, suffix = "", duration = 1600, play = true, progress, onStart, onComplete, className }) {
  const controlled = typeof progress === "number";
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

  // CONTROLLED mode: reflect the externally supplied 0..1 progress.
  useEffect(() => {
    if (!controlled) return;
    const node = liveRef.current;
    if (!node) return;
    const p = Math.min(1, Math.max(0, progress));
    const v = Math.round(p * value);
    // Empty until the count rounds to a real digit, so the diamond can begin drawing
    // (border/label) without flashing a "0" while the frontier first touches it.
    node.textContent = p >= 1 ? finalText : v >= 1 ? fmt(v) + suffix : "";
  }, [controlled, progress, value, suffix, finalText]);

  // AUTONOMOUS mode: self-timed count, gated on in-view + play.
  useEffect(() => {
    if (controlled) return;
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
    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
    const r = node.getBoundingClientRect();
    if (vh && r.height && r.top < vh - r.height * 0.4 && r.bottom > r.height * 0.4) {
      inViewRef.current = true;
      begin();
    }
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (!doneRef.current) startedRef.current = false;
      beginRef.current = null;
    };
  }, [controlled, value, suffix, duration, finalText]);

  // When play flips on (autonomous mode), start if in view.
  useEffect(() => { if (controlled) return; playRef.current = play; if (play && beginRef.current) beginRef.current(); }, [controlled, play]);

  return (
    <span className={`mw-lr-cu ${className || ""}`}>
      <span className="mw-lr-cu__sizer" aria-hidden="true">{finalText}</span>
      <span className="mw-lr-cu__live" ref={liveRef} aria-hidden="true" />
      <span className="tl-sr-only">{finalText}</span>
    </span>
  );
}
