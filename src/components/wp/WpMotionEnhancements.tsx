"use client";

import { useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SECTION_SELECTOR =
  "body.wp-site .wp-page-shell .elementor > .e-con.e-parent";

function isInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
}

export function WpMotionEnhancements() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const root = document.querySelector(".wp-page-shell");
    if (!root) return;

    root.querySelectorAll<HTMLElement>(".elementor-widget-text-editor .lc-text-block").forEach((node) => {
      const strong = node.querySelector("strong");
      if (!strong) return;
      const widget = node.closest(".elementor-widget-text-editor");
      if (!widget) return;
      widget.innerHTML = `<p><strong>${strong.textContent?.trim() ?? ""}</strong></p>`;
    });

    if (reduceMotion) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(SECTION_SELECTOR)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("wp-section-reveal--visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -5% 0px", threshold: 0.08 }
    );

    sections.forEach((el, index) => {
      el.classList.add("wp-section-reveal");
      el.style.setProperty("--wp-reveal-delay", `${Math.min(index * 40, 240)}ms`);

      if (isInViewport(el)) {
        el.classList.add("wp-section-reveal--visible");
      } else {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [pathname, reduceMotion]);

  return null;
}
