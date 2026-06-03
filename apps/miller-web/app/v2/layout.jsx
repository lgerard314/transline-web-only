import "./v2.css";
import { MxReveal } from "./_components/MxReveal";
import { MxParallax } from "./_components/MxParallax";

// /v2 renders UNDER the app root layout (app/layout.jsx), which already
// supplies <html>/<body>, TopNav, EmergencyBanner (off on /v2), SiteFooter,
// <main id="main">, and the global MillerScrollReveal/MillerParallax drivers.
// This nested layout only adds the page-local stylesheet, noindex metadata,
// and the page-local motion drivers (which read data-mx-* only). It must NOT
// emit <html>, <body>, or <main>.
export const metadata = {
  title: "Miller Environmental — (preview)",
  robots: { index: false, follow: false },
  alternates: { canonical: "/v2" },
};

export default function V2Layout({ children }) {
  return (
    <div className="mx-page">
      {children}
      <MxReveal />
      <MxParallax />
    </div>
  );
}
