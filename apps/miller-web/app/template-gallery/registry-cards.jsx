// 03_cards gallery entries. Feature/industry cards are grid cells with no intrinsic
// height (or a fixed aspect), so each render thunk supplies a representative sized
// wrapper (and the required ancestor classes / <ul> where the card returns an <li>).

import { IconLink01 } from "@/components-v2/03_cards/icon-link/icon-link-01";
import { FeatureAnchor01 } from "@/components-v2/03_cards/feature/feature-anchor-01";
import { FeatureCard01 } from "@/components-v2/03_cards/feature/feature-card-01";
import { FeatureTile01 } from "@/components-v2/03_cards/feature/feature-tile-01";
import { NoteCard01 } from "@/components-v2/03_cards/note/note-card-01";
import { DownloadCard01 } from "@/components-v2/03_cards/download/download-card-01";
import { CaseCard01 } from "@/components-v2/03_cards/ind/case-card-01";
import { IndGalleryCard01 } from "@/components-v2/03_cards/ind/ind-gallery-card-01";
import { IndThumbCard01 } from "@/components-v2/03_cards/ind/ind-thumb-card-01";
import { WwdCard01 } from "@/components-v2/03_cards/ind/wwd-card-01";

const ulBare = { display: "block", margin: 0, padding: 0, listStyle: "none" };

export const CARDS = [
  // ── Feature cards (photo grid cells — need explicit width + height) ──
  {
    group: "Feature cards",
    name: "FeatureAnchor01",
    path: "components-v2/03_cards/feature/feature-anchor-01.jsx",
    canvas: { surface: "dark", note: "The large hero cell of the bento grid." },
    controls: [{ key: "n", label: "n", options: [{ label: "01", value: { n: 1 } }, { label: "02", value: { n: 2 } }] }],
    render: (cfg) => (
      <div style={{ width: "min(640px, 100%)", height: 460 }}>
        <FeatureAnchor01 n={cfg.n ?? 1} service={{ slug: "service-one", title: "Feature Service Alpha", summary: "Placeholder summary describing the headline feature service in one or two sentences.", photo: "/miller/services/industrial-waste-treatment-hero.webp" }} />
      </div>
    ),
  },
  {
    group: "Feature cards",
    name: "FeatureCard01",
    path: "components-v2/03_cards/feature/feature-card-01.jsx",
    canvas: { surface: "dark" },
    controls: [],
    render: () => (
      <div style={{ width: "min(440px, 100%)", height: 280 }}>
        <FeatureCard01 n={2} service={{ slug: "service-two", title: "Feature Service Beta", summary: "Placeholder summary for a supporting feature card.", photo: "/miller/services/remediation-contaminated-soil.webp" }} />
      </div>
    ),
  },
  {
    group: "Feature cards",
    name: "FeatureTile01",
    path: "components-v2/03_cards/feature/feature-tile-01.jsx",
    canvas: { surface: "dark" },
    controls: [{ key: "external", label: "Mode", options: [{ label: "Internal", value: {} }, { label: "External", value: { external: true } }] }],
    render: (cfg) => (
      <div style={{ width: "min(380px, 100%)", height: 280 }}>
        {cfg.external ? (
          <FeatureTile01 external n={7} href="#" photo="/miller/services/vacuum-truck-hero.webp" titleLines={["Cross-Border", "Services"]} summary="Placeholder summary for the external tile that links offsite." />
        ) : (
          <FeatureTile01 n={4} service={{ slug: "service-four", title: "Feature Tile Delta", summary: "Placeholder summary for a standard feature tile.", photo: "/miller/services/vacuum-truck-hero.webp" }} />
        )}
      </div>
    ),
  },

  // ── Industry cards (ind/*) ──
  {
    group: "Industry cards",
    name: "IndThumbCard01",
    path: "components-v2/03_cards/ind/ind-thumb-card-01.jsx",
    canvas: { surface: "light", note: "Needs the mw-svc-inds--photo ancestor for its photo-left layout." },
    controls: [{ key: "multiline", label: "Name", options: [{ label: "Two-line", value: { multiline: true } }, { label: "One-line", value: {} }] }],
    render: (cfg) => (
      <div className="mw-svc-inds mw-svc-inds--photo" style={{ background: "transparent" }}>
        <ul className="mw-svc-inds__grid" style={{ ...ulBare, width: 360 }}>
          <IndThumbCard01 item={{ name: cfg.multiline ? "Chemical\nspills" : "Chemical spills", blurb: "Placeholder one-line response description.", photo: "/miller/chemical-spills.png" }} />
        </ul>
      </div>
    ),
  },
  {
    group: "Industry cards",
    name: "IndGalleryCard01",
    path: "components-v2/03_cards/ind/ind-gallery-card-01.jsx",
    canvas: { surface: "light" },
    controls: [],
    render: () => (
      <ul className="mw-svc-inds__grid" style={{ ...ulBare, width: 260 }}>
        <IndGalleryCard01 item={{ name: "Sample Sector", blurb: "Placeholder one-line sector blurb.", photo: "/miller/who-we-serve-industries/mining.png" }} />
      </ul>
    ),
  },
  {
    group: "Industry cards",
    name: "WwdCard01",
    path: "components-v2/03_cards/ind/wwd-card-01.jsx",
    canvas: { surface: "light", note: "Hover or focus to swap the blurb for the full detail." },
    controls: [],
    render: () => (
      <ul style={{ ...ulBare, width: 380 }}>
        <WwdCard01 item={{ name: "Capability One", blurb: "Short rest-state blurb shown before hover.", detail: "Longer placeholder paragraph revealed on hover or focus, describing the capability in a couple of sentences.", photo: "/miller/what-we-do/contaminated-soil-remediation.png" }} />
      </ul>
    ),
  },
  {
    group: "Industry cards",
    name: "CaseCard01",
    path: "components-v2/03_cards/ind/case-card-01.jsx",
    canvas: { surface: "light" },
    controls: [],
    render: () => (
      <ul className="mw-svc-inds__grid" style={{ ...ulBare, width: 320 }}>
        <CaseCard01 item={{ href: "#", title: "Sample Case Study One", location: "Sample Location, MB", photo: "/miller/case-studies/grain-elevator-arsenic.webp", desc: "Placeholder one-sentence summary of the case study outcome." }} />
      </ul>
    ),
  },

  // ── Other cards ──
  {
    group: "Other cards",
    name: "NoteCard01",
    path: "components-v2/03_cards/note/note-card-01.jsx",
    canvas: { surface: "dark", note: "Cream-on-walnut — built for the dark careers band." },
    controls: [],
    render: () => (
      <div className="mw-careers" style={{ padding: 28, maxWidth: 520, width: "100%" }}>
        <NoteCard01 tag="Placeholder tag" title="Placeholder card title" text="Placeholder body copy describing this note card in a sentence or two of generic filler." cta={{ label: "Placeholder link", href: "#" }} />
      </div>
    ),
  },
  {
    group: "Other cards",
    name: "DownloadCard01",
    path: "components-v2/03_cards/download/download-card-01.jsx",
    canvas: { surface: "light" },
    controls: [{ key: "kind", label: "Kind", options: [{ label: "ISO", value: { kind: "iso" } }, { label: "COR", value: { kind: "cor" } }] }],
    render: (cfg) => {
      const cert = cfg.kind === "cor"
        ? { slug: "cor", name: "MHCA COR 2023", year: "2023", long: "Placeholder Safety Recognition", sizeKB: 9, mark: "/miller/certs/mhca-cor-2023.webp", href: "#" }
        : { slug: "iso", name: "ISO 9001:2015", year: "2015", long: "Placeholder Management System", sizeKB: 149, mark: "/miller/certs/iso-9001-2015.webp", href: "#" };
      // .mw-certs is a hard 4-col grid; force a single column so the lone card
      // gets full width (otherwise it collapses to ~80px and only the mark shows).
      return (
        <div className="mw-certs" role="list" style={{ gridTemplateColumns: "1fr", maxWidth: 360, width: "100%" }}>
          <DownloadCard01 cert={cert} />
        </div>
      );
    },
  },
  {
    group: "Other cards",
    name: "IconLink01",
    path: "components-v2/03_cards/icon-link/icon-link-01.jsx",
    canvas: { surface: "light", note: "Inline SVG icon link — inherits currentColor." },
    controls: [],
    render: () => (
      <span style={{ color: "var(--c-ink-2)", display: "inline-flex", gap: 16 }}>
        <IconLink01 label="Placeholder link" href="#" path="M6.5 12.5 2 8l1.4-1.4 3.1 3.1L12.6 3 14 4.4z" />
      </span>
    ),
  },
];
