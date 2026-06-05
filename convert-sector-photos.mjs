import sharp from "sharp";
import { statSync } from "node:fs";

const DIR = "apps/miller-web/public/miller/custom";
const SLUGS = [
  "industrial-manufacturing", "mining", "oil-and-gas", "chemical-distribution",
  "aerospace-and-defence", "transportation-and-rail", "utlities-and-power", "agriculture",
  "biotech-and-pharma", "crown-insurers", "federal-and-provincial-agencies", "education-and-healthcare",
  "small-business", "households", "municipal-programs", "construction-and-demolition",
];

const kb = (p) => (statSync(p).size / 1024).toFixed(0);
let beforeTotal = 0, afterTotal = 0;

for (const slug of SLUGS) {
  const src = `${DIR}/${slug}.png`;
  const out = `${DIR}/${slug}.webp`;
  const before = statSync(src).size;
  // 512×512 center-cover matches the square cell's object-fit: cover crop; gives 2× headroom for the ~150–185px diamonds.
  await sharp(src).resize(512, 512, { fit: "cover", position: "centre" }).webp({ quality: 80 }).toFile(out);
  const after = statSync(out).size;
  beforeTotal += before; afterTotal += after;
  console.log(`${slug}: ${kb(src)}KB png -> ${kb(out)}KB webp`);
}

console.log(`\nTOTAL: ${(beforeTotal / 1048576).toFixed(1)}MB png -> ${(afterTotal / 1048576).toFixed(2)}MB webp`);
