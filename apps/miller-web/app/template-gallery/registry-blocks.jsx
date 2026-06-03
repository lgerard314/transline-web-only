// 04_blocks gallery entries. List-item blocks are wrapped in the correct
// <dl>/<ol> so the DOM is valid and the grid/spine CSS applies.

import { FigureStat01 } from "@/components-v2/04_blocks/stats/figure-stat-01";
import { PlateStat01 } from "@/components-v2/04_blocks/stats/plate-stat-01";
import { CapItem01 } from "@/components-v2/04_blocks/stats/cap-item-01";
import { MilestoneItem01 } from "@/components-v2/04_blocks/list-items/milestone-item-01";
import { HeadIntro01 } from "@/components-v2/04_blocks/heads/head-intro-01";
import { MissionBlock01 } from "@/components-v2/04_blocks/prose/mission-block-01";

export const BLOCKS = [
  {
    group: "Stats",
    name: "FigureStat01",
    path: "components-v2/04_blocks/stats/figure-stat-01.jsx",
    canvas: { surface: "light" },
    controls: [],
    render: () => (
      <dl className="mw-fac2__figs" style={{ margin: 0 }}>
        <FigureStat01 label="Capacity" num="120" unit="units / shift" />
      </dl>
    ),
  },
  {
    group: "Stats",
    name: "PlateStat01",
    path: "components-v2/04_blocks/stats/plate-stat-01.jsx",
    canvas: { surface: "light", note: "Value-over-label; lives over the trailer plate image in production." },
    controls: [],
    render: () => <PlateStat01 num="98%" unit="rate" label="Sample metric" />,
  },
  {
    group: "List items",
    name: "CapItem01",
    path: "components-v2/04_blocks/stats/cap-item-01.jsx",
    canvas: { surface: "light" },
    controls: [],
    render: () => (
      <ol className="mw-fac2__caps-grid" style={{ margin: 0, width: "min(420px, 100%)" }} aria-label="Sample capabilities">
        <CapItem01 n={1} name="Placeholder capability" />
        <CapItem01 n={2} name="Another capability" />
        <CapItem01 n={3} name="Third capability" />
      </ol>
    ),
  },
  {
    group: "List items",
    name: "MilestoneItem01",
    path: "components-v2/04_blocks/list-items/milestone-item-01.jsx",
    canvas: { surface: "light", note: "Alternating left/right rail items — hover to expand." },
    controls: [],
    render: () => (
      <ol className="mw-ten3__milestones" style={{ margin: "0 auto", padding: 0, listStyle: "none", width: "min(680px, 100%)" }}>
        <MilestoneItem01 item={{ year: "1996", title: "Founding milestone", body: "Placeholder description of the first milestone in the timeline." }} side="left" />
        <MilestoneItem01 item={{ year: "2007", title: "Expansion milestone", body: "Placeholder description of a later expansion milestone." }} side="right" active />
      </ol>
    ),
  },
  {
    group: "Heads & prose",
    name: "HeadIntro01",
    path: "components-v2/04_blocks/heads/head-intro-01.jsx",
    canvas: { surface: "light" },
    controls: [],
    render: () => (
      <div style={{ maxWidth: 760, width: "100%" }}>
        <HeadIntro01 eyebrow="Section eyebrow" headingId="tg-headintro-demo" title={<>Placeholder heading<br /><span>second line</span></>} intro="A short placeholder intro paragraph that describes this section in one or two sentences." />
      </div>
    ),
  },
  {
    group: "Heads & prose",
    name: "MissionBlock01",
    path: "components-v2/04_blocks/prose/mission-block-01.jsx",
    canvas: { surface: "light" },
    controls: [],
    render: () => (
      <div style={{ maxWidth: 560, width: "100%" }}>
        <MissionBlock01 heading="Our mission" paragraphs={["First placeholder paragraph describing the mission in a sentence or two.", "Second placeholder paragraph adding supporting detail."]} cta={{ href: "#", label: "Learn more" }} />
      </div>
    ),
  },
];
