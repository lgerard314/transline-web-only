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

  // Apply tweaks to <html> root attrs (CSS variables react)
  appUseEffect(() => {
    document.documentElement.setAttribute("data-palette", t.palette);
    document.documentElement.setAttribute("data-type", t.typePairing);
    document.documentElement.setAttribute("data-density", t.density);
  }, [t.palette, t.typePairing, t.density]);

  // Drive the document title from the current route (was previously baked
  // into the BrowserShell mock chrome).
  appUseEffect(() => {
    document.title = PAGE_TITLES[page] || PAGE_TITLES.home;
  }, [page]);

  // Scroll-reveal: observe all [data-reveal] / [data-reveal-stagger]
  // elements against the viewport (window) and toggle data-in=1.
  appUseEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.setAttribute("data-in", "1");
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    const attach = () => {
      const els = document.querySelectorAll("[data-reveal], [data-reveal-stagger]");
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
    // scroll the window to top
    setTimeout(() => { window.scrollTo({ top: 0 }); }, 10);
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
      <div className="tl-shell" key={page}>
        <TopNav page={page} onNav={onNav} />
        <main id="tl-main">{renderPage()}</main>
        <SiteFooter onNav={onNav} />
      </div>

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

// Mount
const rootEl = document.getElementById("root");
ReactDOM.createRoot(rootEl).render(<App />);
