// app.jsx — TransLine49° site shell
// Loads after components.jsx, page-*.jsx, tweaks-panel.jsx, browser-window.jsx

const { useState: appUseState, useEffect: appUseEffect, useMemo: appUseMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "clay",
  "typePairing": "utility",
  "density": "regular",
  "heroVariant": "photo",
  "heroPhoto": "heroTruck"
}/*EDITMODE-END*/;

// Page id → URL slug
const PAGE_URLS = {
  home:     "transline49.com/",
  services: "transline49.com/services",
  process:  "transline49.com/cross-border-process",
  about:    "transline49.com/about",
  contact:  "transline49.com/contact",
};
const PAGE_TITLES = {
  home:     "TransLine49° — Cross-Border Waste",
  services: "Services · TransLine49°",
  process:  "Cross-Border Process · TransLine49°",
  about:    "About · TransLine49°",
  contact:  "Contact · TransLine49°",
};

function App() {
  const [page, setPage] = appUseState("home");
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const scrollRef = React.useRef(null);

  // Apply tweaks to <html> root attrs (CSS variables react)
  appUseEffect(() => {
    document.documentElement.setAttribute("data-palette", t.palette);
    document.documentElement.setAttribute("data-type", t.typePairing);
    document.documentElement.setAttribute("data-density", t.density);
  }, [t.palette, t.typePairing, t.density]);

  // Scroll-reveal: observe all [data-reveal] / [data-reveal-stagger]
  // elements inside the inner scroll container and toggle data-in=1.
  appUseEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.setAttribute("data-in", "1");
          io.unobserve(e.target);
        }
      }
    }, { root, threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    const attach = () => {
      const els = root.querySelectorAll("[data-reveal], [data-reveal-stagger]");
      els.forEach((el) => {
        if (el.getAttribute("data-in") !== "1") io.observe(el);
      });
    };
    // Re-scan on route change — give React a tick to commit
    const t1 = setTimeout(attach, 60);
    const t2 = setTimeout(attach, 220);
    return () => { io.disconnect(); clearTimeout(t1); clearTimeout(t2); };
  }, [page]);

  const onNav = (id) => {
    setPage(id);
    // scroll the content area to top
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      window.scrollTo({ top: 0 });
    }, 10);
  };

  const renderPage = () => {
    const props = { onNav, tweaks: t };
    switch (page) {
      case "home":     return <HomePage {...props} />;
      case "services": return <ServicesPage {...props} />;
      case "process":  return <ProcessPage {...props} />;
      case "about":    return <AboutPage {...props} />;
      case "contact":  return <ContactPage {...props} />;
      default:         return <HomePage {...props} />;
    }
  };

  // Photo options for the hero tweak
  const HERO_PHOTOS = [
    { value: "heroTruck",      label: "Trucks at depot" },
    { value: "heroDrums",      label: "Bulk material" },
    { value: "heroIndustrial", label: "Industrial smokestacks" },
    { value: "heroBorder",     label: "Container yard" },
    { value: "heroPort",       label: "Port containers" },
    { value: "heroRefinery",   label: "Smokestacks (sunset)" },
  ];

  return (
    <>
      <BrowserShell url={PAGE_URLS[page]} title={PAGE_TITLES[page]} scrollRef={scrollRef}>
        <div className="tl-shell" key={page}>
          <TopNav page={page} onNav={onNav} />
          {renderPage()}
          <SiteFooter onNav={onNav} />
        </div>
      </BrowserShell>

      <TweaksPanel title="Site Tweaks">
        <TweakSection label="Color palette">
          <PaletteChips value={t.palette} onChange={(v) => setTweak("palette", v)} />
        </TweakSection>

        <TweakSection label="Typography">
          <TweakSelect
            label="Pairing"
            value={t.typePairing}
            options={[
              { value: "utility",   label: "Utility (Geist + Geist Mono)" },
              { value: "editorial", label: "Editorial (Newsreader + Geist)" },
              { value: "grotesk",   label: "Grotesk (Funnel + Manrope)" },
            ]}
            onChange={(v) => setTweak("typePairing", v)}
          />
        </TweakSection>

        <TweakSection label="Density">
          <TweakRadio
            label="Spacing"
            value={t.density}
            options={["compact", "regular", "spacious"]}
            onChange={(v) => setTweak("density", v)}
          />
        </TweakSection>

        <TweakSection label="Hero">
          <TweakRadio
            label="Variant"
            value={t.heroVariant}
            options={[
              { value: "photo",    label: "Photo" },
              { value: "map",      label: "Map" },
              { value: "abstract", label: "Abstract" },
            ]}
            onChange={(v) => setTweak("heroVariant", v)}
          />
          {t.heroVariant === "photo" && (
            <TweakSelect
              label="Photo"
              value={t.heroPhoto}
              options={HERO_PHOTOS}
              onChange={(v) => setTweak("heroPhoto", v)}
            />
          )}
        </TweakSection>

        <TweakSection label="Quick nav">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {NAV_ITEMS.map((n) => (
              <button key={n.id}
                      className="twk-btn secondary"
                      style={{ fontSize: 11, padding: "0 8px",
                               background: page === n.id ? "rgba(0,0,0,.78)" : undefined,
                               color: page === n.id ? "#fff" : undefined }}
                      onClick={() => onNav(n.id)}>
                {n.label}
              </button>
            ))}
          </div>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

// ─── BrowserShell: thin wrapper around ChromeWindow, full-viewport ─────────
function BrowserShell({ url, title, children, scrollRef }) {
  // Mostly mirrors browser-window.jsx but lets us size to viewport.
  const C = { barBg: "#202124", tabBg: "#35363a", text: "#e8eaed", dim: "#9aa0a6", urlBg: "#282a2d" };
  return (
    <div style={{
      width: "100vw", height: "100vh", overflow: "hidden",
      background: "#1a1a1a", display: "flex", flexDirection: "column",
    }}>
      {/* Tab bar */}
      <div style={{ display: "flex", alignItems: "center", height: 38, background: C.barBg, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 8, padding: "0 14px" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", height: "100%", paddingLeft: 4, flex: 1 }}>
          <div style={{
            position: "relative", height: 30, alignSelf: "flex-end",
            padding: "0 14px", display: "flex", alignItems: "center", gap: 8,
            background: C.tabBg, borderRadius: "8px 8px 0 0", minWidth: 240, maxWidth: 340,
            fontFamily: "system-ui, sans-serif", fontSize: 12, color: C.text,
          }}>
            <img src="logo.png" alt="" width="14" height="14" style={{ display: "block", flexShrink: 0 }} />
            <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {title}
            </span>
            <span style={{ color: C.dim, fontSize: 12 }}>×</span>
          </div>
          <div style={{ width: 28, height: 24, display: "flex", alignItems: "center", justifyContent: "center", color: C.dim }}>+</div>
        </div>
      </div>
      {/* URL bar */}
      <div style={{ height: 40, background: C.tabBg, display: "flex", alignItems: "center",
                    gap: 4, padding: "0 8px", flexShrink: 0 }}>
        <BrowserIcon d="M15 18l-6-6 6-6" />
        <BrowserIcon d="M9 6l6 6-6 6" muted />
        <BrowserIcon d="M4 12a8 8 0 0 1 14-5l2-2v6h-6l2-2a6 6 0 1 0 1 5" />
        <div style={{
          flex: 1, height: 30, borderRadius: 15, background: C.urlBg,
          display: "flex", alignItems: "center", gap: 10, padding: "0 14px", margin: "0 6px",
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.dim}
               strokeWidth="2" strokeLinecap="round">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          <span style={{ flex: 1, color: C.text, fontSize: 13, fontFamily: "system-ui, sans-serif" }}>
            {url}
          </span>
          <span style={{ color: C.dim, fontSize: 13 }}>↻</span>
        </div>
        <BrowserIcon d="M12 2a10 10 0 1 1-10 10A10 10 0 0 1 12 2z" />
      </div>

      {/* Content — scrollable, fills rest */}
      <div ref={scrollRef} style={{ flex: 1, overflow: "auto", background: "#fff" }}>
        {children}
      </div>
    </div>
  );
}

// ─── Palette chip picker ────────────────────────────────────────────────────
function PaletteChips({ value, onChange }) {
  const palettes = [
    { id: "clay",     label: "Clay (brand)",   swatches: ["#3B2418", "#6E3D1A", "#A85A2C", "#D89A3F"] },
    { id: "midnight", label: "Midnight",       swatches: ["#0B1F2A", "#174A5C", "#65B741", "#F2A900"] },
    { id: "ironwood", label: "Ironwood",       swatches: ["#1A1A1A", "#383634", "#D27E3A", "#E8C76F"] },
    { id: "deep",     label: "Deep Water",     swatches: ["#06141B", "#0E3A4D", "#2EBFA5", "#E3A857"] },
    { id: "forest",   label: "Forest",         swatches: ["#19281F", "#2D4A38", "#98B765", "#E5A85E"] },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {palettes.map((p) => (
        <button key={p.id} type="button"
                onClick={() => onChange(p.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 8px", borderRadius: 7,
                  border: value === p.id ? "1px solid rgba(0,0,0,0.6)" : "1px solid rgba(0,0,0,0.08)",
                  background: value === p.id ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                  cursor: "pointer", font: "inherit", color: "inherit",
                }}>
          <span style={{ display: "flex", gap: 2 }}>
            {p.swatches.map((c, i) => (
              <span key={i} style={{ width: 14, height: 18, background: c, borderRadius: 2 }} />
            ))}
          </span>
          <span style={{ fontSize: 11.5, fontWeight: 500 }}>{p.label}</span>
          {value === p.id && (
            <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(0,0,0,0.5)" }}>✓</span>
          )}
        </button>
      ))}
    </div>
  );
}

function BrowserIcon({ d, muted }) {
  return (
    <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke={muted ? "rgba(154,160,166,.4)" : "rgba(154,160,166,.85)"}
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
      </svg>
    </div>
  );
}

// Mount
const rootEl = document.getElementById("root");
ReactDOM.createRoot(rootEl).render(<App />);
