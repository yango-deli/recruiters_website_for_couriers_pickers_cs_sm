"use client";

import { useEffect } from "react";
import type { Role } from "@/types/role";

const REVEAL_SELECTOR = [
  ".careers-hero__figma-cta",
  ".careers-footer__figma-cta",
  ".careers-form-section .wp-lead-form button[type='submit']",
].join(",");

type CareersButtonEffectsProps = {
  activeRole: Role;
};

/** Smooth anchor scroll + scroll-reveal for primary CTAs (respects reduced motion). */
export function CareersButtonEffects({ activeRole }: CareersButtonEffectsProps) {
  useEffect(() => {
    const root = document.querySelector(".careers-site");
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion) {
      root.classList.add("careers-site--motion");
    }

    const chromeMenu = root.querySelector(".careers-chrome__menu");
    const scrollOffset = () =>
      chromeMenu instanceof HTMLElement ? chromeMenu.offsetHeight + 8 : 88;

    const onAnchorClick = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href^='#']");
      if (!link || !root.contains(link)) return;

      const id = link.getAttribute("href")?.slice(1);
      if (!id) return;
      const section = document.getElementById(id);
      if (!section) return;

      event.preventDefault();
      const top = section.getBoundingClientRect().top + window.scrollY - scrollOffset();
      window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? "auto" : "smooth" });
    };

    root.addEventListener("click", onAnchorClick);

    if (reducedMotion) {
      root.querySelectorAll(REVEAL_SELECTOR).forEach((node) => {
        node.classList.add("careers-btn--visible");
      });
      return () => root.removeEventListener("click", onAnchorClick);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("careers-btn--visible");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    root.querySelectorAll(REVEAL_SELECTOR).forEach((node) => {
      node.classList.add("careers-btn--reveal");
      observer.observe(node);
    });

    return () => {
      root.removeEventListener("click", onAnchorClick);
      observer.disconnect();
    };
  }, [activeRole]);

  return null;
}
