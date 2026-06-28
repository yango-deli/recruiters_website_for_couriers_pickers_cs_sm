"use client";

import { Suspense, useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { LandingPageRoleSync } from "@/components/LandingPageRoleSync";
import { Footer } from "@/components/layout/Footer";
import { FigmaChrome } from "./FigmaChrome";
import { FigmaBodyInit } from "./FigmaBodyInit";
import { FigmaHero } from "./sections/FigmaHero";
import { FigmaBenefits } from "./sections/FigmaBenefits";
import { FigmaWhyJoin } from "./sections/FigmaWhyJoin";
import { FigmaUnique } from "./sections/FigmaUnique";
import { FigmaRegistrationSteps } from "./sections/FigmaRegistrationSteps";
import { FigmaFormSection } from "./sections/FigmaFormSection";
import type { FigmaCareersPageProps, RegistrationStep, RoleContent } from "./types";

function RoleSections({
  role,
  content,
  formTitle,
  registrationPath,
}: {
  role: FigmaCareersPageProps["initialRole"];
  content: RoleContent;
  formTitle: string;
  registrationPath: { title: string; steps: RegistrationStep[] };
}) {
  return (
    <>
      <FigmaHero hero={content.hero} role={role} />
      <FigmaBenefits title={content.benefits.title} items={content.benefits.items} />
      <FigmaWhyJoin title={content.whyJoin.title} items={content.whyJoin.items} role={role} />
      <FigmaUnique title={content.howItWorks.title} items={content.howItWorks.items} />
      <FigmaRegistrationSteps
        title={registrationPath.title}
        steps={registrationPath.steps}
      />
      <FigmaFormSection title={formTitle} role={role} />
    </>
  );
}

export function FigmaCareersPage({
  initialRole,
  pageMode,
}: FigmaCareersPageProps) {
  const tRoles = useTranslations("roles");
  const tLanding = useTranslations("landing");
  const [activeRole, setActiveRole] = useState(initialRole);

  const onRoleFromUrl = useCallback((role: typeof initialRole) => {
    setActiveRole(role);
  }, []);

  const content = tRoles.raw(activeRole) as RoleContent;
  const registrationPath = tLanding.raw("registrationPath") as {
    title: string;
    steps: RegistrationStep[];
  };
  const formTitle = tLanding("formSectionTitle");
  const showHubTabs = pageMode === "hub";

  return (
    <>
      <FigmaBodyInit />
      <Suspense fallback={null}>
        <LandingPageRoleSync onRoleFromUrl={onRoleFromUrl} />
      </Suspense>

      <FigmaChrome
        activeRole={activeRole}
        onRoleChange={showHubTabs ? setActiveRole : undefined}
        showHubTabs={showHubTabs}
      />

      <main id="main-content" className="pt-[var(--figma-chrome-gap,3.125rem)]">
        <RoleSections
          role={activeRole}
          content={content}
          formTitle={formTitle}
          registrationPath={registrationPath}
        />
        <Footer />
      </main>
    </>
  );
}
