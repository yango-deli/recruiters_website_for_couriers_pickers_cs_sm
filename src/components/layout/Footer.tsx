"use client";

import { useLocale, useTranslations } from "next-intl";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const APP_STORE_URL = "https://apps.apple.com/il/app/yango-deli/id1538123744";
const PLAY_STORE_ID = "com.yandex.yangodeli";

const storeButtonClass =
  "inline-flex min-w-[9.5rem] items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-brand-accent/60 hover:bg-white/10 hover:text-brand-accent";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const playStoreUrl = `https://play.google.com/store/apps/details?id=${PLAY_STORE_ID}&hl=${locale}`;

  return (
    <footer className="border-t border-white/10 bg-brand-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-7">
        <div className="mb-6 flex flex-col items-center gap-3 border-b border-white/10 pb-6 sm:flex-row sm:justify-center sm:gap-4">
          <p className="text-sm font-medium text-white/80">{t("downloadApp")}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={storeButtonClass}
              aria-label={`${t("appStore")} — Yango Deli`}
            >
              <AppleIcon className="h-5 w-5 shrink-0" />
              {t("appStore")}
            </a>
            <a
              href={playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={storeButtonClass}
              aria-label={`${t("googlePlay")} — Yango Deli`}
            >
              <PlayStoreIcon className="h-5 w-5 shrink-0" />
              {t("googlePlay")}
            </a>
          </div>
        </div>

        <div
          className={cn(
            "grid grid-cols-1 items-center gap-4 text-center",
            "sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 lg:text-start"
          )}
        >
          <p className="text-sm text-white/90 lg:col-span-1">
            Yango Deli Israel Ltd © 2026
          </p>

          <Link
            href="/terms-of-use"
            className="text-sm text-white/90 transition-colors hover:text-brand-accent"
          >
            {t("terms")}
          </Link>

          <Link
            href="/privacy-policy"
            className="text-sm text-white/90 transition-colors hover:text-brand-accent"
          >
            {t("privacy")}
          </Link>

          <Link
            href="/"
            className="mx-auto flex justify-center lg:mx-0 lg:justify-end"
            aria-label="Yango Deli"
          >
            <BrandLogo variant="wordmark" theme="light" size="md" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function PlayStoreIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.5 3.5v17l13-8.5-13-8.5z" />
    </svg>
  );
}
