// L1 · download-card-01 — certification download card (mw-cert). Renders the
// ISO/COR display logic verbatim. Must be a direct child of the stagger row,
// so it returns the <a> itself (no wrapper).
export function DownloadCard01({ cert }) {
  const isISO = cert.name.startsWith("ISO");
  const display = isISO ? cert.name.replace(/^ISO\s+/, "").split(":")[0] : "COR";
  const prefix = isISO ? "ISO" : "MHCA";
  return (
    <a
      href={cert.href}
      download
      className="mw-cert"
      role="listitem"
      aria-label={`Download ${cert.name} certificate, ${cert.sizeKB} KB PDF`}
    >
      <img className="mw-cert__mark" src={cert.mark} alt="" aria-hidden="true" loading="lazy" />
      <span className="mw-cert__body">
        <span className="mw-cert__prefix">{prefix}&nbsp;·&nbsp;{cert.year}</span>
        <span className="mw-cert__num">{display}</span>
        <span className="mw-cert__desc">{cert.long}</span>
        <span className="mw-cert__pdf">
          <span>PDF · {cert.sizeKB}KB</span>
          <span className="mw-cert__arr" aria-hidden="true">↓</span>
        </span>
      </span>
    </a>
  );
}
