import "@white-owl/brand/styles/globals.css";
import "./globals.css";
import { ScrollReveal } from "@white-owl/brand/components";
import { cookies } from "next/headers";
import { TopNav } from "../components/TopNav";
import { SiteFooter } from "../components/SiteFooter";
import { EmergencyBanner } from "../components/EmergencyBanner";
import { BannerRouteGate } from "../components/BannerRouteGate";
import { OVER_25_YEARS } from "../lib/content/brand";

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
  description: `Miller Environmental is a Manitoba-based hazardous waste management company with three ISO certifications and ${OVER_25_YEARS.toLowerCase()} of operating history.`,
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

// Production loads Geist + Geist Mono only (see design spec §4.3).
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?" +
  "family=Geist:wght@300;400;500;600;700&" +
  "family=Geist+Mono:wght@400;500;600&display=swap";

export default async function RootLayout({ children }) {
  // Cookie-gated SSR initial state for the EmergencyBanner so dismissals
  // don't flash on re-paint.
  const cookieStore = await cookies();
  const ebDismissed = cookieStore.get("miller_eb_dismissed")?.value === "1";

  return (
    <html lang="en" data-brand="miller" data-palette="deep" data-type="utility" data-density="regular">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={FONTS_HREF} rel="stylesheet" />
      </head>
      {/* Default banner state = on. Routes that opt out set
          data-banner="off" via a route-segment layout. */}
      <body data-banner="on">
        <a className="tl-skip" href="#main">Skip to content</a>
        <BannerRouteGate />
        <EmergencyBanner initialDismissed={ebDismissed} />
        <TopNav />
        <div className="tl-shell">
          <main id="main" tabIndex={-1}>{children}</main>
          <SiteFooter />
        </div>
        <ScrollReveal />
        {SiteTweaksProvider && <SiteTweaksProvider namespace="tweaks:miller" />}
      </body>
    </html>
  );
}
