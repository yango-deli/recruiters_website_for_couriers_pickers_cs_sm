"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { CareersRoleSync } from "@/components/CareersRoleSync";
import type { LandingSection, RolePageContent } from "@/lib/landing/types";
import type { LandingRole } from "@/lib/landing/types";
import type { Role } from "@/types/role";
import { cn } from "@/lib/utils";
import { CareersChrome } from "./CareersChrome";
import { CareersFooter } from "./CareersFooter";
import { CareersFloatingActions } from "./CareersFloatingActions";
import { CareersButtonEffects } from "./CareersButtonEffects";
import { HeroSection } from "./sections/HeroSection";
import { BenefitsSection } from "./sections/BenefitsSection";
import { WhyJoinSection } from "./sections/WhyJoinSection";
import { UniqueSection } from "./sections/UniqueSection";
import { StepsSection } from "./sections/StepsSection";
import { FormSection } from "./sections/FormSection";
import { FigmaBandSection } from "./sections/FigmaBandSection";
import type { CareersPageProps } from "./types";

function RoleSections({
  role,
  content,
}: {
  role: Role;
  content: RolePageContent;
}) {
  return (
    <>
      <HeroSection hero={content.hero} role={role} />
      {content.sections.map((section, index) => (
        <SectionBlock
          key={
            section.type === "figmaBand"
              ? `${section.type}-${section.id}`
              : `${section.type}-${"title" in section ? section.title : index}`
          }
          section={section}
          role={role}
        />
      ))}
    </>
  );
}

function SectionBlock({
  section,
  role,
}: {
  section: LandingSection;
  role: Role;
}) {
  switch (section.type) {
    case "benefits":
      return (
        <BenefitsSection
          title={section.title}
          items={section.items}
          compositeCards={section.compositeCards}
          role={role}
        />
      );
    case "unique":
      return (
        <UniqueSection
          title={section.title}
          footnote={section.footnote}
          items={section.items}
        />
      );
    case "whyJoin":
      return (
        <WhyJoinSection
          title={section.title}
          items={section.items}
          compositeCards={section.compositeCards}
          variant={section.variant}
        />
      );
    case "registration":
      return (
        <StepsSection
          title={section.title}
          subtitle={section.subtitle}
          steps={section.steps}
          compositeCards={section.compositeCards}
          role={role}
        />
      );
    case "form":
      return (
        <FormSection title={section.title} subtitle={section.subtitle} role={role} />
      );
    case "figmaBand":
      return (
        <FigmaBandSection
          id={section.id}
          image={section.image}
          width={section.width}
          height={section.height}
          role={role}
          variant={section.variant}
          ariaLabel={section.ariaLabel}
        />
      );
    default:
      return null;
  }
}

export function CareersPage({
  initialRole,
  pageMode,
  roleContents,
}: CareersPageProps) {
  const [activeRole, setActiveRole] = useState(initialRole);
  const showHubTabs = pageMode === "hub";

  const onRoleFromUrl = useCallback((role: Role) => {
    setActiveRole(role);
  }, []);

  const content = useMemo(
    () => roleContents[activeRole as LandingRole],
    [roleContents, activeRole]
  );

  const siteClass = cn(
    "careers-site min-h-full",
    activeRole === "couriers" && "careers-site--couriers careers-site--couriers-figma",
    activeRole === "pickers" && "careers-site--pickers careers-site--pickers-figma",
    (activeRole === "support" || activeRole === "service-rep") &&
      "careers-site--support careers-site--support-figma"
  );

  return (
    <div className={siteClass}>
      <Suspense fallback={null}>
        <CareersRoleSync onRoleFromUrl={onRoleFromUrl} />
      </Suspense>

      <CareersChrome
        activeRole={activeRole}
        onRoleChange={showHubTabs ? setActiveRole : undefined}
        showHubTabs={showHubTabs}
      />

      <main
        id="main-content"
        className="careers-main"
      >
        <RoleSections role={activeRole} content={content} />
        <CareersFooter role={activeRole} />
      </main>

      <CareersFloatingActions />
      <CareersButtonEffects activeRole={activeRole} />
    </div>
  );
}
