// Brand logomark — clay rhombus + N arrow + text, served from /public/logo.png.
// Intentional plain <img> rather than next/image: the logo is small (30px)
// and never above the LCP fold, so we'd pay the next/image runtime cost
// for no real LCP benefit.
export function Logomark({ size = 30 }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="TransLine49°"
      width={size}
      height={size}
      style={{ display: "block", flexShrink: 0 }}
    />
  );
}
