export function PlateStat01({ num, unit, label }) {
  return (
    <div className="mw-ten3__plate-stat">
      <dd className="mw-ten3__plate-val"><span className="mw-ten3__plate-num">{num}</span><span className="mw-ten3__plate-unit">{unit}</span></dd>
      <dt className="mw-ten3__plate-label">{label}</dt>
    </div>
  );
}
