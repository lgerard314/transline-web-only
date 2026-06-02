export function SocialLink01({ label, href, path }) {
  return (
    <a href={href} className="mw-final__social" target="_blank" rel="noopener noreferrer" aria-label={label}>
      <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d={path} />
      </svg>
    </a>
  );
}
