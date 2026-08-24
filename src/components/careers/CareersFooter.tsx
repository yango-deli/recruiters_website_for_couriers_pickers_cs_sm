"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Role } from "@/types/role";
import { getRoleFormConfig } from "@/lib/forms/role-form-config";
import { formAnchorId } from "./types";

type CareersFooterProps = {
  role: Role;
};

const FOOTER_LOGO: Partial<Record<Role, string>> = {
  couriers: "/careers/couriers/footer-logo.png",
  pickers: "/careers/pickers/footer-logo.png",
  support: "/careers/support/footer-logo.png",
  "service-rep": "/careers/support/footer-logo.png",
  manager: "/careers/support/footer-logo.png",
};

export function CareersFooter({ role }: CareersFooterProps) {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");
  const config = getRoleFormConfig(role);
  const logoSrc = FOOTER_LOGO[role] ?? "/careers/support/footer-logo.png";
  const isSupportLegal = role === "support" && config.showFooterDisclaimer;

  return (
    <footer
      className={`careers-footer careers-footer--slim${
        config.showFooterApplyCta ? " careers-footer--has-cta" : ""
      }${config.showFooterDisclaimer ? " careers-footer--has-disclaimer" : ""}${
        isSupportLegal ? " careers-footer--support-legal" : ""
      }`}
    >
      <div className="careers-footer__slim-panel">
        <div className="careers-footer__slim-main">
          {config.showFooterApplyCta ? (
            <a
              href={`#${formAnchorId(role)}`}
              className="careers-footer__slim-cta"
            >
              {tCommon("apply")}
            </a>
          ) : null}

          {isSupportLegal ? (
            <div className="careers-footer__slim-legal-block">
              <p className="careers-footer__slim-disclaimer">
                {t("disclaimer")}
              </p>
              <a
                href={t("privacyUrl")}
                className="careers-footer__slim-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("privacy")}
              </a>
              <span className="careers-footer__slim-copyline">
                {t("companyLine", { year: config.privacyYear })}
              </span>
            </div>
          ) : (
            <div className="careers-footer__slim-legal">
              <a
                href={t("privacyUrl")}
                className="careers-footer__slim-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("privacy")}
              </a>
              <span className="careers-footer__slim-copyline">
                {t("companyLine", { year: config.privacyYear })}
              </span>
            </div>
          )}
        </div>

        <div className="careers-footer__slim-brand" aria-hidden>
          <Image
            src={logoSrc}
            alt=""
            width={120}
            height={55}
            className="careers-footer__slim-brand-img"
          />
        </div>
      </div>
    </footer>
  );
}
