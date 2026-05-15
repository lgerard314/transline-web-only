// Family-of-Companies footer strip — shared cross-link between the
// White Owl Family Office Group sites. Renders three brand entries:
// Miller Environmental, TransLine49° Environmental Services, Miller
// Waste Systems, under a "Part of the White Owl Family Office Group"
// header.
//
// Consumers pass `current="miller" | "tl49" | "mws"` so the current
// site renders bolded (and unlinked — it's where you already are).
// Internal links use a plain anchor (cross-origin) with rel="noreferrer
// noopener".

const ENTRIES = [
  {
    id: "miller",
    label: "Miller Environmental",
    href: "https://millerenvironmental.ca",
  },
  {
    id: "tl49",
    label: "TransLine49° Environmental Services",
    href: "https://transline49.com",
  },
  {
    id: "mws",
    label: "Miller Waste Systems",
    href: "https://millerwastesystems.com",
  },
];

export function FamilyOfCompanies({ current }) {
  return (
    <div
      className="tl-family"
      role="region"
      aria-label="Part of the White Owl Family Office Group"
      data-current={current || ""}
    >
      <p className="tl-family__head tl-mono">
        Part of the White Owl Family Office Group
      </p>
      <ul className="tl-family__list">
        {ENTRIES.map((e) => {
          const isCurrent = e.id === current;
          return (
            <li key={e.id} className="tl-family__item">
              {isCurrent ? (
                <strong className="tl-family__current" aria-current="page">
                  {e.label}
                </strong>
              ) : (
                <a
                  className="tl-family__link"
                  href={e.href}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {e.label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
