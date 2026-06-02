export function FigureStat01({ label, num, unit }) {
  return (
    <div className="mw-fac2__fig">
      <dt className="mw-fac2__fig-label">{label}</dt>
      <dd className="mw-fac2__fig-val"><span className="mw-fac2__fig-num">{num}</span><span className="mw-fac2__fig-unit">{unit}</span></dd>
    </div>
  );
}
