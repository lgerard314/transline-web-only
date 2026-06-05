import Link from "next/link";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";

// Diamond card — a rotated-square seal used for the careers callouts. Default
// face shows the title; on hover/focus the diamond fill darkens, the face
// hides, and the body copy + "learn more" surface (the body may overflow the
// diamond's bounds). The seal OUTLINE is not drawn here — the parent
// CareersDiamonds01 draws all borders + the connecting line as one animated
// chain. The whole diamond is the link. CSS: 04-home.css (.mw-cdia*).
export function DiamondCard01({ tag, title, text, cta }) {
  return (
    <Link href={cta.href} className="mw-cdia" aria-label={`${title} — ${cta.label}`}>
      <span className="mw-cdia__fill" aria-hidden="true" />
      <span className="mw-cdia__face" aria-hidden="true">
        <span className="mw-cdia__title">{title}</span>
      </span>
      <span className="mw-cdia__reveal">
        <span className="mw-cdia__text">{text}</span>
        <span className="mw-cdia__more">{cta.label} <ActionArrow01 /></span>
      </span>
    </Link>
  );
}
