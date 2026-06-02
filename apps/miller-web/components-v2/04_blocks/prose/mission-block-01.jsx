import Link from "next/link";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
export function MissionBlock01({ heading = "Mission", paragraphs, cta }) {
  return (
    <div className="mw-ten2__mission" data-reveal>
      <h3 className="mw-ten2__mission-heading">{heading}</h3>
      {paragraphs.map((p, i) => (<p key={i} className="mw-ten2__mission-copy">{p}</p>))}
      <Link href={cta.href} className="mw-ten2__mission-link">{cta.label} <ActionArrow01 /></Link>
    </div>
  );
}
