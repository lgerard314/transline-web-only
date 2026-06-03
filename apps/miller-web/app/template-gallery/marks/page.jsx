import "./../../template-testing/template-testing.css";
import "./../template-gallery.css";
import { Gallery } from "./../gallery";

export const metadata = { title: "Template gallery · Marks", robots: { index: false, follow: false } };

export default function MarksGalleryPage() {
  return <Gallery active="marks" />;
}
