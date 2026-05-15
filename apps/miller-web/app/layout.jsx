import "@white-owl/brand/styles/globals.css";
import "./globals.css";
import { ScrollReveal } from "@white-owl/brand/components";

// Tweaks panel is dev-only. Import-site gate via top-level await so the
// module is omitted from the production bundle entirely.
const SiteTweaksProvider =
  process.env.NODE_ENV !== "production"
    ? (await import("@white-owl/brand/tweaks")).SiteTweaksProvider
    : null;

export const metadata = {
  title: {
    default: "Miller Environmental — Hazardous Waste Management",
    template: "%s · Miller Environmental",
  },
  description:
    "Miller Environmental is a Manitoba-based hazardous waste management company with three ISO certifications and over 25 years of operating history.",
  metadataBase: new URL("https://millerenvironmental.ca"),
  openGraph: {
    type: "website",
    title: "Miller Environmental",
    description:
      "Hazardous waste management, environmental remediation, and 24/7 emergency response across Western Canada.",
    images: ["/miller/logo/miller-logomark.webp"],
  },
  twitter: { card: "summary" },
  icons: { icon: "/miller/logo/miller-logomark.webp" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#06141B",
};

// Production loads Geist + Geist Mono only (see design spec §4.3). Alternate
// families are dev-only via NEXT_PUBLIC_FONTS=all — to be implemented in a
// later phase if needed.
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?" +
  "family=Geist:wght@300;400;500;600;700&" +
  "family=Geist+Mono:wght@400;500;600&display=swap";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-brand="miller" data-palette="deep" data-type="utility" data-density="regular">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={FONTS_HREF} rel="stylesheet" />
      </head>
      <body>
        <a className="tl-skip" href="#main">Skip to content</a>
        <div className="tl-shell">
          {/* TopNav + SiteFooter are phase-02 work. Placeholders below keep
              the skeleton renderable. */}
          <header className="tl-container" style={{ padding: "20px 0" }}>
            <strong>Miller Environmental</strong>
          </header>
          <main id="main" tabIndex={-1}>{children}</main>
          <footer className="tl-container" style={{ padding: "40px 0", color: "var(--c-ink-3)" }}>
            <small>© Miller Environmental — site in development.</small>
          </footer>
        </div>
        <ScrollReveal />
        {SiteTweaksProvider && <SiteTweaksProvider namespace="tweaks:miller" />}
      </body>
    </html>
  );
}
