"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { LANDING_ROLES, isRole, type Role } from "@/types/role";
import { useCareersNavJobs } from "@/components/careers/CareersJobsProvider";
import { cn } from "@/lib/utils";

type CareersChromeProps = {
  activeRole: Role;
  onRoleChange?: (role: Role) => void;
  showHubTabs?: boolean;
  /** Active custom job page slug (/jobs/{slug}). */
  activeJobSlug?: string | null;
};

function activeRoleFromPath(pathname: string): Role | undefined {
  const segment = pathname.replace(/^\//, "").split("/")[0];
  return isRole(segment) ? segment : undefined;
}

export function CareersChrome({
  activeRole,
  onRoleChange,
  showHubTabs = false,
  activeJobSlug = null,
}: CareersChromeProps) {
  const t = useTranslations("nav");
  const customJobs = useCareersNavJobs();
  const pathname = usePathname();
  const router = useRouter();
  const pathRole = useMemo(() => activeRoleFromPath(pathname), [pathname]);
  const isHub = pathname === "/" || pathname === "";
  const isCouriers = activeRole === "couriers";
  const [mobileOpen, setMobileOpen] = useState(false);
  const figmaRolePage = !showHubTabs;

  const rolePillClass = (role: Role, asNav = false) =>
    cn(
      asNav
        ? "careers-chrome-pill careers-chrome-pill--nav careers-chrome-pill--crm"
        : "careers-chrome-pill cursor-pointer",
      activeRole === role && !activeJobSlug && "careers-chrome-pill--active"
    );

  const jobPillClass = (slug: string) =>
    cn(
      "careers-chrome-pill careers-chrome-pill--nav careers-chrome-pill--crm careers-chrome-pill--job max-w-[9rem] truncate",
      activeJobSlug === slug && "careers-chrome-pill--active"
    );

  const customJobLinks = customJobs.map((job) => (
    <Link
      key={job.slug}
      href={`/jobs/${job.slug}`}
      className={jobPillClass(job.slug)}
      aria-current={activeJobSlug === job.slug ? "page" : undefined}
    >
      {job.title}
    </Link>
  ));

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

  if (figmaRolePage) {
    return (
      <header className="careers-chrome careers-chrome--figma-role">
        <div className="careers-chrome__menu">
          <div className="careers-chrome__menu-inner">
            <nav className="careers-chrome__nav" aria-label={t("menu")}>
              {LANDING_ROLES.map((role) => (
                <Link
                  key={role}
                  href={`/${role}`}
                  className={rolePillClass(role, true)}
                  aria-current={activeRole === role && !activeJobSlug ? "page" : undefined}
                >
                  {t(`roles.${role}`)}
                </Link>
              ))}
              {customJobLinks}
            </nav>
            <Link href={logoHref} className="careers-chrome__logo" aria-label={t("brand")}>
              <Image
                src="/careers/shared/header-logo.png"
                alt=""
                width={250}
                height={50}
                priority
                className="careers-chrome__logo-img"
              />
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={cn("careers-chrome", isCouriers && "careers-chrome--couriers-hub")}>
      <div className="careers-container flex h-full items-center justify-between gap-3">
        <Link
          href={logoHref}
          className="shrink-0 rounded-sm transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC00]"
          aria-label={t("brand")}
        >
          <BrandLogo variant="wordmark" size="header" priority />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label={t("menu")}>
          {LANDING_ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => selectRole(role)}
              className={rolePillClass(role)}
            >
              {t(`roles.${role}`)}
            </button>
          ))}
          {customJobs.map((job) => (
            <Link key={job.slug} href={`/jobs/${job.slug}`} className={jobPillClass(job.slug)}>
              {job.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
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
            {LANDING_ROLES.map((role) => (
              <li key={role}>
                <button
                  type="button"
                  onClick={() => selectRole(role)}
                  className={cn(rolePillClass(role), "w-full")}
                >
                  {t(`roles.${role}`)}
                </button>
              </li>
            ))}
            {customJobs.map((job) => (
              <li key={job.slug}>
                <Link
                  href={`/jobs/${job.slug}`}
                  className={cn(jobPillClass(job.slug), "w-full inline-flex justify-center")}
                  onClick={() => setMobileOpen(false)}
                >
                  {job.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {showHubTabs ? (
        <div className="careers-container careers-role-tabs" role="tablist" aria-label={t("menu")}>
          {LANDING_ROLES.map((role) => (
            <button
              key={role}
              type="button"
              role="tab"
              aria-selected={activeRole === role}
              className={cn("careers-role-tab", activeRole === role && "careers-role-tab--active")}
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
