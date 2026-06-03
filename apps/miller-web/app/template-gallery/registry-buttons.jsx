// 02_buttons gallery entries.

import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
import { GhostPhoneCta01 } from "@/components-v2/02_buttons/ghost/ghost-phone-cta-01";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";

const off = (label = "Off") => ({ label, value: {} });

export const BUTTONS = [
  {
    group: "Buttons",
    name: "SolidCta01",
    path: "components-v2/02_buttons/solid/solid-cta-01.jsx",
    canvas: { surface: "both" },
    controls: [
      { key: "arrow", label: "Arrow", options: [{ label: "On", value: { arrow: true } }, { label: "Off", value: { arrow: false } }] },
      { key: "external", label: "external", options: [off(), { label: "On", value: { external: true } }] },
    ],
    render: (cfg) => (
      <SolidCta01 href="#" external={!!cfg.external} ariaLabel="Primary action">
        Primary action{cfg.arrow !== false ? <> <ActionArrow01 /></> : null}
      </SolidCta01>
    ),
  },
  {
    group: "Buttons",
    name: "GhostPhoneCta01",
    path: "components-v2/02_buttons/ghost/ghost-phone-cta-01.jsx",
    canvas: { surface: "dark", note: "Built for dark masthead surfaces (the hero)." },
    controls: [],
    render: () => (
      <GhostPhoneCta01 sup="24/7 hotline" num="1-800-000-0000" href="tel:18000000000" ariaLabel="Call 24/7 hotline: 1-800-000-0000" />
    ),
  },
];
