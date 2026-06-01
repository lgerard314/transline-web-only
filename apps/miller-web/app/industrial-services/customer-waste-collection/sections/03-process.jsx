import { customerWasteCollection as c } from "@/lib/content/service-customer-waste-collection";
import { StopText } from "@/components/StopText";

// §3 — How it works, as a dock → VBEC routing manifest: four stations strung
// along a single clay route line, each with a manifest-style mono code. The
// last station (transport to VBEC) is the filled destination node.
export function ProcessSection() {
  const p = c.process;
  return (
    <section className="mw-flow" aria-labelledby="cwc-steps-title">
      <div className="mw-flow__inner mw-inner">
        <header className="mw-flow__head" data-reveal>
          <p className="mw-section-tag" aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label mw-section-tag-label--invert">{p.eyebrow}</span>
          </p>
          <div className="mw-flow__head-split">
            <h2 id="cwc-steps-title" className="mw-section-title mw-flow__title">
              <StopText>{p.title}</StopText>
            </h2>
            <div className="mw-flow__head-aside">
              <p className="mw-flow__lead">{p.lead}</p>
              <p className="mw-flow__route" aria-hidden="true">
                <span className="mw-flow__route-mark" />
                {p.route}
              </p>
            </div>
          </div>
        </header>

        <ol className="mw-flow__line" data-reveal-stagger>
          {p.steps.map((st, i) => (
            <li
              key={st.num}
              className="mw-flow__stop"
              data-terminal={i === p.steps.length - 1 ? "1" : undefined}
            >
              <div className="mw-flow__track" aria-hidden="true">
                <span className="mw-flow__node">{st.num}</span>
              </div>
              <div className="mw-flow__card">
                <p className="mw-flow__tag">
                  <span className="mw-flow__tag-code">{st.num}</span>
                  {st.tag}
                </p>
                <h3 className="mw-flow__name">{st.name}</h3>
                <p className="mw-flow__text">{st.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
