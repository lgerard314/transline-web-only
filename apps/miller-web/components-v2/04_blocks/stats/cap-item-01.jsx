import { NumToken01 } from "@/components-v2/01_marks/text/num-token-01";
export function CapItem01({ n, name }) {
  return (
    <li className="mw-fac2__caps-item">
      <NumToken01 n={n} className="mw-fac2__caps-num" ariaHidden />
      <h4 className="mw-fac2__caps-name">{name}</h4>
    </li>
  );
}
