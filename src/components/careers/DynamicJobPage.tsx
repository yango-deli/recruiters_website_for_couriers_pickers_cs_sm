"use client";

import type { LandingSection, RolePageContent } from "@/lib/landing/types";
import type { WebsiteFormConfig } from "@/lib/jobs/types";
import { cn } from "@/lib/utils";
import { CareersChrome } from "./CareersChrome";
import { CareersFooter } from "./CareersFooter";
import { CareersFloatingActions } from "./CareersFloatingActions";
import { CareersButtonEffects } from "./CareersButtonEffects";
import { HeroSection } from "./sections/HeroSection";
import { BenefitsSection } from "./sections/BenefitsSection";
import { UniqueSection } from "./sections/UniqueSection";
import { WhyJoinSection } from "./sections/WhyJoinSection";
import { StepsSection } from "./sections/StepsSection";
import { FigmaBandSection } from "./sections/FigmaBandSection";
import { DynamicLeadForm } from "@/components/forms/DynamicLeadForm";
import { shouldRenderLandingSection } from "@/lib/landing/should-render-section";
import { formAnchorId } from "./types";

const COURIERS_ROLE = "couriers" as const;

type DynamicJobPageProps = {
  slug: string;
  positionId: string;
  content: RolePageContent;
  formConfig: WebsiteFormConfig;
};

function DynamicSection({ section }: { section: LandingSection }) {
  switch (section.type) {
    case "benefits":
      return (
        <BenefitsSection
          title={section.title}
          items={section.items}
          compositeCards={section.compositeCards}
          role={COURIERS_ROLE}
        />
      );
    case "unique":
      return (
        <UniqueSection
          title={section.title}
          footnote={section.footnote}
          items={section.items}
          role={COURIERS_ROLE}
        />
      );
    case "whyJoin":
      return (
        <WhyJoinSection
          title={section.title}
          items={section.items}
          compositeCards={section.compositeCards}
          variant={section.variant}
          role={COURIERS_ROLE}
        />
      );
    case "registration":
      return (
        <StepsSection
          title={section.title}
          subtitle={section.subtitle}
          steps={section.steps}
          compositeCards={section.compositeCards}
          role={COURIERS_ROLE}
        />
      );
    case "figmaBand":
      return (
        <FigmaBandSection
          id={section.id}
          image={section.image}
          width={section.width}
          height={section.height}
          role={COURIERS_ROLE}
          variant={section.variant}
          ariaLabel={section.ariaLabel}
        />
      );
    default:
      return null;
  }
}

export function DynamicJobPage({
  slug,
  positionId,
  content,
  formConfig,
}: DynamicJobPageProps) {
  const formSection = content.sections.find((s) => s.type === "form");
  const bodySections = content.sections.filter(
    (s) => s.type !== "form" && shouldRenderLandingSection(s)
  );
  const formId = formAnchorId(COURIERS_ROLE);

  return (
    <div
      className={cn(
        "careers-site min-h-full",
        "careers-site--couriers careers-site--couriers-figma"
      )}
    >
      <CareersChrome activeRole={COURIERS_ROLE} showHubTabs={false} activeJobSlug={slug} />

      <main id="main-content" className="careers-main">
        <HeroSection hero={content.hero} role={COURIERS_ROLE} />
        {bodySections.map((section, index) => (
          <DynamicSection
            key={
              section.type === "figmaBand"
                ? `${section.type}-${section.id}`
                : `${section.type}-${index}`
            }
            section={section}
          />
        ))}

        <section
          id={formId}
          className="careers-form-section careers-form-section--couriers"
        >
          <div className="careers-form-section__couriers-inner">
            <header className="careers-form-section__header">
              <h2 className="careers-form-section__title careers-form-section__title--couriers">
                {formSection?.type === "form" ? formSection.title : "רוצים להירשם?"}
              </h2>
              {formSection?.type === "form" && formSection.subtitle ? (
                <p className="careers-form-section__subtitle">{formSection.subtitle}</p>
              ) : null}
            </header>
            <div
              id="lead-form-mount"
              className="wp-lead-form-mount careers-form-section__mount"
              data-role={slug}
            >
              <div className="wp-lead-form">
                <DynamicLeadForm
                  positionId={positionId}
                  positionSlug={slug}
                  formConfig={formConfig}
                />
              </div>
            </div>
          </div>
        </section>

        <CareersFooter role={COURIERS_ROLE} />
      </main>

      <CareersFloatingActions />
      <CareersButtonEffects activeRole={COURIERS_ROLE} />
    </div>
  );
}
