"use client";

import { useTranslations } from "next-intl";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Link } from "@/i18n/navigation";
import type { Role } from "@/types/role";
import { formAnchorId } from "./types";

type FigmaCareersFooterProps = {
  role: Role;
};

export function FigmaCareersFooter({ role }: FigmaCareersFooterProps) {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");

  const footerClass =
    role === "couriers"
      ? "figma-careers-footer figma-careers-footer--couriers"
      : "figma-careers-footer";

  return (
    <footer className={footerClass}>
      <div className="figma-container figma-careers-footer__inner">
        <div className="figma-careers-footer__cta-wrap">
          <a href={`#${formAnchorId(role)}`} className="figma-careers-footer__cta">
            {tCommon("apply")}
          </a>
        </div>

        <div className="figma-careers-footer__meta">
          <p className="figma-careers-footer__copyright">Yango Deli Israel Ltd © 2026</p>

          <Link href="/terms-of-use" className="figma-careers-footer__link">
            {t("terms")}
          </Link>

          <Link href="/privacy-policy" className="figma-careers-footer__link">
            {t("privacy")}
          </Link>

          <Link
            href="/"
            className="figma-careers-footer__logo"
            aria-label="Yango Deli"
          >
            <BrandLogo
              variant="wordmark"
              theme={role === "couriers" ? "dark" : "light"}
              size="md"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}
