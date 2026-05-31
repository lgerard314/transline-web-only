import { caseHwy16Diesel as c } from "@/lib/content/case-hwy16-diesel";
import { Body } from "./body";

export function ProblemSection() {
  const problem = c.problem;
  if (!problem) return null;

  return (
    <section className="tl-container" style={{ padding: "var(--space-8) 0" }}>
      <div className="tl-prose" style={{ maxWidth: 760 }}>
        <h2 className="tl-display tl-display--m">
          {problem.heading ?? "The problem"}
        </h2>
        <Body body={problem.body} />
      </div>
    </section>
  );
}
