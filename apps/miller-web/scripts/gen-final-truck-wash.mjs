import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

const WASH = {
  vbW: 2000,
  vbH: 1400,
  scale: 0.15,
  stepX: 420,
  stepY: 177,
  x0: -1600,
  y0: -1000,
  cols: 14,
  rows: 20,
  truckW: 1672,
};

const DPR = 2;
const OUT_DIR = path.join(root, "public/miller/generated");
const SOURCES = {
  dumptruck: path.join(root, "public/miller/custom-graphics/dumptruck-graphic-flat-side.svg"),
  tanker: path.join(root, "public/miller/custom-graphics/vacuum-tanker-truck-reference-style.svg"),
};

const TOKENS = {
  bg: "#F7F1E6",
  line: "#E8DCC6",
  ink: "#2A1B12",
};

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return {
    r: Number.parseInt(clean.slice(0, 2), 16),
    g: Number.parseInt(clean.slice(2, 4), 16),
    b: Number.parseInt(clean.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b].map((n) => Math.round(n).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function mix(aHex, aWeight, bHex) {
  const a = hexToRgb(aHex);
  const b = hexToRgb(bHex);
  const bWeight = 1 - aWeight;
  return rgbToHex({
    r: a.r * aWeight + b.r * bWeight,
    g: a.g * aWeight + b.g * bWeight,
    b: a.b * aWeight + b.b * bWeight,
  });
}

const COLORS = {
  base: TOKENS.bg,
  mid: mix(TOKENS.bg, 0.8, TOKENS.line),
  shade: mix(TOKENS.bg, 0.62, TOKENS.line),
  stroke: mix(TOKENS.ink, 0.26, TOKENS.line),
};

const COLOR_MAP = new Map([
  ["#F7F7F4", COLORS.base],
  ["#DEDED9", COLORS.mid],
  ["#B9B9B3", COLORS.shade],
  ["#1F1F1F", COLORS.stroke],
]);

function themedInnerSvg(svg) {
  const body = svg
    .replace(/<\?xml[^>]*>\s*/i, "")
    .replace(/^[\s\S]*?<svg\b[^>]*>/i, "")
    .replace(/<\/svg>\s*$/i, "")
    .trim();

  return body.replace(/\b(fill|stroke)=(["'])(#[0-9a-f]{6})\2/gi, (match, attr, quote, color) => {
    const next = COLOR_MAP.get(color.toUpperCase());
    return next ? `${attr}=${quote}${next}${quote}` : match;
  });
}

const trucks = {
  dumptruck: themedInnerSvg(fs.readFileSync(SOURCES.dumptruck, "utf8")),
  tanker: themedInnerSvg(fs.readFileSync(SOURCES.tanker, "utf8")),
};

function fmt(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/, "");
}

function buildLaneUses() {
  const lanes = { rtl: [], ltr: [] };

  for (let row = 0; row < WASH.rows; row += 1) {
    const y = WASH.y0 + row * WASH.stepY;
    const flipped = row % 2 === 1;
    const brick = flipped ? WASH.stepX / 2 : 0;

    for (let col = 0; col < WASH.cols; col += 1) {
      const x = WASH.x0 + brick + col * WASH.stepX;
      const truck = (row + col) % 2 === 0 ? "dumptruck" : "tanker";
      const href = `#mw-final-${truck}`;
      const transform = flipped
        ? `translate(${fmt(x + WASH.truckW * WASH.scale)} ${fmt(y)}) scale(-${WASH.scale} ${WASH.scale})`
        : `translate(${fmt(x)} ${fmt(y)}) scale(${WASH.scale})`;
      lanes[flipped ? "ltr" : "rtl"].push(`<use href="${href}" xlink:href="${href}" transform="${transform}"/>`);
    }
  }

  return lanes;
}

function layerSvg(uses) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${WASH.vbW * DPR}" height="${WASH.vbH * DPR}" viewBox="0 0 ${WASH.vbW} ${WASH.vbH}" fill="none" shape-rendering="geometricPrecision">
  <defs>
    <g id="mw-final-dumptruck" fill="none" stroke-linecap="round" stroke-linejoin="round" shape-rendering="geometricPrecision">
${trucks.dumptruck}
    </g>
    <g id="mw-final-tanker" fill="none" stroke-linecap="round" stroke-linejoin="round" shape-rendering="geometricPrecision">
${trucks.tanker}
    </g>
  </defs>
  <g transform="rotate(-30 ${WASH.vbW / 2} ${WASH.vbH / 2})">
    ${uses.join("\n    ")}
  </g>
</svg>`;
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const lanes = buildLaneUses();
for (const [lane, uses] of Object.entries(lanes)) {
  const out = path.join(OUT_DIR, `final-truck-wash-${lane}.png`);
  await sharp(Buffer.from(layerSvg(uses)))
    .png({ palette: true, colors: 256, compressionLevel: 9, adaptiveFiltering: true })
    .toFile(out);
  console.log(`wrote ${path.relative(root, out)} (${uses.length} stamps)`);
}

console.log("colors", COLORS);
