"use client";
// Single source of truth for tweak values. setTweak persists via postMessage
// to a host (e.g., the deck-stage edit-mode shell) when present; in plain
// browsers the message just goes nowhere and the React state updates locally.
//
// setTweak accepts either setTweak('key', value) OR setTweak({ k1: v, k2: v })
// so a useState-style call doesn't write "[object Object]" into the persisted
// EDITMODE block.
import { useCallback, useState } from "react";

export function useTweaks(defaults) {
  const [values, setValues] = useState(defaults);
  const setTweak = useCallback((keyOrEdits, val) => {
    const edits =
      typeof keyOrEdits === "object" && keyOrEdits !== null
        ? keyOrEdits
        : { [keyOrEdits]: val };
    setValues((prev) => ({ ...prev, ...edits }));
    if (typeof window !== "undefined") {
      try {
        window.parent?.postMessage({ type: "__edit_mode_set_keys", edits }, "*");
      } catch {}
      window.dispatchEvent(new CustomEvent("tweakchange", { detail: edits }));
    }
  }, []);
  return [values, setTweak];
}
