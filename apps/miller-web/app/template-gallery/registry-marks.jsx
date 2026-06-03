// 01_marks gallery entries. Item entries: each has a render(config, surface) thunk
// and a `canvas` descriptor (surface light/dark/both). Marks are tiny typographic
// atoms, so they're shown inside heading-size text or a sentence for context.

import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { StopPeriod01 } from "@/components-v2/01_marks/stops/stop-period-01";
import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
import { Nobr01 } from "@/components-v2/01_marks/text/nobr-01";
import { NumToken01 } from "@/components-v2/01_marks/text/num-token-01";

const off = (label = "Off") => ({ label, value: {} });

export const MARKS = [
  {
    group: "Eyebrows",
    name: "Eyebrow01",
    path: "components-v2/01_marks/eyebrows/eyebrow-01.jsx",
    canvas: { surface: "both" },
    controls: [{ key: "invert", label: "invert", options: [off(), { label: "On", value: { invert: true } }] }],
    render: (cfg) => <Eyebrow01 label="Section label" invert={!!cfg.invert} />,
  },
  {
    group: "Stops",
    name: "StopPeriod01",
    path: "components-v2/01_marks/stops/stop-period-01.jsx",
    canvas: { surface: "light", note: "Em-sized — shown inside heading-size text." },
    controls: [{ key: "variant", label: "Variant", options: [{ label: "Title", value: { variant: "title" } }, { label: "Hero", value: { variant: "hero" } }, { label: "Colon", value: { variant: "colon" } }] }],
    render: (cfg) => (
      <span className="tg-demo-h">Heading word<StopPeriod01 variant={cfg.variant || "title"} /></span>
    ),
  },
  {
    group: "Stops",
    name: "StopText01",
    path: "components-v2/01_marks/stops/stop-text-01.jsx",
    canvas: { surface: "light", note: "Glues the stop to the last word so it never wraps alone." },
    controls: [{ key: "stopClassName", label: "Stop size", options: [{ label: "Title", value: { stopClassName: "mw-stop" } }, { label: "Hero", value: { stopClassName: "mw-hero__stop" } }] }],
    render: (cfg) => (
      <h2 className="tg-demo-h"><StopText01 stopClassName={cfg.stopClassName || "mw-stop"}>This is a placeholder heading</StopText01></h2>
    ),
  },
  {
    group: "Arrows",
    name: "ActionArrow01",
    path: "components-v2/01_marks/arrows/action-arrow-01.jsx",
    canvas: { surface: "both", note: "Inherits the surrounding text colour and size." },
    controls: [],
    render: () => <span className="tg-demo-t">Learn more <ActionArrow01 /></span>,
  },
  {
    group: "Text",
    name: "Nobr01",
    path: "components-v2/01_marks/text/nobr-01.jsx",
    canvas: { surface: "light", note: "Keeps its children on one line — shown in a narrow column." },
    controls: [],
    render: () => (
      <p className="tg-demo-t" style={{ maxWidth: "11ch" }}>Call <Nobr01>555&nbsp;0100</Nobr01> any time of day</p>
    ),
  },
  {
    group: "Text",
    name: "NumToken01",
    path: "components-v2/01_marks/text/num-token-01.jsx",
    canvas: { surface: "light", note: "Zero-pads to two digits." },
    controls: [{ key: "n", label: "n", options: [{ label: "3 → 03", value: { n: 3 } }, { label: "12", value: { n: 12 } }, { label: "7 → 07", value: { n: 7 } }] }],
    render: (cfg) => <span className="tg-demo-num"><NumToken01 n={cfg.n ?? 3} /></span>,
  },
];
