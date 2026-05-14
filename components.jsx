// components.jsx — Shared building blocks for TransLine49° site
// Imports are global window vars; load this AFTER tweaks-panel.jsx, BEFORE pages.

const { useState, useEffect, useRef, useMemo } = React;

// ─── Photo registry (Unsplash IDs, used for hero / cards) ─────────────────
// Real-feel industrial / cross-border imagery. Picked for reliability.
const TL_PHOTOS = {
  // All IDs visually verified — these actually show industrial content.
  // 1611273426858 = factory smokestacks; 1494412651409 = container yard;
  // 1565891741441 = trucks at depot; 1586528116493 = warehouse bins;
  // 1542013936693 = recycling machinery; 1517999144091 = bulk material.

  heroTruck:    "https://images.unsplash.com/photo-1565891741441-64926e441838?w=1800&q=70&auto=format&fit=crop",
  heroRefinery: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1800&q=70&auto=format&fit=crop",
  heroBorder:   "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=1800&q=70&auto=format&fit=crop",
  heroDrums:    "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?w=1800&q=70&auto=format&fit=crop",
  heroPort:     "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=1800&q=70&auto=format&fit=crop",
  heroIndustrial: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1800&q=70&auto=format&fit=crop",

  containers:   "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=1200&q=70&auto=format&fit=crop",
  warehouse:    "https://images.unsplash.com/photo-1586528116493-a029325540fa?w=1200&q=70&auto=format&fit=crop",
  tanker:       "https://images.unsplash.com/photo-1565891741441-64926e441838?w=1200&q=70&auto=format&fit=crop",
  recycling:    "https://images.unsplash.com/photo-1542013936693-884638332954?w=1200&q=70&auto=format&fit=crop",
  forklift:     "https://images.unsplash.com/photo-1586528116493-a029325540fa?w=1200&q=70&auto=format&fit=crop",
  pipes:        "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&q=70&auto=format&fit=crop",
  highway:      "https://images.unsplash.com/photo-1565891741441-64926e441838?w=1200&q=70&auto=format&fit=crop",
  stlouis:      "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=1200&q=70&auto=format&fit=crop",
};

// ─── ParallelRule: the 49°N signature motif ───────────────────────────────
function ParallelRule({ light = false, label = "49°N", note = null, align = "between" }) {
  const cls = `tl-parallel${light ? " tl-parallel--light" : ""}`;
  return (
    <div className={cls} role="presentation">
      <span className="tl-parallel__tick" />
      <span className="tl-parallel__label">{label}</span>
      <span className="tl-parallel__line" />
      {note && <span className="tl-parallel__label" style={{ opacity: 0.7 }}>{note}</span>}
      <span className="tl-parallel__tick" />
    </div>
  );
}

// ─── BorderMap: stylised North America with the 49°N parallel ────────────
// One filled landmass (Canada + US), Great Lakes cut out, the 49th parallel
// drawn where it actually runs, real-ish city positions, and movement arcs
// from St. Louis up across the border. Viewbox 0 0 800 420.
function BorderMap({ height = 280, accent, withPins = true, withFloatLabels = true }) {
  const ACC = accent || "var(--c-accent)";
  const LAND = "rgba(230, 238, 242, 0.10)";
  const LAND_STROKE = "rgba(230, 238, 242, 0.32)";
  const LAND_US = "rgba(230, 238, 242, 0.04)";
  const LAND_CA = "rgba(101, 183, 65, 0.06)";

  // ─ North America silhouette built from real lat/lon coastline points,
  // equirectangular-projected to the 800×420 canvas (lon ∈ [-135, -50],
  // lat ∈ [25, 75]). Each point is a real cape, port, or coast feature.
  // The shape sweeps clockwise: BC coast → US Pacific → Mexico border →
  // Gulf → Florida → East Coast → Maritimes → Labrador → Hudson Bay coast
  // → Arctic. Hudson Bay is rendered as a separate water polygon on top.
  const X = (lon) => +((lon + 135) * (800 / 85)).toFixed(1); // 800px / 85° = 9.41
  const Y = (lat) => +((75 - lat) * (420 / 50)).toFixed(1);  // 420px / 50° = 8.4
  const P = (lon, lat) => `${X(lon)} ${Y(lat)}`;

  // Coastline waypoints — clockwise around mainland N. America
  const COAST = [
    // Alaska panhandle / BC coast (going south)
    [-134, 58.5], [-132.5, 56.5], [-130.5, 54.7], [-128, 52], [-127.7, 50.5],
    [-126, 49.5], [-124.5, 48.5], [-124, 47.0],
    // US Pacific (going south)
    [-124.0, 45.5], [-124.1, 43.4], [-124.4, 40.4], [-123.0, 38.9],
    [-122.5, 37.8], [-121.9, 36.6], [-120.5, 34.5], [-118.5, 34.0],
    [-117.1, 32.5],
    // US-Mexico border (going east, concave Rio Grande dip)
    [-114.5, 32.7], [-111.1, 31.3], [-108.2, 31.8], [-106.5, 31.8],
    [-104.2, 30.4], [-101.4, 29.8], [-99.5, 27.5], [-97.5, 25.9],
    // Gulf coast (going east)
    [-97.0, 27.6], [-95.0, 29.2], [-92.0, 29.7], [-89.2, 29.2],
    [-88.0, 30.6], [-85.4, 30.1], [-82.5, 27.9], [-81.7, 25.8],
    // Florida tip + east coast (going north)
    [-80.4, 25.0], [-80.0, 26.7], [-80.5, 28.4], [-81.4, 30.3],
    [-80.8, 32.0], [-78.9, 33.7], [-75.5, 35.3], [-75.9, 36.9],
    [-75.0, 38.5], [-74.0, 39.4], [-73.9, 40.5], [-71.9, 41.3],
    [-70.0, 41.7], [-70.6, 42.5], [-70.3, 43.7], [-68.2, 44.4],
    [-67.0, 44.9],
    // Maritimes (NB, NS, then bridge across to NL)
    [-66.0, 45.3], [-64.8, 43.7], [-63.6, 44.6], [-60.4, 45.5],
    [-59.3, 46.0],
    // Newfoundland
    [-55.5, 46.6], [-52.7, 47.6], [-52.6, 48.4], [-55.0, 51.6],
    // Labrador (going north)
    [-56.5, 52.5], [-60.0, 55.5], [-62.5, 58.0], [-64.7, 60.3],
    // Hudson Strait (going west across the top)
    [-67.0, 61.0], [-72.0, 61.3], [-78.0, 62.3],
    // Canadian Arctic coast going far west (along mainland N. coast)
    [-87.0, 66.0], [-93.0, 67.5], [-100.0, 68.0], [-108.0, 68.5],
    [-115.0, 67.8], [-122.0, 68.5], [-128.0, 69.5], [-133.0, 69.3],
    [-135.0, 69.0],
    // close — left edge down to Alaska panhandle starting point
    [-135.0, 60.0],
  ];
  const CONTINENT = "M " + COAST.map(([lon, lat]) => P(lon, lat)).join(" L ") + " Z";

  // Hudson Bay — drawn as water on top of the continent fill.
  // Counter-clockwise around its real coastline (Wolstenholme → James Bay → west shore → north).
  const HB_COAST = [
    [-78.0, 62.3],            // Cape Wolstenholme (NW)
    [-78.0, 60.5], [-78.5, 58.5], [-78.8, 56.0],   // east shore down
    [-78.5, 54.5], [-79.0, 52.5], [-80.5, 51.4],   // east James Bay → bottom
    [-82.5, 52.4], [-82.5, 54.7],                   // west James Bay
    [-86.0, 55.7], [-88.5, 57.0], [-93.0, 58.7],   // west HB going north
    [-94.1, 60.0],
    [-93.0, 62.0], [-88.0, 64.0],                   // NW HB
    [-86.0, 65.0], [-82.0, 64.5], [-80.0, 63.0],   // back east toward Wolstenholme
  ];
  const HUDSON_BAY = "M " + HB_COAST.map(([lon, lat]) => P(lon, lat)).join(" L ") + " Z";

  // 49°N parallel — flat from Pacific to Lake of the Woods, then bends down
  // through the Great Lakes, then up the St. Lawrence to the Maritimes.
  const PARALLEL_49 = "M 110 218 L 380 218 C 410 224, 440 240, 480 256 C 520 270, 560 280, 600 268 C 630 256, 650 244, 700 244";

  // Great Lakes — real centers via projection: Superior (-89,47.5), Michigan
  // (-87,44), Huron (-82.5,45), Erie (-81,42.2), Ontario (-78,43.7).
  const LAKES = [
    // Superior — biggest, top-left
    "M 408 226 C 416 220, 444 220, 468 224 C 488 226, 510 230, 514 240 C 510 250, 478 252, 452 248 C 426 244, 408 234, 408 226 Z",
    // Michigan — vertical, west of Huron
    "M 470 252 C 476 246, 494 248, 498 260 C 500 274, 488 286, 478 286 C 466 282, 462 264, 470 252 Z",
    // Huron — east of Michigan
    "M 502 240 C 516 240, 530 246, 532 256 C 528 268, 514 270, 502 266 C 494 260, 494 248, 502 240 Z",
    // Erie — wide and shallow, southeast
    "M 506 270 C 524 268, 552 268, 558 274 C 558 280, 538 282, 524 282 C 514 280, 506 276, 506 270 Z",
    // Ontario — small, east
    "M 528 262 C 544 260, 558 262, 560 266 C 560 270, 548 272, 540 271 C 534 270, 528 266, 528 262 Z",
  ].join(" ");

  // Cities — projected from real lat/lon: [x, y, label, isCanadian, isHero]
  const CITIES = [
    [113, 216, "Vancouver",  true],
    [202, 181, "Edmonton",   true],
    [198, 202, "Calgary",    true],
    [356, 211, "Winnipeg",   true],
    [525, 258, "Toronto",    true],
    [577, 248, "Montréal",   true],
    [422, 306, "St. Louis · HQ", false, true],  // featured
  ];

  return (
    <svg viewBox="0 0 800 420" width="100%" height={height} preserveAspectRatio="xMidYMid meet"
         style={{ display: "block" }}>
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
        {/* Clip used to fill the Canada half (above the parallel) */}
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

      {/* Water / background grid */}
      <rect width="800" height="420" fill="url(#bm-grid)" />

      {/* Faint hemisphere bands above/below border */}
      <g clipPath="url(#bm-clip-land)">
        <rect width="800" height="420" fill="url(#bm-ca-fill)" clipPath="url(#bm-clip-ca)" />
        <rect width="800" height="420" fill="url(#bm-us-fill)" clipPath="url(#bm-clip-us)" />
      </g>

      {/* Continent stroke */}
      <path d={CONTINENT} fill={LAND} stroke={LAND_STROKE} strokeWidth="0.9" strokeLinejoin="round" />

      {/* Hudson Bay — large inland water body */}
      <path d={HUDSON_BAY} fill="#0B1F2A" stroke={LAND_STROKE} strokeWidth="0.7" />

      {/* Great Lakes — drawn as cutouts (background color) */}
      <path d={LAKES} fill="#0B1F2A" stroke={LAND_STROKE} strokeWidth="0.7" strokeLinejoin="round" />

      {/* 49°N parallel — accent dashed line */}
      <path d={PARALLEL_49} fill="none" stroke={ACC} strokeWidth="1.4"
            strokeDasharray="3 5" opacity="0.95" />

      {/* Parallel tick marks on the flat western section */}
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={i}
              x1={140 + i * 46} y1="214"
              x2={140 + i * 46} y2="222"
              stroke={ACC} strokeWidth="0.7" opacity="0.6" />
      ))}

      {/* 49°N label */}
      <g transform="translate(50 204)">
        <rect x="-4" y="-12" width="58" height="18" rx="3"
              fill="rgba(11,31,42,0.85)" stroke={ACC} strokeOpacity="0.6" strokeWidth="0.6" />
        <text x="2" y="2" fill={ACC} fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="1.2"
              fontWeight="500">49°N</text>
      </g>

      {/* Movement arcs — St. Louis to Canadian destinations */}
      <g fill="none" strokeLinecap="round">
        <path d="M 422 306 C 360 280, 290 220, 202 181"
              stroke={ACC} strokeWidth="1.4" opacity="0.95" />
        <path d="M 422 306 C 400 270, 380 240, 356 211"
              stroke={ACC} strokeWidth="1.4" opacity="0.85" />
        <path d="M 422 306 C 470 290, 510 280, 525 258"
              stroke={ACC} strokeWidth="1.4" opacity="0.75" />
        <path d="M 422 306 C 490 290, 560 268, 577 248"
              stroke={ACC} strokeWidth="1.4" opacity="0.6" />
      </g>

      {/* Pulse on St. Louis */}
      <circle cx="422" cy="306" r="28" fill="url(#bm-stl-pulse)" />
      {/* Animated pulse rings — radiating from St. Louis */}
      <circle cx="422" cy="306" r="6" fill="none" stroke={ACC} strokeWidth="1" opacity="0">
        <animate attributeName="r" values="6;28;6" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0;0.7" dur="2.4s" repeatCount="indefinite" />
      </circle>

      {/* Animated truck sprite — drives the Edmonton arc on a loop */}
      <g>
        <g transform="translate(-10 -6)">
          <rect width="14" height="7" x="2" y="2" rx="1" fill={ACC} />
          <path d={`M16 4 h3 l3 3 v2 h-6 z`} fill={ACC} />
          <circle cx="6" cy="9.5" r="1.4" fill="#1a1a1a" />
          <circle cx="18" cy="9.5" r="1.4" fill="#1a1a1a" />
        </g>
        <animateMotion dur="7s" repeatCount="indefinite" rotate="auto"
          path="M 422 306 C 360 280, 290 220, 202 181" />
      </g>

      {/* Pins */}
      {withPins && (
        <g>
          {CITIES.map(([x, y, label, isCa, isHero], i) => {
            const r = isHero ? 5 : isCa ? 3.5 : 3;
            const fill = isHero ? ACC : isCa ? "#fff" : "rgba(230,238,242,0.85)";
            return (
              <g key={i}>
                {isHero && (
                  <circle cx={x} cy={y} r={11} fill="none"
                          stroke={ACC} strokeOpacity="0.4" strokeWidth="1" />
                )}
                <circle cx={x} cy={y} r={r} fill={fill}
                        stroke={isCa && !isHero ? "rgba(101,183,65,0.4)" : "none"}
                        strokeWidth="2" />
                {withFloatLabels && (
                  <text x={x + (isHero ? 12 : 7)} y={y + 4}
                        fill="rgba(230,238,242,0.92)" fontFamily="var(--font-mono)"
                        fontSize={isHero ? 11 : 10}
                        fontWeight={isHero ? 500 : 400}
                        letterSpacing="0.5">
                    {label.toUpperCase()}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      )}

      {/* Compass rose */}
      <g transform="translate(722 60)" stroke="rgba(230,238,242,0.55)" strokeWidth="0.8" fill="none">
        <circle r="22" />
        <path d="M 0 -22 L 4 -4 L 0 0 L -4 -4 Z" fill={ACC} stroke="none" />
        <path d="M 0 22 L 4 4 L 0 0 L -4 4 Z" fill="rgba(230,238,242,0.6)" stroke="none" />
        <path d="M -22 0 L -4 4 L 0 0 L -4 -4 Z" fill="rgba(230,238,242,0.4)" stroke="none" />
        <path d="M 22 0 L 4 4 L 0 0 L 4 -4 Z" fill="rgba(230,238,242,0.4)" stroke="none" />
        <text y="-28" textAnchor="middle" fill={ACC} fontSize="9"
              fontFamily="var(--font-mono)" stroke="none" letterSpacing="1">N</text>
      </g>

      {/* Lat/lon ticks left edge */}
      <g fontFamily="var(--font-mono)" fontSize="9" fill="rgba(230,238,242,0.4)" letterSpacing="1">
        <text x="6" y="124">60°N</text>
        <text x="6" y="218" fill={ACC} opacity="0.85">49°N</text>
        <text x="6" y="334">35°N</text>
        <line x1="36" y1="122" x2="42" y2="122" stroke="rgba(230,238,242,0.3)" strokeWidth="0.5" />
        <line x1="36" y1="332" x2="42" y2="332" stroke="rgba(230,238,242,0.3)" strokeWidth="0.5" />
      </g>

      {/* Region labels */}
      <text x="240" y="140" fill="rgba(230,238,242,0.45)"
            fontFamily="var(--font-mono)" fontSize="12" letterSpacing="3">CANADA</text>
      <text x="280" y="360" fill="rgba(230,238,242,0.32)"
            fontFamily="var(--font-mono)" fontSize="12" letterSpacing="3">UNITED STATES</text>

      {/* Frame coords */}
      <text x="794" y="14" textAnchor="end" fill="rgba(230,238,242,0.35)"
            fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.2">N · 75.00°</text>
      <text x="794" y="412" textAnchor="end" fill="rgba(230,238,242,0.35)"
            fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.2">W · 050.00°</text>
    </svg>
  );
}

// ─── Hero photo (with onError fallback) ───────────────────────────────────
function HeroPhoto({ src, variant }) {
  // Use background-image; fallback handled by CSS gradient on element.
  return (
    <div className="tl-hero__photo"
         style={src && variant === "photo" ? { backgroundImage: `url(${src})` } : undefined} />
  );
}

// ─── Top nav ──────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "home",     label: "Home",                 path: "/" },
  { id: "services", label: "Services",             path: "/services" },
  { id: "process",  label: "Cross-Border Process", path: "/cross-border-process" },
  { id: "about",    label: "About",                path: "/about" },
  { id: "contact",  label: "Contact",              path: "/contact" },
];

function TopNav({ page, onNav }) {
  return (
    <header className="tl-topbar">
      <div className="tl-topbar__inner">
        <a className="tl-logo" onClick={() => onNav("home")} href="#" aria-label="TransLine49° home">
          <Logomark />
          <span>TransLine<span className="tl-logo__deg">49°</span></span>
        </a>
        <nav>
          <ul className="tl-nav-list">
            {NAV_ITEMS.map((n) => (
              <li key={n.id}>
                <a href="#" aria-current={page === n.id ? "page" : undefined}
                   onClick={(e) => { e.preventDefault(); onNav(n.id); }}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="tl-topbar__cta">
          <span className="tl-callphone tl-mono">
            <strong>(314) 934-2133</strong>
          </span>
          <button className="tl-btn tl-btn--primary" onClick={() => onNav("contact")}>
            Start a Project <span className="tl-btn-arr">→</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function Logomark({ size = 30 }) {
  // Real diamond/road-sign logo — clay-colored rhombus with N arrow + text
  return (
    <img src="logo.png" alt="TransLine49°"
         width={size} height={size}
         style={{ display: "block", flexShrink: 0 }} />
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────
function SiteFooter({ onNav }) {
  return (
    <footer className="tl-footer">
      <div className="tl-footer__top">
        <div>
          <ParallelRule light label="49°N · CROSS-BORDER" note="EST. ST. LOUIS, MO" />
          <h3 className="tl-footer__big" style={{ marginTop: 28 }}>
            Have a cross-border<br/>waste project?
          </h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
            <button className="tl-btn tl-btn--primary" onClick={() => onNav("contact")}>
              Start a Project <span className="tl-btn-arr">→</span>
            </button>
            <a className="tl-btn tl-btn--ghost-light" href="tel:+13149342133">
              Call (314) 934-2133
            </a>
          </div>
        </div>
        <div>
          <h4>Services</h4>
          <ul>
            <li onClick={() => onNav("services")}>Cross-Border Waste Movement</li>
            <li onClick={() => onNav("services")}>Hazardous Waste Permitting</li>
            <li onClick={() => onNav("services")}>Logistics Coordination</li>
            <li onClick={() => onNav("services")}>Disposal &amp; Recycling Access</li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li onClick={() => onNav("about")}>About / Network</li>
            <li onClick={() => onNav("process")}>Cross-Border Process</li>
            <li onClick={() => onNav("contact")}>Contact</li>
            <li>Miller Environmental Corp.</li>
          </ul>
        </div>
        <div>
          <h4>Office</h4>
          <ul>
            <li style={{ cursor: "default" }}>231 S. Bemiston Ave.</li>
            <li style={{ cursor: "default" }}>Suite 800</li>
            <li style={{ cursor: "default" }}>Clayton, MO 63105</li>
            <li style={{ cursor: "default" }}>(314) 934-2133</li>
          </ul>
        </div>
      </div>
      <div className="tl-footer__bot">
        <span>© 2026 TRANSLINE49° ENVIRONMENTAL SERVICES · ALL RIGHTS RESERVED</span>
        <span>U.S.–CANADA TRANSBOUNDARY WASTE · A WHITE OWL FAMILY OFFICE COMPANY</span>
      </div>
    </footer>
  );
}

// ─── Marquee ──────────────────────────────────────────────────────────────
function Marquee({ items }) {
  // Duplicate the list so the loop is seamless
  const doubled = [...items, ...items];
  return (
    <div className="tl-marquee" role="presentation">
      <div className="tl-marquee__track">
        {doubled.map((t, i) => (
          <React.Fragment key={i}>
            <span>{t}</span>
            <span className="dot">·</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ─── PageHero — used by all secondary pages ───────────────────────────────
function PageHero({ eyebrow, title, lead, photo, variant = "photo", ctas = null, meta = null }) {
  return (
    <section className="tl-hero" data-variant={variant}>
      <HeroPhoto src={photo} variant={variant} />
      {variant === "map" && (
        <div style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.55 }}>
          <BorderMap height="100%" />
        </div>
      )}
      <div className="tl-container tl-hero__inner">
        <div className="tl-hero__rule">
          <span className="tl-parallel__tick" style={{ borderColor: "rgba(101,183,65,0.8)" }} />
          <span className="tl-mono">{eyebrow}</span>
          <span className="tl-parallel__line" style={{ background: "linear-gradient(to right, rgba(101,183,65,0.4), transparent)" }} />
        </div>
        <h1 className="tl-display tl-display--xl tl-hero__title">{title}</h1>
        {lead && <p className="tl-lead tl-hero__lead">{lead}</p>}
        {ctas && <div className="tl-hero__ctas">{ctas}</div>}
      </div>
      {meta && (
        <div className="tl-container tl-hero__meta">
          {meta.map((m, i) => (
            <span key={i}><strong>{m.k}</strong>{m.v}</span>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Service card ─────────────────────────────────────────────────────────
function ServiceCard({ num, title, body, icon, onClick }) {
  return (
    <div className="tl-svccard" onClick={onClick}>
      <div className="tl-svccard__icon">{icon}</div>
      <div className="tl-svccard__num">{num}</div>
      <h3 className="tl-svccard__title">{title}</h3>
      <p className="tl-svccard__body">{body}</p>
      <div className="tl-svccard__more">Learn more <span className="arr">→</span></div>
    </div>
  );
}

// Tiny inline icons — line style, single stroke, fits brand
function Icon({ name }) {
  const props = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "border":
      return (<svg {...props}><path d="M3 12h18" strokeDasharray="2 3" /><path d="M6 6l-2 6 2 6" /><path d="M18 6l2 6-2 6" /></svg>);
    case "permit":
      return (<svg {...props}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 7h6M9 11h6M9 15h4" /></svg>);
    case "truck":
      return (<svg {...props}><rect x="2" y="7" width="11" height="9" rx="1" /><path d="M13 10h4l3 3v3h-7" /><circle cx="6" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></svg>);
    case "recycle":
      return (<svg {...props}><path d="M7 6l3-3h4l3 3" /><path d="M21 12l-3 5h-5" /><path d="M3 12l3-5h5" /><path d="M9 17l-2 2 2 2" /><path d="M14 22l4-3-4-3" /></svg>);
    case "north":
      return (<svg {...props}><circle cx="12" cy="12" r="9" /><path d="M9 16l3-10 3 10-3-3z" /></svg>);
    case "phone":
      return (<svg {...props}><path d="M5 3h3l2 5-3 2c1 3 3 5 6 6l2-3 5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z" /></svg>);
    case "doc":
      return (<svg {...props}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /></svg>);
    case "chevron":
      return (<svg {...props}><path d="M9 6l6 6-6 6" /></svg>);
    default:
      return null;
  }
}

// ─── Trust bar ────────────────────────────────────────────────────────────
function TrustBar({ items }) {
  return (
    <div className="tl-trustbar" data-reveal-stagger>
      {items.map((it, i) => (
        <div className="tl-trustbar__item" key={i}>
          <div className="tl-trustbar__label">{it.k}</div>
          <div className="tl-trustbar__value">{it.v}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────
function SectionHead({ eyebrow, title, lead, right = null }) {
  return (
    <div data-reveal style={{ display: "grid", gridTemplateColumns: right ? "1fr auto" : "1fr", gap: 32, alignItems: "end", marginBottom: 40 }}>
      <div>
        <ParallelRule label={eyebrow} />
        <h2 className="tl-display tl-display--l" style={{ marginTop: 24, maxWidth: "20ch" }}>{title}</h2>
        {lead && <p className="tl-lead" style={{ marginTop: 16 }}>{lead}</p>}
      </div>
      {right}
    </div>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────
function FAQ({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="tl-faq">
      {items.map((it, i) => (
        <div className="tl-faq__item" key={i} data-open={open === i ? "1" : "0"}
             onClick={() => setOpen(open === i ? -1 : i)}>
          <div className="tl-faq__row">
            <span className="tl-faq__num">{String(i + 1).padStart(2, "0")}</span>
            <span className="tl-faq__q">{it.q}</span>
            <span className="tl-faq__toggle">+</span>
          </div>
          <div className="tl-faq__a">{it.a}</div>
        </div>
      ))}
    </div>
  );
}

// Export everything to window so peer Babel scripts can use them.
Object.assign(window, {
  TL_PHOTOS,
  ParallelRule, BorderMap, HeroPhoto,
  TopNav, Logomark, SiteFooter, Marquee,
  PageHero, ServiceCard, Icon, TrustBar, SectionHead, FAQ,
  NAV_ITEMS,
});
