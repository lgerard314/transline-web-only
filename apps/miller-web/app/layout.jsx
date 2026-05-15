import "@white-owl/brand/styles/globals.css";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { ScrollReveal } from "@white-owl/brand/components";
import { cookies, headers } from "next/headers";
import { TopNav } from "../components/TopNav";
import { SiteFooter } from "../components/SiteFooter";
import { EmergencyBanner } from "../components/EmergencyBanner";
import { BannerRouteGate } from "../components/BannerRouteGate";
import { OVER_25_YEARS } from "../lib/content/brand";
import { shouldShowEmergencyBanner } from "../lib/nav";

// Self-host Geist + Geist Mono via next/font/google. Replaces the
// render-blocking Google Fonts stylesheet link (Lighthouse called it
// out as ~800ms LCP hit on slow 4G mobile). next/font emits the font
// files from the same origin, preloads only the subsets we use, and
// applies font-display: swap so text isn't blocked on font load.
const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-geist",
  display: "swap",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-geist-mono",
  display: "swap",
});

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


export default async function RootLayout({ children }) {
  // Cookie-gated SSR initial state for the EmergencyBanner so dismissals
  // don't flash on re-paint.
  const cookieStore = await cookies();
  const ebDismissed = cookieStore.get("miller_eb_dismissed")?.value === "1";

  // Server-side per-route banner gating so non-allowlisted routes don't
  // flash the banner on first paint before the client gate runs. Next.js
  // exposes the active pathname on the `next-url` request header.
  const hdrs = await headers();
  const pathname = hdrs.get("next-url") || hdrs.get("x-invoke-path") || "/";
  const bannerOn = shouldShowEmergencyBanner(pathname);

  return (
    <html
      lang="en"
      data-brand="miller"
      data-palette="deep"
      data-type="utility"
      data-density="regular"
      className={`${geist.variable} ${geistMono.variable}`}
    >
      {/* Server-rendered banner gate via next-url header. The client
          BannerRouteGate keeps the attribute in sync on client-side
          navigations (no full re-render). */}
      <body data-banner={bannerOn ? "on" : "off"}>
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
