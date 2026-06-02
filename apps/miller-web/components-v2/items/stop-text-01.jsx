// L0 · stop-text-01 — glues the clay stop to the last word (nowrap), so it
// can't wrap onto its own line. Pure render; server- and client-safe.
export function StopText01({ children, stopClassName = "mw-stop" }) {
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
