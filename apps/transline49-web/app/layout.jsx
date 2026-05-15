import "./globals.css";
import { TopNav } from "@/components/TopNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SiteTweaksProvider } from "@/components/tweaks/SiteTweaksProvider";

export const metadata = {
  title: {
    default: "TransLine49° — Cross-Border Waste Disposal & Recycling",
    template: "%s · TransLine49°",
  },
  description:
    "TransLine49° Environmental Services moves hazardous and non-hazardous waste from the U.S. into Canada — cross-border permitting, logistics, disposal & recycling access. Based in St. Louis, MO.",
  metadataBase: new URL("https://transline49.com"),
  openGraph: {
    type: "website",
    title: "TransLine49° — Cross-Border Waste, Handled.",
    description:
      "U.S. → Canada transboundary waste services: hazardous waste permitting, logistics coordination, disposal & recycling pathways.",
    images: ["/logo.png"],
  },
  twitter: { card: "summary" },
  icons: { icon: "/logo.png" },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0B1F2A",
};

// Five-family Google Fonts request. The CSS uses var(--font-*) tokens whose
// values are set by globals.css per data-type attribute on <html>.
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?" +
  "family=Geist:wght@300;400;500;600;700&" +
  "family=Geist+Mono:wght@400;500;600&" +
  "family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&" +
  "family=Manrope:wght@400;500;600;700&" +
  "family=Funnel+Display:wght@400;500;600;700&" +
  "family=JetBrains+Mono:wght@400;500&display=swap";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-palette="clay" data-type="utility" data-density="regular">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link href={FONTS_HREF} rel="stylesheet" />
      </head>
      <body>
        <a className="tl-skip" href="#tl-main">Skip to content</a>
        <div className="tl-shell">
          <TopNav />
          <main id="tl-main">{children}</main>
          <SiteFooter />
        </div>
        <ScrollReveal />
        <SiteTweaksProvider />
      </body>
    </html>
  );
}
