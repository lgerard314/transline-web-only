// Brand logomark — clay rhombus + N arrow + text, served from /public/logo.png.
// Plain <img> rather than next/image to keep header rendering simple and
// avoid layout shift while next/image computes intrinsic sizes.
export function Logomark({ size = 30 }) {
  return (
    <img
      src="/logo.png"
      alt="TransLine49°"
      width={size}
      height={size}
      style={{ display: "block", flexShrink: 0 }}
    />
  );
}
