// L1 · milestone-item-01 — one history milestone (the <li> that is a direct
// child of the timeline <ol>). Returns the <li> itself (no wrapper).
export function MilestoneItem01({ item, side, active, onActivate }) {
  return (
    <li
      data-reveal
      className={"mw-ten3__milestone mw-ten3__milestone--" + side + (active ? " is-active" : "")}
      onMouseEnter={onActivate}
      onFocus={onActivate}
    >
      <div className="mw-ten3__milestone-head">
        <span className="mw-ten3__milestone-dot" aria-hidden="true" />
        <span className="mw-ten3__milestone-year">{item.year}</span>
        <h4 className="mw-ten3__milestone-title">{item.title}</h4>
      </div>
      <div className="mw-ten3__milestone-bodywrap">
        <div className="mw-ten3__milestone-body">
          <span className="mw-ten3__milestone-body-title">{item.title}</span>
          <p className="mw-ten3__milestone-body-text">{item.body}</p>
        </div>
      </div>
    </li>
  );
}
