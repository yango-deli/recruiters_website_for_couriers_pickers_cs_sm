"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";
import type { WpPageMode } from "@/types/wp";

type WpPageBodyProps = {
  postId?: number | null;
  pageMode?: WpPageMode;
};

const WP_BODY_CLASSES = [
  "wp-site",
  "elementor-default",
  "elementor-kit-8",
  "elementor-page",
  "elementor-template-canvas",
] as const;

const PAGE_MODE_CLASSES: Record<WpPageMode, string> = {
  role: "wp-page-role",
  hub: "wp-page-hub",
  manager: "wp-page-manager",
  support: "wp-page-support",
};

/** Applies WordPress / Elementor body classes for canvas template parity. */
export function WpPageBody({ postId, pageMode = "role" }: WpPageBodyProps) {
  const locale = useLocale();

  useEffect(() => {
    const pageClass = postId ? `elementor-page-${postId}` : null;
    const modeClass = PAGE_MODE_CLASSES[pageMode];
    const classes = [
      ...WP_BODY_CLASSES,
      modeClass,
      locale === "he" ? "rtl" : "ltr",
      ...(pageClass ? [pageClass] : []),
    ];

    document.body.classList.add(...classes);
    document.documentElement.classList.remove("lenis", "lenis-smooth");

    return () => {
      document.body.classList.remove(...classes);
    };
  }, [locale, postId, pageMode]);

  return null;
}
