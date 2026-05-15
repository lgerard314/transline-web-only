"use client";
// Drives the scroll-reveal animations defined in globals.css. Any element
// marked [data-reveal] or [data-reveal-stagger] is observed; once it enters
// the viewport (or comes within 400px below it) we set data-in="1" and the
// CSS handles the fade/slide.
//
// The bottom rootMargin extends the trigger BELOW the viewport so animations
// finish before the user can see them — avoids the "partially transparent
// as I scroll past it" effect on mobile.
//
// usePathname() forces a re-scan on every route change since new DOM nodes
// won't have been observed by the previous instance.
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-in", "1");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px 400px 0px" },
    );

    const attach = () => {
      const els = document.querySelectorAll("[data-reveal], [data-reveal-stagger]");
      els.forEach((el) => {
        if (el.getAttribute("data-in") !== "1") io.observe(el);
      });
    };
    // Give React a tick to commit, then re-scan once more in case images
    // or async-loaded chunks added more nodes.
    const t1 = setTimeout(attach, 60);
    const t2 = setTimeout(attach, 220);
    return () => {
      io.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
