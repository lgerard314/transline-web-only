"use client";
import { useState } from "react";
import { MilestoneItem01 } from "@/components-v2/blocks/milestone-item-01";

export function TimelineVertical01({ items }) {
  const [activeIndex, setActiveIndex] = useState(null);
  return (
    <ol className="mw-ten3__milestones">
      {items.map((item, i) => (
        <MilestoneItem01
          key={i}
          item={item}
          side={i % 2 === 0 ? "left" : "right"}
          active={i === activeIndex}
          onActivate={() => setActiveIndex(i)}
        />
      ))}
    </ol>
  );
}
