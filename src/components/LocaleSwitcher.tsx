"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LABELS: Record<Locale, string> = {
  he: "HE",
  en: "EN",
  ru: "RU",
};

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  return (
    <div className="flex gap-1 rounded-full bg-brand-surface-elevated p-1">
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent",
            locale === loc
              ? "bg-brand-accent text-brand-primary"
              : "text-brand-muted hover:text-brand-text"
          )}
        >
          {LABELS[loc]}
        </Link>
      ))}
    </div>
  );
}
