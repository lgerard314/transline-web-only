import Link from "next/link";
import { NumToken01 } from "@/components-v2/items/num-token-01";

export function ServiceAnchor01({ service }) {
  return (
    <Link href={`/industrial-services/${service.slug}/`} className="mw-svcs-anchor">
      <span className="mw-svcs-anchor__photo" style={{ backgroundImage: `url(${service.photo})` }} aria-hidden="true" />
      <div className="mw-svcs-anchor__body">
        <NumToken01 n={1} className="mw-svcs-anchor__num" />
        <div className="mw-svcs-anchor__title-row">
          <h3 className="mw-svcs-anchor__title">{service.title}</h3>
          <span className="mw-svcs-anchor__arr" aria-hidden="true">→</span>
        </div>
        <p className="mw-svcs-anchor__text">{service.summary}</p>
      </div>
    </Link>
  );
}
