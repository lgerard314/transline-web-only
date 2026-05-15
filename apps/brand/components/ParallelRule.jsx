// The 49°N signature motif — tick · label · rule · (optional note) · tick.
// Server component (presentational).
export function ParallelRule({ light = false, label = "49°N", note = null }) {
  const cls = `tl-parallel${light ? " tl-parallel--light" : ""}`;
  return (
    <div className={cls} role="presentation">
      <span className="tl-parallel__tick" />
      <span className="tl-parallel__label">{label}</span>
      <span className="tl-parallel__line" />
      {note && <span className="tl-parallel__label" style={{ opacity: 0.7 }}>{note}</span>}
      <span className="tl-parallel__tick" />
    </div>
  );
}
