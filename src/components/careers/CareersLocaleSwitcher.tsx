"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LABELS: Record<Locale, string> = {
  he: "HE",
  en: "EN",
  ru: "RU",
};

export function CareersLocaleSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <div className="careers-chrome__lang" role="group" aria-label={t("language")}>
      {routing.locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          className={cn(
            "careers-chrome__lang-btn",
            locale === loc && "careers-chrome__lang-btn--active"
          )}
          aria-current={locale === loc ? "true" : undefined}
        >
          {LABELS[loc]}
        </Link>
      ))}
    </div>
  );
}
