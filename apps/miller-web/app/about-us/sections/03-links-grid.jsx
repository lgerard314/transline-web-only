import Link from "next/link";
import { ABOUT_INDEX } from "@/lib/content/about-index";

export function LinksGridSection() {
  return (
    <section style={{ marginTop: "var(--space-7)" }}>
      <h3 className="tl-display tl-display--xs" style={{ marginBottom: 16 }}>
        Explore the About section
      </h3>
      <ul>
        {ABOUT_INDEX.subPages.map((p) => (
          <li key={p.href}>
            <Link href={p.href}>{p.label} →</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
