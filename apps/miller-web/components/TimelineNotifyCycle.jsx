"use client";

import { useEffect, useRef, useState } from "react";

const LOGO = "/miller/logo/miller-logomark.webp";
const ANIM_MS = 500;

// Cycles iOS-style notification banners for the emergency-response timeline.
// Shows one banner initially, then stacks up to two (newest at bottom).
// Pauses on prefers-reduced-motion — first notification stays visible.
export function TimelineNotifyCycle({ notifications, interval = 4200 }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState(null);
  const prevIndexRef = useRef(0);

  useEffect(() => {
    if (!notifications || notifications.length <= 1) return;
    const mql = typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    if (mql && mql.matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % notifications.length), interval);
    return () => clearInterval(id);
  }, [notifications, interval]);

  useEffect(() => {
    if (!notifications || notifications.length <= 1) return;

    const mql = typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    if (mql && mql.matches) return;

    const prev = prevIndexRef.current;
    if (prev === index) return;
    prevIndexRef.current = index;

    if (index === 0 && prev > 0) {
      setPhase({ kind: "reset", prevIndex: prev });
    } else if (prev === 0 && index === 1) {
      setPhase({ kind: "stack" });
    } else if (index > 0 && prev > 0) {
      setPhase({
        kind: "cycle",
        exitIdx: prev - 1,
        shiftIdx: prev,
        enterIdx: index,
      });
    } else {
      setPhase(null);
      return;
    }

    const id = setTimeout(() => setPhase(null), ANIM_MS);
    return () => clearTimeout(id);
  }, [index, notifications]);

  if (!notifications || notifications.length === 0) return null;

  const visible = buildVisibleBanners(index, phase, notifications);
  const stacked = index > 0 || phase?.kind === "stack" || phase?.kind === "cycle";
  const animating = Boolean(phase);
  const current = notifications[index];

  return (
    <div
      className={[
        "mw-svc-tl-notify",
        stacked ? "mw-svc-tl-notify--stacked" : "",
        phase?.kind === "reset" ? "mw-svc-tl-notify--reset" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-reveal
    >
      <div
        className={[
          "mw-svc-tl-notify__stage",
          animating ? "mw-svc-tl-notify__stage--animating" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
      >
        {visible.map((item) => (
          <div
            key={`${item.idx}-${item.role}`}
            className={[
              "mw-svc-tl-notify__banner",
              bannerClassForRole(item.role),
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <img className="mw-svc-tl-notify__icon" src={LOGO} alt="" />
            <div className="mw-svc-tl-notify__copy">
              <p className="mw-svc-tl-notify__title">{item.title}</p>
              <p className="mw-svc-tl-notify__body">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
      <span className="tl-sr-only" aria-live="polite" aria-atomic="true">
        {`${current.title}. ${current.body}`}
      </span>
    </div>
  );
}

function buildVisibleBanners(index, phase, notifications) {
  if (!phase) {
    if (index === 0) {
      return [{ idx: 0, ...notifications[0], role: "solo" }];
    }
    return [
      { idx: index - 1, ...notifications[index - 1], role: "older" },
      { idx: index, ...notifications[index], role: "current" },
    ];
  }

  switch (phase.kind) {
    case "stack":
      return [
        { idx: 0, ...notifications[0], role: "make-room" },
        { idx: 1, ...notifications[1], role: "enter" },
      ];
    case "cycle":
      return [
        { idx: phase.exitIdx, ...notifications[phase.exitIdx], role: "exit" },
        { idx: phase.shiftIdx, ...notifications[phase.shiftIdx], role: "shift-up" },
        { idx: phase.enterIdx, ...notifications[phase.enterIdx], role: "enter" },
      ];
    case "reset": {
      const p = phase.prevIndex;
      return [
        { idx: p - 1, ...notifications[p - 1], role: "exit" },
        { idx: p, ...notifications[p], role: "exit-second" },
        { idx: 0, ...notifications[0], role: "enter" },
      ];
    }
    default:
      return [];
  }
}

function bannerClassForRole(role) {
  switch (role) {
    case "solo":
      return "mw-svc-tl-notify__banner--solo";
    case "older":
      return "mw-svc-tl-notify__banner--older";
    case "make-room":
      return "mw-svc-tl-notify__banner--make-room";
    case "exit":
      return "mw-svc-tl-notify__banner--exit";
    case "exit-second":
      return "mw-svc-tl-notify__banner--exit mw-svc-tl-notify__banner--exit-second";
    case "shift-up":
      return "mw-svc-tl-notify__banner--shift-up";
    case "enter":
      return "mw-svc-tl-notify__banner--enter";
    default:
      return "";
  }
}
