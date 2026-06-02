import Link from "next/link";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";

export function NoteCard01({ tag, title, text, cta }) {
  return (
    <article className="mw-careers__card">
      <span className="mw-careers__card-tag">{tag}</span>
      <h3 className="mw-careers__card-title">{title}</h3>
      <p className="mw-careers__card-text">{text}</p>
      <Link href={cta.href} className="mw-careers__card-link">
        {cta.label} <ActionArrow01 />
      </Link>
    </article>
  );
}
