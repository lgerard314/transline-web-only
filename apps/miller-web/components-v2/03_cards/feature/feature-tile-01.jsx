import Link from "next/link";
import { NumToken01 } from "@/components-v2/01_marks/text/num-token-01";
import { splitTitle } from "@/components-v2/06_sections/grids/bento-grid-order";

// For internal services pass `service` + `n`. For the external cross-border
// tile pass external + href + photo + titleLines ([l1,l2]) + summary + n.
export function FeatureTile01({ service, n, external = false, href, photo, titleLines, summary }) {
  const cls = "mw-svcs-tile" + (external ? " mw-svcs-tile--external" : "");
  const inner = (
    <>
      <span className="mw-svcs-tile__photo" style={{ backgroundImage: `url(${external ? photo : service.photo})` }} aria-hidden="true" />
      <div className="mw-svcs-tile__body">
        <NumToken01 n={n} className="mw-svcs-tile__num" />
        {(() => {
          const [l1, l2] = external ? titleLines : (() => { const s = splitTitle(service.title); return [s.line1, s.line2]; })();
          return (
            <div className="mw-svcs-tile__title-row">
              <h3 className="mw-svcs-tile__title">{l1}{l2 && (<><br />{l2}</>)}</h3>
              <span className="mw-svcs-tile__arr" aria-hidden="true">→</span>
            </div>
          );
        })()}
        <p className="mw-svcs-tile__text">{external ? summary : service.summary}</p>
      </div>
    </>
  );
  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>;
  }
  return <Link href={`/industrial-services/${service.slug}/`} className={cls}>{inner}</Link>;
}
