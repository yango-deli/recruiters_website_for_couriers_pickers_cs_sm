import { resolveLocaleHomeRedirect } from "@/lib/landing/default-route";
import manifest from "../../../content/wp/manifest.json";
import type { Locale } from "@/i18n/routing";
import type { Role } from "@/types/role";

export type WpPageCategory = "careers" | "legal" | "home";

export type WpPageEntry = {
  id: number;
  slug: string;
  title: string;
  link: string;
  category: WpPageCategory;
  locale: string;
  role: Role | null;
  htmlPath: string;
  imageCount: number;
  hasZoho: boolean;
  htmlBytes: number;
};

export type WpManifest = {
  syncedAt: string;
  wpUrl: string;
  pages: WpPageEntry[];
};

export const wpManifest = manifest as WpManifest;

export const ROLE_SLUGS = ["couriers", "pickers", "support", "manager"] as const;
export type RoleSlug = (typeof ROLE_SLUGS)[number];

export function isRoleSlug(value: string): value is RoleSlug {
  return (ROLE_SLUGS as readonly string[]).includes(value);
}

/** Which synced WP HTML variant to load per UI locale. */
export function wpContentLocale(locale: string): "he" | "en" | "ru" {
  if (locale === "he") return "he";
  if (locale === "ru") return "ru";
  return "en";
}

const ELEMENTOR_POST_BY_WP_SLUG: Record<string, number> = {
  careers: 1052,
  "yango-deli-careers-original": 1614,
  "work-with-us-couriers-he": 529,
  "work-with-us-couriers-en": 115,
  "work-with-us-storekeepers-he": 728,
  "work-with-us-storekeepers-en": 463,
  "work-with-us-support-he": 906,
  "work-with-us-couriers-ru": 115,
  "work-with-us-storekeepers-ru": 463,
  "work-with-us-support-ru": 906,
  "work-with-us-support-en": 906,
  "careers-ru": 1052,
  "careers-en": 1052,
};

export function getElementorPostId(wpSlug: string): number | null {
  return ELEMENTOR_POST_BY_WP_SLUG[wpSlug] ?? null;
}

export function getWpPageBySlug(slug: string): WpPageEntry | undefined {
  const decoded = decodeURIComponent(slug);
  return wpManifest.pages.find(
    (p) => p.slug === slug || p.slug === decoded || decodeURIComponent(p.slug) === decoded
  );
}

export function getLegalPages(): WpPageEntry[] {
  return wpManifest.pages.filter((p) => p.category === "legal");
}

export function getWpHubSlug(locale?: string): string {
  if (locale === "ru") return "careers-ru";
  if (locale === "en") return "careers-en";
  return "careers";
}

export function getWpSlugForRole(role: Role, locale: string): string {
  const contentLocale = wpContentLocale(locale);

  if (role === "manager") {
    return getWpHubSlug(locale);
  }
  if (role === "couriers") {
    if (contentLocale === "ru") return "work-with-us-couriers-ru";
    if (contentLocale === "en") return "work-with-us-couriers-en";
    return "work-with-us-couriers-he";
  }
  if (role === "pickers") {
    if (contentLocale === "ru") return "work-with-us-storekeepers-ru";
    if (contentLocale === "en") return "work-with-us-storekeepers-en";
    return "work-with-us-storekeepers-he";
  }
  if (role === "support") {
    if (contentLocale === "ru") return "work-with-us-support-ru";
    if (contentLocale === "en") return "work-with-us-support-en";
    return "work-with-us-support-he";
  }
  if (contentLocale === "ru") return "work-with-us-couriers-ru";
  if (contentLocale === "en") return "work-with-us-couriers-en";
  return "work-with-us-couriers-he";
}

/** Legacy WordPress paths (no locale) → Next.js paths */
export const WP_LEGACY_REDIRECTS: Record<string, string> = {
  "/careers": resolveLocaleHomeRedirect(),
  "/home": resolveLocaleHomeRedirect(),
  "/yango-deli-careers-original": resolveLocaleHomeRedirect(),
  "/work-with-us-couriers-he": "/he/couriers",
  "/work-with-us-couriers-en": "/en/couriers",
  "/work-with-us-storekeepers-he": "/he/pickers",
  "/work-with-us-storekeepers-en": "/en/pickers",
  "/work-with-us-support-he": "/he/support",
};

for (const page of wpManifest.pages) {
  if (page.category === "legal") {
    const path = `/${decodeURIComponent(page.slug)}`;
    WP_LEGACY_REDIRECTS[path] = `/he/${decodeURIComponent(page.slug)}`;
  }
}
