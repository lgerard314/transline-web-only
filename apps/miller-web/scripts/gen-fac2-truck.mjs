import fs from "fs";

const src = fs.readFileSync(
  "public/miller/custom-graphics/dumptruck-graphic-flat-side.svg",
  "utf8"
);

const themed = src
  .replace(/fill="#F7F7F4"/g, 'fill="var(--fac2-truck-base, var(--c-bg))"')
  .replace(/fill="#DEDED9"/g, 'fill="var(--fac2-truck-mid)"')
  .replace(/fill="#B9B9B3"/g, 'fill="var(--fac2-truck-shade)"')
  .replace(/fill="#1F1F1F"/g, 'fill="var(--fac2-truck-stroke)"')
  .replace(/stroke="#1F1F1F"/g, 'stroke="var(--fac2-truck-stroke)"')
  .replace(/stroke="#DEDED9"/g, 'stroke="var(--fac2-truck-mid)"')
  .replace(/stroke="#B9B9B3"/g, 'stroke="var(--fac2-truck-shade)"')
  .replace(/<svg /, '<svg className="mw-fac2__truck-svg" aria-hidden="true" ')
  .replace(/<\?xml[^>]*>\n?/, "")
  .replace(/<title>[^<]*<\/title>\n?/, "")
  .replace(/<desc>[^<]*<\/desc>\n?/, "")
  .replace(/stroke-width=/g, "strokeWidth=")
  .replace(/stroke-linecap=/g, "strokeLinecap=")
  .replace(/stroke-linejoin=/g, "strokeLinejoin=")
  .replace(/shape-rendering=/g, "shapeRendering=");

const out = `// Fac2Dumptruck01 — VBEC swipe-reveal backdrop (MediaSplit01 only).
// Themed from dumptruck-graphic-flat-side.svg; fills/strokes use --fac2-truck-* tokens.
export function Fac2Dumptruck01() {
  return (
    ${themed.trim()}
  );
}
`;

fs.mkdirSync("components-v2/05_widgets/graphics", { recursive: true });
fs.writeFileSync("components-v2/05_widgets/graphics/fac2-dumptruck-01.jsx", out);
console.log("written", out.length, "bytes");
