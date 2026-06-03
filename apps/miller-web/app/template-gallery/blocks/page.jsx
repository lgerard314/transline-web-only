import "./../../template-testing/template-testing.css";
import "./../template-gallery.css";
import { Gallery } from "./../gallery";

export const metadata = { title: "Template gallery · Blocks", robots: { index: false, follow: false } };

export default function BlocksGalleryPage() {
  return <Gallery active="blocks" />;
}
