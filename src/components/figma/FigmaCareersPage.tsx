"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { CareersRoleSync } from "@/components/CareersRoleSync";
import type { WpLandingSection, WpRolePageContent } from "@/lib/wp/parse-role-page";
import type { Role } from "@/types/role";
import { FigmaChrome } from "./FigmaChrome";
import { FigmaBodyInit } from "./FigmaBodyInit";
import { FigmaCareersFooter } from "./FigmaCareersFooter";
import { FigmaFloatingActions } from "./FigmaFloatingActions";
import { FigmaHero } from "./sections/FigmaHero";
import { FigmaBenefits } from "./sections/FigmaBenefits";
import { FigmaWhyJoin } from "./sections/FigmaWhyJoin";
import { FigmaUnique } from "./sections/FigmaUnique";
import { FigmaRegistrationSteps } from "./sections/FigmaRegistrationSteps";
import { FigmaFormSection } from "./sections/FigmaFormSection";
import type { FigmaCareersPageProps } from "./types";

function RoleSections({
  role,
  content,
}: {
  role: Role;
  content: WpRolePageContent;
}) {
  const centeredHero = role === "manager";

  return (
    <>
      <FigmaHero hero={content.hero} role={role} centered={centeredHero} />
      {content.sections.map((section) => (
        <SectionBlock key={`${section.type}-${section.title}`} section={section} role={role} />
      ))}
    </>
  );
}

function SectionBlock({
  section,
  role,
}: {
  section: WpLandingSection;
  role: Role;
}) {
  switch (section.type) {
    case "benefits":
      return <FigmaBenefits title={section.title} items={section.items} role={role} />;
    case "unique":
      return <FigmaUnique title={section.title} items={section.items} />;
    case "whyJoin":
      return (
        <FigmaWhyJoin
          title={section.title}
          items={section.items}
          variant={section.variant}
        />
      );
    case "registration":
      return (
        <FigmaRegistrationSteps
          title={section.title}
          subtitle={section.subtitle}
          steps={section.steps}
          role={role}
        />
      );
    case "form":
      return <FigmaFormSection title={section.title} role={role} />;
    default:
      return null;
  }
}

export function FigmaCareersPage({
  initialRole,
  pageMode,
  roleContents,
}: FigmaCareersPageProps) {
  const [activeRole, setActiveRole] = useState(initialRole);
  const showHubTabs = pageMode === "hub";

  const onRoleFromUrl = useCallback((role: Role) => {
    setActiveRole(role);
  }, []);

  const content = useMemo(
    () => roleContents[activeRole],
    [roleContents, activeRole]
  );

  return (
    <>
      <FigmaBodyInit />
      <Suspense fallback={null}>
        <CareersRoleSync onRoleFromUrl={onRoleFromUrl} />
      </Suspense>

      <FigmaChrome
        activeRole={activeRole}
        onRoleChange={showHubTabs ? setActiveRole : undefined}
        showHubTabs={showHubTabs}
      />

      <main
        id="main-content"
        className={`figma-main${activeRole === "couriers" ? " figma-careers-site--couriers" : ""}`}
      >
        <RoleSections role={activeRole} content={content} />
        <FigmaCareersFooter role={activeRole} />
      </main>
      <FigmaFloatingActions />
    </>
  );
}
