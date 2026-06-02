// L3 helper · service-order — recreates the home services ordering + title
// split (copied from app/(home)/sections/02-services.jsx, which holds these
// as inline non-exported helpers).
import { SERVICES } from "@/lib/services";
import { HOME_FIRST } from "@/lib/content/template-testing-home";

export function splitTitle(title) {
  const parts = String(title).trim().split(/\s+/);
  if (parts.length <= 1) return { line1: title, line2: null };
  return { line1: parts.slice(0, -1).join(" "), line2: parts[parts.length - 1] };
}

export function homeServiceOrder() {
  const map = new Map(SERVICES.map((s) => [s.slug, s]));
  const head = HOME_FIRST.map((slug) => map.get(slug)).filter(Boolean);
  const rest = SERVICES.filter((s) => !HOME_FIRST.includes(s.slug)).sort((a, b) =>
    a.title.localeCompare(b.title)
  );
  return [...head, ...rest];
}
