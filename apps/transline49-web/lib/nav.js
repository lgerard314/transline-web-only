// Primary site nav. The pathname → id map drives current-page highlighting
// on both desktop and mobile nav. Order here is the order rendered.
export const NAV_ITEMS = [
  { id: "home",     label: "Home",                 path: "/" },
  { id: "services", label: "Services",             path: "/services" },
  { id: "process",  label: "Cross-Border Process", path: "/cross-border-process" },
  { id: "about",    label: "About",                path: "/about" },
  { id: "contact",  label: "Contact",              path: "/contact" },
];

export function pageIdFromPath(pathname) {
  const match = NAV_ITEMS.find((n) => n.path === pathname);
  return match ? match.id : "home";
}
