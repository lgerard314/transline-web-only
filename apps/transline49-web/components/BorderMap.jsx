// Stylised North America with the 49°N parallel drawn where it actually
// runs, projected from real lat/lon to an 800×420 SVG canvas. One filled
// landmass, Hudson Bay + Great Lakes cut out, animated movement arcs from
// St. Louis up across the border. Pure SVG — no measurement, no JS.
export function BorderMap({ height = 280, accent, withPins = true, withFloatLabels = true }) {
  const ACC = accent || "var(--c-accent)";
  const LAND = "rgba(230, 238, 242, 0.10)";
  const LAND_STROKE = "rgba(230, 238, 242, 0.32)";

  // Equirectangular projection: lon ∈ [-135, -50], lat ∈ [25, 75] → 800×420.
  const X = (lon) => +((lon + 135) * (800 / 85)).toFixed(1);
  const Y = (lat) => +((75 - lat) * (420 / 50)).toFixed(1);
  const P = (lon, lat) => `${X(lon)} ${Y(lat)}`;

  const COAST = [
    [-134, 58.5], [-132.5, 56.5], [-130.5, 54.7], [-128, 52], [-127.7, 50.5],
    [-126, 49.5], [-124.5, 48.5], [-124, 47.0],
    [-124.0, 45.5], [-124.1, 43.4], [-124.4, 40.4], [-123.0, 38.9],
    [-122.5, 37.8], [-121.9, 36.6], [-120.5, 34.5], [-118.5, 34.0],
    [-117.1, 32.5],
    [-114.5, 32.7], [-111.1, 31.3], [-108.2, 31.8], [-106.5, 31.8],
    [-104.2, 30.4], [-101.4, 29.8], [-99.5, 27.5], [-97.5, 25.9],
    [-97.0, 27.6], [-95.0, 29.2], [-92.0, 29.7], [-89.2, 29.2],
    [-88.0, 30.6], [-85.4, 30.1], [-82.5, 27.9], [-81.7, 25.8],
    [-80.4, 25.0], [-80.0, 26.7], [-80.5, 28.4], [-81.4, 30.3],
    [-80.8, 32.0], [-78.9, 33.7], [-75.5, 35.3], [-75.9, 36.9],
    [-75.0, 38.5], [-74.0, 39.4], [-73.9, 40.5], [-71.9, 41.3],
    [-70.0, 41.7], [-70.6, 42.5], [-70.3, 43.7], [-68.2, 44.4],
    [-67.0, 44.9],
    [-66.0, 45.3], [-64.8, 43.7], [-63.6, 44.6], [-60.4, 45.5],
    [-59.3, 46.0],
    [-55.5, 46.6], [-52.7, 47.6], [-52.6, 48.4], [-55.0, 51.6],
    [-56.5, 52.5], [-60.0, 55.5], [-62.5, 58.0], [-64.7, 60.3],
    [-67.0, 61.0], [-72.0, 61.3], [-78.0, 62.3],
    [-87.0, 66.0], [-93.0, 67.5], [-100.0, 68.0], [-108.0, 68.5],
    [-115.0, 67.8], [-122.0, 68.5], [-128.0, 69.5], [-133.0, 69.3],
    [-135.0, 69.0],
    [-135.0, 60.0],
  ];
  const CONTINENT = "M " + COAST.map(([lon, lat]) => P(lon, lat)).join(" L ") + " Z";

  const HB_COAST = [
    [-78.0, 62.3],
    [-78.0, 60.5], [-78.5, 58.5], [-78.8, 56.0],
    [-78.5, 54.5], [-79.0, 52.5], [-80.5, 51.4],
    [-82.5, 52.4], [-82.5, 54.7],
    [-86.0, 55.7], [-88.5, 57.0], [-93.0, 58.7],
    [-94.1, 60.0],
    [-93.0, 62.0], [-88.0, 64.0],
    [-86.0, 65.0], [-82.0, 64.5], [-80.0, 63.0],
  ];
  const HUDSON_BAY = "M " + HB_COAST.map(([lon, lat]) => P(lon, lat)).join(" L ") + " Z";

  const PARALLEL_49 = "M 110 218 L 380 218 C 410 224, 440 240, 480 256 C 520 270, 560 280, 600 268 C 630 256, 650 244, 700 244";

  const LAKES = [
    "M 408 226 C 416 220, 444 220, 468 224 C 488 226, 510 230, 514 240 C 510 250, 478 252, 452 248 C 426 244, 408 234, 408 226 Z",
    "M 470 252 C 476 246, 494 248, 498 260 C 500 274, 488 286, 478 286 C 466 282, 462 264, 470 252 Z",
    "M 502 240 C 516 240, 530 246, 532 256 C 528 268, 514 270, 502 266 C 494 260, 494 248, 502 240 Z",
    "M 506 270 C 524 268, 552 268, 558 274 C 558 280, 538 282, 524 282 C 514 280, 506 276, 506 270 Z",
    "M 528 262 C 544 260, 558 262, 560 266 C 560 270, 548 272, 540 271 C 534 270, 528 266, 528 262 Z",
  ].join(" ");

  const CITIES = [
    [113, 216, "Vancouver",  true],
    [202, 181, "Edmonton",   true],
    [198, 202, "Calgary",    true],
    [356, 211, "Winnipeg",   true],
    [525, 258, "Toronto",    true],
    [577, 248, "Montréal",   true],
    [422, 306, "St. Louis · HQ", false, true],
  ];

  return (
    <svg
      viewBox="0 0 800 420"
      width="100%"
      height={height}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block" }}
    >
      <defs>
        <pattern id="bm-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" fill="none" />
        </pattern>
        <linearGradient id="bm-ca-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(101,183,65,0.10)" />
          <stop offset="1" stopColor="rgba(101,183,65,0.02)" />
        </linearGradient>
        <linearGradient id="bm-us-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(230,238,242,0.02)" />
          <stop offset="1" stopColor="rgba(230,238,242,0.10)" />
        </linearGradient>
        <radialGradient id="bm-stl-pulse" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={ACC} stopOpacity="0.6" />
          <stop offset="1" stopColor={ACC} stopOpacity="0" />
        </radialGradient>
        <clipPath id="bm-clip-ca">
          <path d="M 0 0 H 800 V 244 C 650 244, 620 256, 600 268 C 560 280, 520 270, 480 256 C 440 240, 410 224, 380 218 L 0 218 Z" />
        </clipPath>
        <clipPath id="bm-clip-us">
          <path d="M 0 218 L 380 218 C 410 224, 440 240, 480 256 C 520 270, 560 280, 600 268 C 620 256, 650 244, 800 244 V 420 H 0 Z" />
        </clipPath>
        <clipPath id="bm-clip-land">
          <path d={CONTINENT} />
        </clipPath>
      </defs>

      <rect width="800" height="420" fill="url(#bm-grid)" />

      <g clipPath="url(#bm-clip-land)">
        <rect width="800" height="420" fill="url(#bm-ca-fill)" clipPath="url(#bm-clip-ca)" />
        <rect width="800" height="420" fill="url(#bm-us-fill)" clipPath="url(#bm-clip-us)" />
      </g>

      <path d={CONTINENT} fill={LAND} stroke={LAND_STROKE} strokeWidth="0.9" strokeLinejoin="round" />
      <path d={HUDSON_BAY} fill="#0B1F2A" stroke={LAND_STROKE} strokeWidth="0.7" />
      <path d={LAKES} fill="#0B1F2A" stroke={LAND_STROKE} strokeWidth="0.7" strokeLinejoin="round" />

      <path d={PARALLEL_49} fill="none" stroke={ACC} strokeWidth="1.4" strokeDasharray="3 5" opacity="0.95" />

      {Array.from({ length: 6 }).map((_, i) => (
        <line key={i} x1={140 + i * 46} y1="214" x2={140 + i * 46} y2="222" stroke={ACC} strokeWidth="0.7" opacity="0.6" />
      ))}

      <g transform="translate(50 204)">
        <rect x="-4" y="-12" width="58" height="18" rx="3" fill="rgba(11,31,42,0.85)" stroke={ACC} strokeOpacity="0.6" strokeWidth="0.6" />
        <text x="2" y="2" fill={ACC} fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="1.2" fontWeight="500">49°N</text>
      </g>

      <g fill="none" strokeLinecap="round">
        <path d="M 422 306 C 360 280, 290 220, 202 181" stroke={ACC} strokeWidth="1.4" opacity="0.95" />
        <path d="M 422 306 C 400 270, 380 240, 356 211" stroke={ACC} strokeWidth="1.4" opacity="0.85" />
        <path d="M 422 306 C 470 290, 510 280, 525 258" stroke={ACC} strokeWidth="1.4" opacity="0.75" />
        <path d="M 422 306 C 490 290, 560 268, 577 248" stroke={ACC} strokeWidth="1.4" opacity="0.6" />
      </g>

      <circle cx="422" cy="306" r="28" fill="url(#bm-stl-pulse)" />
      <circle cx="422" cy="306" r="6" fill="none" stroke={ACC} strokeWidth="1" opacity="0">
        <animate attributeName="r" values="6;28;6" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0;0.7" dur="2.4s" repeatCount="indefinite" />
      </circle>

      <g>
        <g transform="translate(-10 -6)">
          <rect width="14" height="7" x="2" y="2" rx="1" fill={ACC} />
          <path d="M16 4 h3 l3 3 v2 h-6 z" fill={ACC} />
          <circle cx="6" cy="9.5" r="1.4" fill="#1a1a1a" />
          <circle cx="18" cy="9.5" r="1.4" fill="#1a1a1a" />
        </g>
        <animateMotion dur="7s" repeatCount="indefinite" rotate="auto" path="M 422 306 C 360 280, 290 220, 202 181" />
      </g>

      {withPins && (
        <g>
          {CITIES.map(([x, y, label, isCa, isHero], i) => {
            const r = isHero ? 5 : isCa ? 3.5 : 3;
            const fill = isHero ? ACC : isCa ? "#fff" : "rgba(230,238,242,0.85)";
            return (
              <g key={i}>
                {isHero && (
                  <circle cx={x} cy={y} r={11} fill="none" stroke={ACC} strokeOpacity="0.4" strokeWidth="1" />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill={fill}
                  stroke={isCa && !isHero ? "rgba(101,183,65,0.4)" : "none"}
                  strokeWidth="2"
                />
                {withFloatLabels && (
                  <text
                    x={x + (isHero ? 12 : 7)}
                    y={y + 4}
                    fill="rgba(230,238,242,0.92)"
                    fontFamily="var(--font-mono)"
                    fontSize={isHero ? 11 : 10}
                    fontWeight={isHero ? 500 : 400}
                    letterSpacing="0.5"
                  >
                    {String(label).toUpperCase()}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      )}

      <g transform="translate(722 60)" stroke="rgba(230,238,242,0.55)" strokeWidth="0.8" fill="none">
        <circle r="22" />
        <path d="M 0 -22 L 4 -4 L 0 0 L -4 -4 Z" fill={ACC} stroke="none" />
        <path d="M 0 22 L 4 4 L 0 0 L -4 4 Z" fill="rgba(230,238,242,0.6)" stroke="none" />
        <path d="M -22 0 L -4 4 L 0 0 L -4 -4 Z" fill="rgba(230,238,242,0.4)" stroke="none" />
        <path d="M 22 0 L 4 4 L 0 0 L 4 -4 Z" fill="rgba(230,238,242,0.4)" stroke="none" />
        <text y="-28" textAnchor="middle" fill={ACC} fontSize="9" fontFamily="var(--font-mono)" stroke="none" letterSpacing="1">N</text>
      </g>

      <g fontFamily="var(--font-mono)" fontSize="9" fill="rgba(230,238,242,0.4)" letterSpacing="1">
        <text x="6" y="124">60°N</text>
        <text x="6" y="218" fill={ACC} opacity="0.85">49°N</text>
        <text x="6" y="334">35°N</text>
        <line x1="36" y1="122" x2="42" y2="122" stroke="rgba(230,238,242,0.3)" strokeWidth="0.5" />
        <line x1="36" y1="332" x2="42" y2="332" stroke="rgba(230,238,242,0.3)" strokeWidth="0.5" />
      </g>

      <text x="240" y="140" fill="rgba(230,238,242,0.45)" fontFamily="var(--font-mono)" fontSize="12" letterSpacing="3">CANADA</text>
      <text x="280" y="360" fill="rgba(230,238,242,0.32)" fontFamily="var(--font-mono)" fontSize="12" letterSpacing="3">UNITED STATES</text>

      <text x="794" y="14" textAnchor="end" fill="rgba(230,238,242,0.35)" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.2">N · 75.00°</text>
      <text x="794" y="412" textAnchor="end" fill="rgba(230,238,242,0.35)" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.2">W · 050.00°</text>
    </svg>
  );
}
