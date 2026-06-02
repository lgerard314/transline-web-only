// L0 · stop-period-01 — clay stamp period.
// Config: variant "title" | "hero" | "colon".
const CLS = { title: "mw-stop", hero: "mw-hero__stop", colon: "mw-stop-colon" };
export function StopPeriod01({ variant = "title" }) {
  return <span className={CLS[variant] || CLS.title} aria-hidden="true" />;
}
