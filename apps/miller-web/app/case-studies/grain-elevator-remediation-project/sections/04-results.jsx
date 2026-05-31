import { caseGrainElevator as c } from "@/lib/content/case-grain-elevator";

export function ResultsSection() {
  const results = c.results;
  return (
    <section className="tl-container" style={{ padding: "var(--space-7) 0" }}>
      <h2 className="tl-display tl-display--m">
        {results.heading ?? "The results"}
      </h2>
      {results.summary && (
        <p style={{ marginTop: 8, color: "var(--c-ink-2)" }}>{results.summary}</p>
      )}
      <div className="mw-results-table-wrap" style={{ overflowX: "auto", marginTop: 16 }}>
        <table className="mw-results-table">
          <thead>
            <tr>
              <th scope="col">Benefit</th>
              <th scope="col">Outcome</th>
            </tr>
          </thead>
          <tbody>
            {results.rows?.map((r, i) => (
              <tr key={i}>
                <th scope="row">{r.benefit}</th>
                <td>{r.outcome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
