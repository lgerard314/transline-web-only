// Service teaser card. Wraps a Next link so the whole card is clickable.
import Link from "next/link";

export function ServiceCard({ num, title, body, icon, href = "/services" }) {
  return (
    <Link href={href} className="tl-svccard">
      <div className="tl-svccard__icon" aria-hidden="true">{icon}</div>
      <div className="tl-svccard__num">{num}</div>
      <h3 className="tl-svccard__title">{title}</h3>
      <p className="tl-svccard__body">{body}</p>
      <span className="tl-svccard__more">
        Learn more <span className="arr" aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
