"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { WpLanguageSwitcher } from "@/components/wp/WpLanguageSwitcher";
import { ROLES, isRole, type Role } from "@/types/role";
import { cn } from "@/lib/utils";

function activeRoleFromPath(pathname: string): Role | undefined {
  const segment = pathname.replace(/^\//, "").split("/")[0];
  return isRole(segment) ? segment : undefined;
}

export function WpSiteChrome() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const activeRole = useMemo(() => activeRoleFromPath(pathname), [pathname]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isHub = pathname === "/" || pathname === "";
  const logoHref = `/${activeRole ?? "pickers"}`;

  return (
    <header className="wp-site-chrome sticky top-0 z-[100] w-full border-b border-black/10 bg-white/95 shadow-sm backdrop-blur-sm transition-shadow duration-300">
      <div className="mx-auto flex h-14 w-full max-w-[1140px] items-center justify-between gap-3 px-4 md:h-[4.25rem]">
        <Link
          href={logoHref}
          className="wp-chrome-brand shrink-0 rounded-sm text-base font-black tracking-tight text-black transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC00]"
          aria-label={t("brand")}
        >
          Yango Deli
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-2 lg:flex"
          aria-label={t("menu")}
        >
          {ROLES.map((role) => (
            <Link
              key={role}
              href={`/${role}`}
              className={cn(
                "wp-chrome-pill",
                (activeRole === role || (isHub && role === "pickers")) &&
                  "wp-chrome-pill--active"
              )}
            >
              {t(`roles.${role}`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <WpLanguageSwitcher />
          <button
            type="button"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-black/15 text-black transition-colors hover:border-black/30 hover:bg-[#FFCC00]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC00]"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={t("menu")}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav
          className="border-t border-black/10 bg-white px-4 py-3 lg:hidden"
          aria-label={t("menu")}
        >
          <ul className="flex flex-col gap-2">
            {ROLES.map((role) => (
              <li key={role}>
                <Link
                  href={`/${role}`}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "wp-chrome-pill block w-full text-center",
                    (activeRole === role || (isHub && role === "pickers")) &&
                      "wp-chrome-pill--active"
                  )}
                >
                  {t(`roles.${role}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
