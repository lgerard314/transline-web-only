import { caseBrandonPower as c } from "@/lib/content/case-brandon-power";

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

function Body({ body }) {
  if (!body) return null;
  if (Array.isArray(body)) {
    return body.map((p, i) => <p key={i}>{p}</p>);
  }
  return <p>{body}</p>;
}
