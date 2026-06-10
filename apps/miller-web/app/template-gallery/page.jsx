// /template-gallery — internal, noindex showcase of every components-v2 section
// template at true site width with placeholder content and live config toggles.
// Thin server shell: sets metadata, pulls in the scheme/layout variant CSS
// (dark/cream/reverse live in template-testing.css), and mounts the client gallery.
import "./../template-testing/template-testing.css";
import "./home-legacy.css";
import "./template-gallery.css";
import { Gallery } from "./gallery";

export const metadata = { title: "Template gallery · Sections", robots: { index: false, follow: false } };

export default function TemplateGalleryPage() {
  return <Gallery active="sections" />;
}
