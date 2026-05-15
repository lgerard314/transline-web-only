"use client";
// Single source of truth for tweak values. Persists to `localStorage` under
// the per-app `namespace` key (e.g., "tweaks:tl49", "tweaks:miller") and
// also posts to a host (deck-stage edit-mode shell) when present.
//
// setTweak accepts either setTweak('key', value) OR setTweak({ k1: v, k2: v })
// so a useState-style call doesn't write "[object Object]" into the persisted
// EDITMODE block.
import { useCallback, useState } from "react";

// Read once, on first render. The hook is "use client" so this runs in
// the browser. Returning the merged value as the initial useState means
// React commits the rehydrated state on the first render — no effect,
// no cascading update, and no extra paint.
function readInitial(defaults, namespace) {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(namespace);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return { ...defaults, ...parsed };
    }
  } catch {}
  return defaults;
}

export function useTweaks(defaults, namespace = "tweaks:default") {
  const [values, setValues] = useState(() => readInitial(defaults, namespace));

  const setTweak = useCallback((keyOrEdits, val) => {
    const edits =
      typeof keyOrEdits === "object" && keyOrEdits !== null
        ? keyOrEdits
        : { [keyOrEdits]: val };
    setValues((prev) => {
      const next = { ...prev, ...edits };
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(namespace, JSON.stringify(next));
        } catch {}
      }
      return next;
    });
    if (typeof window !== "undefined") {
      try {
        window.parent?.postMessage({ type: "__edit_mode_set_keys", edits, namespace }, "*");
      } catch {}
      window.dispatchEvent(new CustomEvent("tweakchange", { detail: { edits, namespace } }));
    }
  }, [namespace]);

  return [values, setTweak];
}
