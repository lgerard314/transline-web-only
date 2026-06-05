// Photo card for bento-grid-02 only — body + arrow in a row, arrow on last line.
import Link from "next/link";
import { NumToken01 } from "@/components-v2/01_marks/text/num-token-01";
import { splitTitle } from "@/components-v2/06_sections/grids/bento-grid-order";

export function BentoGridCard02({ service, n, external = false, href, photo, titleLines, summary }) {
  const [l1, l2] = external
    ? titleLines
    : (() => {
        const s = splitTitle(service.title);
        return [s.line1, s.line2];
      })();
  const photoSrc = external ? photo : service.photo;
  const body = external ? summary : service.summary;

  const inner = (
    <>
      <span className="mw-svcs-grid02-card__photo" style={{ backgroundImage: `url(${photoSrc})` }} aria-hidden="true" data-parallax-img data-parallax-x="0.7" />
      <div className="mw-svcs-grid02-card__body">
        <NumToken01 n={n} className="mw-svcs-grid02-card__num" />
        <h3 className="mw-svcs-grid02-card__title">
          {l1}
          {l2 ? (
            <>
              <br />
              {l2}
            </>
          ) : null}
        </h3>
        <div className="mw-svcs-grid02-card__foot">
          <p className="mw-svcs-grid02-card__text">{body}</p>
          <span className="mw-svcs-grid02-card__arr" aria-hidden="true">
            →
          </span>
        </div>
      </div>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="mw-svcs-grid02-card">
        {inner}
      </a>
    );
  }
  return (
    <Link href={`/industrial-services/${service.slug}/`} className="mw-svcs-grid02-card">
      {inner}
    </Link>
  );
}
