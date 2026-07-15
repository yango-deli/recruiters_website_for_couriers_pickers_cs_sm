"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Role } from "@/types/role";
import { formAnchorId } from "./types";

type CareersFooterProps = {
  role: Role;
};

export function CareersFooter({ role }: CareersFooterProps) {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");

  if (role === "couriers") {
    return (
      <footer className="careers-footer careers-footer--couriers careers-footer--figma">
        <div className="careers-footer__figma-shell">
          <div className="careers-footer__figma-panel">
            <div className="careers-footer__figma-copy">
              <a
                href={`#${formAnchorId(role)}`}
                className="careers-footer__figma-cta"
              >
                {tCommon("apply")}
              </a>
              <p className="careers-footer__figma-disclaimer">
                Yango Deli הוא שירות שליחויות לעסקים שצריכים פתרון נוח ומהיר.
                המשלוחים מטופלים על ידי שליחים וחברות שליחויות שעובדות עם Yango
                Deli
              </p>
              <div className="careers-footer__figma-legal">
                <a
                  href={t("privacyUrl")}
                  className="careers-footer__figma-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                <span className="careers-footer__figma-copyline">
                  Yango Deli Israel Ltd © 2023
                </span>
              </div>
            </div>
            <div className="careers-footer__figma-logo" aria-hidden>
              <Image
                src="/careers/couriers/footer-logo.png"
                alt=""
                width={370}
                height={169}
                className="careers-footer__figma-logo-img"
              />
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (role === "pickers") {
    return (
      <footer className="careers-footer careers-footer--pickers careers-footer--figma">
        <div className="careers-footer__figma-shell">
          <div className="careers-footer__figma-panel">
            <div className="careers-footer__figma-copy">
              <a
                href={`#${formAnchorId(role)}`}
                className="careers-footer__figma-cta"
              >
                {tCommon("apply")}
              </a>
              <p className="careers-footer__figma-disclaimer">
                Yango Deli הוא שירות שליחויות לעסקים שצריכים פתרון נוח ומהיר.
                המשלוחים מטופלים על ידי שליחים וחברות שליחויות שעובדות עם Yango
                Deli
              </p>
              <div className="careers-footer__figma-legal">
                <a
                  href={t("privacyUrl")}
                  className="careers-footer__figma-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                <span className="careers-footer__figma-copyline">
                  Yango Deli Israel Ltd © 2023
                </span>
              </div>
            </div>
            <div className="careers-footer__figma-logo" aria-hidden>
              <Image
                src="/careers/pickers/footer-logo.png"
                alt=""
                width={370}
                height={169}
                className="careers-footer__figma-logo-img"
              />
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (role === "support" || role === "service-rep") {
    return (
      <footer className="careers-footer careers-footer--support careers-footer--figma">
        <div className="careers-footer__figma-shell">
          <div className="careers-footer__figma-panel">
            <div className="careers-footer__figma-copy">
              <a
                href={`#${formAnchorId(role)}`}
                className="careers-footer__figma-cta"
              >
                {tCommon("apply")}
              </a>
              <p className="careers-footer__figma-disclaimer">
                Yango Deli הוא שירות שליחויות לעסקים שצריכים פתרון נוח ומהיר.
                המשלוחים מטופלים על ידי שליחים וחברות שליחויות שעובדות עם Yango
                Deli
              </p>
              <div className="careers-footer__figma-legal">
                <a
                  href={t("privacyUrl")}
                  className="careers-footer__figma-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                <span className="careers-footer__figma-copyline">
                  Yango Deli Israel Ltd © 2023
                </span>
              </div>
            </div>
            <div className="careers-footer__figma-logo" aria-hidden>
              <Image
                src="/careers/support/footer-logo.png"
                alt=""
                width={370}
                height={169}
                className="careers-footer__figma-logo-img"
              />
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="careers-footer">
      <div className="careers-container careers-footer__inner">
        <div className="careers-footer__cta-wrap">
          <a href={`#${formAnchorId(role)}`} className="careers-footer__cta">
            {tCommon("apply")}
          </a>
        </div>

        <div className="careers-footer__meta">
          <p className="careers-footer__copyright">Yango Deli Israel Ltd © 2026</p>

          <a
            href={t("termsUrl")}
            className="careers-footer__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("terms")}
          </a>

          <a
            href={t("privacyUrl")}
            className="careers-footer__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("privacy")}
          </a>
        </div>
      </div>
    </footer>
  );
}
