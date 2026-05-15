// Hero background photo. CSS fallback gradient lives in the variant class
// so the element is non-empty even if the image fails to load.
export function HeroPhoto({ src, variant }) {
  const style = src && variant === "photo" ? { backgroundImage: `url(${src})` } : undefined;
  return <div className="tl-hero__photo" style={style} />;
}
