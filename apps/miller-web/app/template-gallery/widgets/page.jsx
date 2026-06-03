import "./../../template-testing/template-testing.css";
import "./../template-gallery.css";
import { Gallery } from "./../gallery";

export const metadata = { title: "Template gallery · Widgets", robots: { index: false, follow: false } };

export default function WidgetsGalleryPage() {
  return <Gallery active="widgets" />;
}
