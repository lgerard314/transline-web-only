import { caseGrainElevator as c } from "@/lib/content/case-grain-elevator";
import { Body } from "./body";

export function ApproachSection() {
  const approach = c.approach;
  return (
    <section className="tl-container" style={{ padding: "var(--space-7) 0" }}>
      <div className="tl-prose" style={{ maxWidth: 760 }}>
        <h2 className="tl-display tl-display--m">
          {approach.heading ?? "Miller's approach"}
        </h2>
        {approach.subsections?.map((s, i) => (
          <section key={i} style={{ marginTop: "var(--space-5)" }}>
            <h3 className="tl-display tl-display--xs">{s.title}</h3>
            <Body body={s.body} />
          </section>
        ))}
      </div>
    </section>
  );
}
