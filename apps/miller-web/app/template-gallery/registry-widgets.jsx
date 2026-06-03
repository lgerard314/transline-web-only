// 05_widgets gallery entries. Interactive client widgets — several auto-animate
// (cycles, marquee) or respond to hover/focus (galleries, timeline).

import { PhraseCycle01 } from "@/components-v2/05_widgets/cycles/phrase-cycle-01";
import { StatCycle01 } from "@/components-v2/05_widgets/cycles/stat-cycle-01";
import { SectorStatCycle } from "@/components-v2/05_widgets/cycles/sector-stat-cycle";
import { ThumbGallery01 } from "@/components-v2/05_widgets/galleries/thumb-gallery-01";
import { HoverCard01 } from "@/components-v2/05_widgets/galleries/hover-card-01";
import { VerticalTimeline01 } from "@/components-v2/05_widgets/timelines/vertical-timeline-01";
import { MarqueeBand01 } from "@/components-v2/05_widgets/marquees/marquee-band-01";

const STATS = [
  { label: "Active clients", value: "450+", text: "Placeholder stat description for the first rotating figure." },
  { label: "Total volume", value: "49M+", unit: "tons", text: "Placeholder stat description for the second rotating figure." },
  { label: "Recovered", value: "40M+", unit: "tons", text: "Placeholder stat description for the third rotating figure." },
];

export const WIDGETS = [
  {
    group: "Cycles",
    name: "PhraseCycle01",
    path: "components-v2/05_widgets/cycles/phrase-cycle-01.jsx",
    canvas: { surface: "dark", note: "Auto-cycles through phrases — shown inside a hero-size heading." },
    controls: [],
    render: () => (
      <h2 className="tg-demo-h" style={{ maxWidth: 760 }}>
        leaders in <PhraseCycle01 phrases={[{ text: "reliable" }, { text: "scalable", tone: "accent" }, { text: "trusted", tone: "accent" }]} />
      </h2>
    ),
  },
  {
    group: "Cycles",
    name: "StatCycle01",
    path: "components-v2/05_widgets/cycles/stat-cycle-01.jsx",
    canvas: { surface: "light", note: "Auto-cycles through stats." },
    controls: [],
    render: () => <div style={{ width: "min(400px, 100%)" }}><StatCycle01 stats={STATS} /></div>,
  },
  {
    group: "Cycles",
    name: "SectorStatCycle",
    path: "components-v2/05_widgets/cycles/sector-stat-cycle.jsx",
    canvas: { surface: "light", note: "Auto-cycles (the WhyBand stat variant)." },
    controls: [],
    render: () => <div style={{ width: "min(400px, 100%)" }}><SectorStatCycle stats={STATS} /></div>,
  },
  {
    group: "Galleries",
    name: "ThumbGallery01",
    path: "components-v2/05_widgets/galleries/thumb-gallery-01.jsx",
    canvas: { surface: "light", note: "Click a thumbnail to swap the main photo." },
    controls: [],
    render: () => (
      <div style={{ width: "min(560px, 100%)" }}>
        <ThumbGallery01 photos={[
          { src: "/miller/facility/vbec-drone-overview.png", alt: "Drone overview", caption: "Aerial drone overview" },
          { src: "/miller/facility/vbec-office-front.png", alt: "Office front", caption: "Office front entrance" },
          { src: "/miller/facility/vbec-stone-sign.png", alt: "Stone sign", caption: "Entrance stone sign" },
        ]} />
      </div>
    ),
  },
  {
    group: "Galleries",
    name: "HoverCard01",
    path: "components-v2/05_widgets/galleries/hover-card-01.jsx",
    canvas: { surface: "light", note: "Hover or focus a row to swap the background photo." },
    controls: [],
    render: () => (
      <div style={{ width: "min(360px, 100%)" }}>
        <HoverCard01 title="Sectors we serve" items={[
          { slug: "industrial-manufacturing", name: "Industrial Manufacturing" },
          { slug: "mining", name: "Mining" },
          { slug: "oil-and-gas", name: "Oil & Gas" },
          { slug: "agriculture", name: "Agriculture" },
          { slug: "households", name: "Households" },
        ]} />
      </div>
    ),
  },
  {
    group: "Timeline",
    name: "VerticalTimeline01",
    path: "components-v2/05_widgets/timelines/vertical-timeline-01.jsx",
    canvas: { surface: "light", note: "Hover or focus a milestone to expand it." },
    controls: [],
    render: () => (
      <div style={{ width: "min(680px, 100%)" }}>
        <VerticalTimeline01 items={[
          { year: "1996", title: "Founding milestone", body: "Placeholder description of the first milestone in the timeline." },
          { year: "2007", title: "Expansion milestone", body: "Placeholder description of a later expansion milestone." },
          { year: "2019 — 2022", title: "Capacity milestone", body: "Placeholder description of a capacity-related milestone." },
          { year: "2025", title: "Recent milestone", body: "Placeholder description of the most recent milestone." },
        ]} />
      </div>
    ),
  },
  {
    group: "Marquee",
    name: "MarqueeBand01",
    path: "components-v2/05_widgets/marquees/marquee-band-01.jsx",
    canvas: { surface: "both", note: "Auto-scrolls; dark adds the logo legibility chips." },
    controls: [],
    render: (_cfg, surf) => (
      <div className="mw-marquee" data-scheme={surf === "dark" ? "dark" : undefined} style={{ width: "100%" }}>
        <MarqueeBand01 label={["Proud", "partners"]} items={[
          { name: "Partner One", src: "/miller/affiliations/meia.png" },
          { name: "Partner Two", src: "/miller/affiliations/cme.png" },
          { name: "Partner Three", src: "/miller/affiliations/owma.png" },
        ]} />
      </div>
    ),
  },
];
