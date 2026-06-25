"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const labels: Record<Locale, string> = {
  he: "עב",
  en: "EN",
  ru: "RU",
};

/** Three-locale switcher styled like Elementor WP nav buttons. */
export function WpLanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      className="flex items-center gap-1.5"
      role="group"
      aria-label="Language switcher"
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, { locale: loc })}
          className={cn(
            "wp-chrome-lang cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC00]",
            locale === loc
              ? "wp-chrome-lang--active"
              : "wp-chrome-lang--idle"
          )}
          aria-current={locale === loc ? "true" : undefined}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
