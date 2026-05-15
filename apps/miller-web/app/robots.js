// Robots policy — allow all crawlers, point at the sitemap.

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://millerenvironmental.ca/sitemap.xml",
  };
}
