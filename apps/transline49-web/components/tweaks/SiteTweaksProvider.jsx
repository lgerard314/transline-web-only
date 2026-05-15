"use client";
// Applies the site's design tweaks (palette / typography / density) to
// <html> data-* attributes. CSS variables in globals.css respond to those
// attributes, so a tweak flips the whole site without re-render.
//
// Renders the TweaksPanel at the document level. The panel stays closed
// unless the URL has ?tweaks=1 or a host posts __activate_edit_mode, so
// regular visitors never see it.
import { useEffect } from "react";
import { useTweaks } from "./useTweaks";
import { TweaksPanel } from "./TweaksPanel";
import { TweakSection, TweakRadio, TweakSelect } from "./controls";

const TWEAK_DEFAULTS = {
  palette: "clay",
  typePairing: "utility",
  density: "regular",
};

const PALETTES = [
  { value: "clay",     label: "Clay" },
  { value: "midnight", label: "Midnight" },
  { value: "ironwood", label: "Ironwood" },
  { value: "deep",     label: "Deep Water" },
  { value: "forest",   label: "Forest" },
];

const TYPE_PAIRINGS = [
  { value: "utility",   label: "Utility (Geist + Geist Mono)" },
  { value: "editorial", label: "Editorial (Newsreader + Geist)" },
  { value: "grotesk",   label: "Grotesk (Funnel + Manrope)" },
];

export function SiteTweaksProvider() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.setAttribute("data-palette", t.palette);
    document.documentElement.setAttribute("data-type", t.typePairing);
    document.documentElement.setAttribute("data-density", t.density);
  }, [t.palette, t.typePairing, t.density]);

  return (
    <TweaksPanel title="Site Tweaks">
      <TweakSection label="Color palette">
        <TweakSelect
          label="Palette"
          value={t.palette}
          options={PALETTES}
          onChange={(v) => setTweak("palette", v)}
        />
      </TweakSection>

      <TweakSection label="Typography">
        <TweakSelect
          label="Pairing"
          value={t.typePairing}
          options={TYPE_PAIRINGS}
          onChange={(v) => setTweak("typePairing", v)}
        />
      </TweakSection>

      <TweakSection label="Density">
        <TweakRadio
          label="Spacing"
          value={t.density}
          options={["compact", "regular", "spacious"]}
          onChange={(v) => setTweak("density", v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}
