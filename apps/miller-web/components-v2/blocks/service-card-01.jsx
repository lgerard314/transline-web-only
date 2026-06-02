import Link from "next/link";
import { NumToken01 } from "@/components-v2/items/num-token-01";
import { splitTitle } from "@/components-v2/sections/services-01/service-order";

export function ServiceCard01({ service, n }) {
  const { line1, line2 } = splitTitle(service.title);
  return (
    <Link href={`/industrial-services/${service.slug}/`} className="mw-svcs-card">
      <span className="mw-svcs-card__photo" style={{ backgroundImage: `url(${service.photo})` }} aria-hidden="true" />
      <div className="mw-svcs-card__body">
        <NumToken01 n={n} className="mw-svcs-card__num" />
        <div className="mw-svcs-card__title-row">
          <h3 className="mw-svcs-card__title">{line1}{line2 && (<><br />{line2}</>)}</h3>
          <span className="mw-svcs-card__arr" aria-hidden="true">→</span>
        </div>
        <p className="mw-svcs-card__text">{service.summary}</p>
      </div>
    </Link>
  );
}
