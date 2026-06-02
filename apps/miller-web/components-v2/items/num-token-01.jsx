// L0 · num-token-01 — zero-padded mono number. className carries the
// context class (e.g. mw-svcs-tile__num); ariaHidden matches the original use.
export function NumToken01({ n, className, ariaHidden = false }) {
  const extra = ariaHidden ? { "aria-hidden": "true" } : {};
  return <span className={className} {...extra}>{String(n).padStart(2, "0")}</span>;
}
