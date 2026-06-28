"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

/** Applies figma careers body class (no Elementor). */
export function FigmaBodyInit() {
  const locale = useLocale();

  useEffect(() => {
    document.body.classList.add("figma-careers-site");
    document.documentElement.classList.remove("lenis", "lenis-smooth");

    return () => {
      document.body.classList.remove("figma-careers-site");
    };
  }, [locale]);

  return null;
}
