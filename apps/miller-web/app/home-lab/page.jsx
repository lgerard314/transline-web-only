import Link from "next/link";
import { HOME_LAB_SECTIONS } from "./registry";

export const metadata = {
  title: "Home lab · Sections",
  robots: { index: false, follow: false },
};

export default function HomeLabIndexPage() {
  return (
    <main className="hl-index">
      <h1>Home section lab</h1>
      <p>
        Render one live home section at a time with production content. Pinned sections include
        extra scroll runway below so pin sequences can release without loading the full page.
      </p>
      <ul>
        {HOME_LAB_SECTIONS.map((s) => (
          <li key={s.slug}>
            <Link href={`/home-lab/${s.slug}`}>
              <span>{s.label}</span>
              <span className="hl-index__pin">{s.pin ? "pinned" : "flow"}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
