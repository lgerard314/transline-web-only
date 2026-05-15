// Miller logomark — 30 px image served from the local /miller/logo/ public
// directory (the real WebP asset shipped with phase 01). Intentional plain
// <img> rather than next/image: the logo is small and not LCP-critical, so
// the next/image runtime cost would not buy any measurable win.
export function Logomark({ size = 30 }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/miller/logo/miller-logomark.webp"
      alt="Miller Environmental"
      width={size}
      height={size}
      style={{ display: "block", flexShrink: 0 }}
    />
  );
}
