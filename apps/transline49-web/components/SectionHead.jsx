import { ParallelRule } from "./ParallelRule";

export function SectionHead({ eyebrow, title, lead, right = null }) {
  return (
    <div
      data-reveal=""
      data-tlgrid-collapse={right ? "" : undefined}
      className="tl-sechead"
      style={{
        display: "grid",
        gridTemplateColumns: right ? "1fr auto" : "1fr",
        gap: 32,
        alignItems: "end",
        marginBottom: 40,
      }}
    >
      <div>
        <ParallelRule label={eyebrow} />
        <h2 className="tl-display tl-display--l tl-sechead__title" style={{ marginTop: 24, maxWidth: "20ch" }}>
          {title}
        </h2>
        {lead && (
          <p className="tl-lead tl-sechead__lead" style={{ marginTop: 16 }}>
            {lead}
          </p>
        )}
      </div>
      {right && <div className="tl-sechead__right">{right}</div>}
    </div>
  );
}
