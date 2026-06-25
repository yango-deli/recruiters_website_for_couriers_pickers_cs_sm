"use client";

import { useTranslations } from "next-intl";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Link, useRouter } from "@/i18n/navigation";
import { YangoButton } from "@/components/ui/YangoButton";
import { ROLES, type Role } from "@/types/role";
import { cn } from "@/lib/utils";

type HeaderProps = {
  activeRole?: Role;
  onRoleChange?: (role: Role) => void;
  onApplyClick?: () => void;
};

export function Header({ activeRole = "pickers", onRoleChange, onApplyClick }: HeaderProps) {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectRole = (role: Role) => {
    if (onRoleChange) {
      onRoleChange(role);
    } else {
      router.push(`/${role}`);
    }
    setMobileOpen(false);
  };

  return (
    <header className="relative bg-transparent">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 md:h-16 md:px-6 lg:px-8">
        <Link
          href="/"
          aria-label={t("brand")}
          className="flex shrink-0 items-center rounded-sm py-1 transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/60 focus-visible:ring-offset-2"
        >
          <BrandLogo variant="wordmark" size="header" priority />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Roles">
            {ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => selectRole(role)}
                className={cn(
                  "chrome-pill cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold",
                  activeRole === role
                    ? "chrome-pill--active bg-brand-accent text-brand-primary"
                    : "text-brand-muted hover:bg-brand-surface-elevated hover:text-brand-text"
                )}
              >
                {t(`roles.${role}`)}
              </button>
            ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <LanguageSwitcher />
          <YangoButton
            variant="accent"
            className="hidden px-5 py-2.5 text-sm md:inline-flex"
            onClick={onApplyClick}
          >
            {tCommon("apply")}
          </YangoButton>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="chrome-icon-btn inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full lg:hidden"
            aria-label={t("menu")}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5 text-brand-text" />
            ) : (
              <Menu className="h-5 w-5 text-brand-text" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-brand-border/80 bg-gradient-to-b from-white/60 to-brand-surface-warm/40 lg:hidden"
          >
            <nav className="flex flex-col gap-1 p-4">
              {ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => selectRole(role)}
                  className={cn(
                    "cursor-pointer rounded-xl px-4 py-3 text-start text-sm font-semibold transition-colors",
                    activeRole === role
                      ? "chrome-pill--active bg-brand-accent text-brand-primary shadow-[0_4px_14px_rgba(255,205,87,0.4)]"
                      : "text-brand-muted hover:bg-brand-surface-elevated"
                  )}
                >
                  {t(`roles.${role}`)}
                </button>
              ))}
              <YangoButton variant="accent" className="mt-2 w-full" onClick={onApplyClick}>
                {tCommon("apply")}
              </YangoButton>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
