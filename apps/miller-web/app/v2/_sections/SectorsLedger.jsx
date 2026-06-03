import Image from "next/image";
import { CustodyRule } from "../_components/CustodyThread";

// 03 · GENERATORS — who originates the waste, as a three-card ledger over the
// matched sector photo set (art-directed as one triptych). Each card is a
// custody origin point: lineNo · sector · representative generators. The
// photographs clip in top→bottom; the card bodies carry the ledger grammar so
// they read at rest.
export function SectorsLedger({ content }) {
  const c = content;
  return (
    <section className="mx-sect mx-section mx-warm" aria-labelledby={c.headingId}>
      <CustodyRule />
      <div className="mx-inner">
        <div className="mx-sect__head">
          <p className="mx-field">
            <span>{c.stage}</span>
            <span className="mx-field__rule" />
            <span>{c.field}</span>
          </p>
          <h2 id={c.headingId} className="mx-h2">{c.title}</h2>
          <p className="mx-lead">{c.lead}</p>
        </div>

        <ul className="mx-sect__grid" data-mx-reveal-stagger>
          {c.cards.map((card) => (
            <li className="mx-sect__card" key={card.lineNo}>
              <span className="mx-sect__media" data-mx-reveal="clip">
                <Image src={card.photo} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" className="mx-sect__img" />
              </span>
              <div className="mx-sect__cardbody">
                <p className="mx-sect__cardhead">
                  <span className="mx-sect__no">{card.lineNo}</span>
                  <span className="mx-sect__cardtitle">{card.title}</span>
                </p>
                <ul className="mx-sect__items">
                  {card.items.map((it) => (
                    <li className="mx-sect__item" key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
