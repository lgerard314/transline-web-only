import "./../../template-testing/template-testing.css";
import "./../template-gallery.css";
import { Gallery } from "./../gallery";

export const metadata = { title: "Template gallery · Buttons", robots: { index: false, follow: false } };

export default function ButtonsGalleryPage() {
  return <Gallery active="buttons" />;
}
