"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { WpLanguageSwitcher } from "@/components/wp/WpLanguageSwitcher";
import { ROLES, isRole, type Role } from "@/types/role";
import { cn } from "@/lib/utils";

type FigmaChromeProps = {
  activeRole: Role;
  onRoleChange?: (role: Role) => void;
  showHubTabs?: boolean;
};

function activeRoleFromPath(pathname: string): Role | undefined {
  const segment = pathname.replace(/^\//, "").split("/")[0];
  return isRole(segment) ? segment : undefined;
}

export function FigmaChrome({
  activeRole,
  onRoleChange,
  showHubTabs = false,
}: FigmaChromeProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const pathRole = useMemo(() => activeRoleFromPath(pathname), [pathname]);
  const isHub = pathname === "/" || pathname === "";
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectRole = (role: Role) => {
    if (onRoleChange) {
      onRoleChange(role);
      setMobileOpen(false);
      return;
    }
    router.push(`/${role}`);
    setMobileOpen(false);
  };

  const logoHref = `/${pathRole ?? activeRole ?? "pickers"}`;

  return (
    <header className="figma-chrome">
      <div className="figma-container flex h-full items-center justify-between gap-3">
        <Link
          href={logoHref}
          className="shrink-0 rounded-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC00]"
          aria-label={t("brand")}
        >
          <BrandLogo variant="wordmark" size="header" priority />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label={t("menu")}>
          {ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => selectRole(role)}
              className={cn(
                "figma-chrome-pill cursor-pointer",
                (activeRole === role || (isHub && !pathRole && role === "pickers" && activeRole === role)) &&
                  "figma-chrome-pill--active"
              )}
            >
              {t(`roles.${role}`)}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <WpLanguageSwitcher />
          <button
            type="button"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-black/15 text-black transition-colors hover:border-black/30 hover:bg-[#FFCC00]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC00] lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={t("menu")}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav className="border-t border-black/10 bg-white px-4 py-3 lg:hidden" aria-label={t("menu")}>
          <ul className="flex flex-col gap-2">
            {ROLES.map((role) => (
              <li key={role}>
                <button
                  type="button"
                  onClick={() => selectRole(role)}
                  className={cn(
                    "figma-chrome-pill w-full cursor-pointer",
                    activeRole === role && "figma-chrome-pill--active"
                  )}
                >
                  {t(`roles.${role}`)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {showHubTabs ? (
        <div className="figma-container figma-role-tabs" role="tablist" aria-label={t("menu")}>
          {ROLES.map((role) => (
            <button
              key={role}
              type="button"
              role="tab"
              aria-selected={activeRole === role}
              className={cn("figma-role-tab", activeRole === role && "figma-role-tab--active")}
              onClick={() => onRoleChange?.(role)}
            >
              {t(`roles.${role}`)}
            </button>
          ))}
        </div>
      ) : null}
    </header>
  );
}
