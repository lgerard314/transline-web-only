"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Page-local scroll-reveal for /v2. Keys off the page-local data-mx-reveal /
// data-mx-reveal-stagger attributes ONLY, so the global MillerScrollReveal
// (which queries the shared attribute) never matches anything here.
//
// Verbs (set on the element via data-mx-reveal="..."):
//   fade  — opacity + small rise (default for text/leads)
//   line  — per-line mask-rise (wrap lines in .mx-line > .mx-line__in)
//   clip  — clip-path wipe (images)
// Stagger: a [data-mx-reveal-stagger] container cascades its direct children
//   (each gets --mx-i = its index for a step delay). This is the "cards" verb.
//
// On enter, the element/child flips data-mx-in="1"; CSS does the rest.
export function MxReveal() {
  const pathname = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target;
          requestAnimationFrame(() => el.setAttribute("data-mx-in", "1"));
          io.unobserve(el);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );

    const attach = () => {
      document
        .querySelectorAll("[data-mx-reveal], [data-mx-reveal-stagger] > *")
        .forEach((el) => {
          if (el.getAttribute("data-mx-in") !== "1") io.observe(el);
        });
      document.querySelectorAll("[data-mx-reveal-stagger]").forEach((c) => {
        Array.from(c.children).forEach((el, i) =>
          el.style.setProperty("--mx-i", String(i)),
        );
      });
    };

    const t1 = setTimeout(attach, 60);
    const t2 = setTimeout(attach, 300);
    window.addEventListener("load", attach);
    return () => {
      io.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("load", attach);
    };
  }, [pathname]);

  return null;
}
