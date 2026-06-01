// Renders heading text with the trailing clay "stop" square glued to the last
// word (white-space:nowrap) so the square can never wrap onto its own line.
// A word-joiner doesn't suppress the soft-wrap opportunity around the
// inline-block stop box, so a nowrap wrapper is required. Pure render — safe in
// both server and client components.
export function StopText({ children, stopClassName = "mw-stop" }) {
  const text = String(children ?? "");
  const trimmed = text.replace(/\s+$/, "");
  const idx = trimmed.lastIndexOf(" ");
  const head = idx === -1 ? "" : trimmed.slice(0, idx + 1);
  const last = idx === -1 ? trimmed : trimmed.slice(idx + 1);
  return (
    <>
      {head}
      <span className="mw-nobr">
        {last}
        <span className={stopClassName} aria-hidden="true" />
      </span>
    </>
  );
}
