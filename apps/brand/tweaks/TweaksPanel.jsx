"use client";
// Floating glass shell for design-time tweaks. Stays closed by default —
// it only opens when an external host posts `__activate_edit_mode`, or
// when the URL contains `?tweaks=1`. In production browsers without either
// signal it stays mounted but invisible.
import { useCallback, useEffect, useRef, useState } from "react";
import { TWEAKS_STYLE } from "./styles";

const PAD = 16;

export function TweaksPanel({ title = "Tweaks", children }) {
  const [open, setOpen] = useState(false);
  // Drag position in state (not ref) so panel re-renders on move. Re-renders
  // during drag are cheap — the panel is small — and using state keeps the
  // component compliant with React 19's no-refs-during-render rule.
  const [offset, setOffset] = useState({ x: PAD, y: PAD });
  const dragRef = useRef(null);

  const clampToViewport = useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth;
    const h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    setOffset((o) => ({
      x: Math.min(maxRight, Math.max(PAD, o.x)),
      y: Math.min(maxBottom, Math.max(PAD, o.y)),
    }));
  }, []);

  // Mount: check URL for ?tweaks=1, subscribe to host edit-mode messages,
  // announce availability to a potential parent shell.
  useEffect(() => {
    const onMsg = (e) => {
      const t = e?.data?.type;
      if (t === "__activate_edit_mode") setOpen(true);
      else if (t === "__deactivate_edit_mode") setOpen(false);
    };
    window.addEventListener("message", onMsg);
    try {
      window.parent?.postMessage({ type: "__edit_mode_available" }, "*");
    } catch {}
    if (new URLSearchParams(window.location.search).get("tweaks") === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
    }
    return () => window.removeEventListener("message", onMsg);
  }, []);

  useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", clampToViewport);
      return () => window.removeEventListener("resize", clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);

  const dismiss = () => {
    setOpen(false);
    try {
      window.parent?.postMessage({ type: "__edit_mode_dismissed" }, "*");
    } catch {}
  };

  const onDragStart = (e) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX;
    const sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev) => {
      const x = startRight - (ev.clientX - sx);
      const y = startBottom - (ev.clientY - sy);
      setOffset({ x, y });
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  if (!open) return null;
  return (
    <>
      <style>{TWEAKS_STYLE}</style>
      <div
        ref={dragRef}
        className="twk-panel"
        data-noncommentable=""
        style={{ right: offset.x, bottom: offset.y }}
      >
        <div className="twk-hd" onMouseDown={onDragStart}>
          <b>{title}</b>
          <button className="twk-x" aria-label="Close tweaks" onMouseDown={(e) => e.stopPropagation()} onClick={dismiss}>
            ✕
          </button>
        </div>
        <div className="twk-body">{children}</div>
      </div>
    </>
  );
}
