"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/Header";
import { LandingPageRoleSync } from "@/components/LandingPageRoleSync";
import { VolumetricChrome } from "@/components/layout/VolumetricChrome";
import { ApplyModal } from "@/components/modals/ApplyModal";
import { Hero } from "@/components/sections/Hero";
import { MissionSplit } from "@/components/sections/MissionSplit";
import { TrustList } from "@/components/sections/TrustList";
import { Benefits } from "@/components/sections/Benefits";
import { FeaturePinCard, FeaturesIntro } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { JourneyCta } from "@/components/sections/JourneyCta";
import { Footer } from "@/components/layout/Footer";
import { APPLY_REQUEST_EVENT, publishCtaPromptContent } from "@/lib/apply-bridge";
import { HorizontalPinSection } from "@/components/motion/HorizontalPinSection";
import { ScrollSpreadSection } from "@/components/motion/ScrollSpreadSection";
import { SectionAmbient } from "@/components/motion/SectionAmbient";
import { SectionScrollReveal } from "@/components/motion/SectionScrollReveal";
import { SectionTransition } from "@/components/motion/SectionTransition";
import { SectionNav } from "@/components/motion/SectionNav";
import { SectionShell } from "@/components/motion/SectionShell";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { getMissionImage } from "@/lib/brand-assets";
import { resolveCarouselImage, resolveHeroImage } from "@/lib/hero-images";
import type { Role } from "@/types/role";

const SECTION_IDS = [
  "hero",
  "mission",
  "trust",
  "benefits",
  "features",
  "how-it-works",
  "cta",
  "footer",
] as const;

type RoleContent = {
  hero: {
    title: string;
    subtitle: string;
    highlights?: string[];
    cta: string;
    image: string;
  };
  mission?: {
    label?: string;
    headline1?: string;
    headline2?: string;
    body: string;
    highlights?: string[];
    perks?: Array<{ title: string; description: string; sticker: string }>;
  };
  trust?: {
    label?: string;
    subtitle?: string;
    points: Array<{ title: string; description: string }>;
  };
  benefits: {
    label?: string;
    title: string;
    subtitle?: string;
    items: Array<{ title: string; description: string; icon?: string }>;
  };
  whyJoin: {
    label?: string;
    title: string;
    subtitle?: string;
    items: Array<{ title: string; description: string; image?: string }>;
  };
  howItWorks: {
    label?: string;
    title: string;
    subtitle?: string;
    items: Array<{ title: string; description: string; icon?: string }>;
  };
  cta: { title: string; subtitle?: string; button: string };
};

type HeroPanelProps = {
  title: string;
  subtitle: string;
  highlights?: string[];
  cta: string;
  image: string;
  role: Role;
  onCtaClick: () => void;
};

function HeroPanel({
  title,
  subtitle,
  highlights,
  cta,
  image,
  role,
  onCtaClick,
}: HeroPanelProps) {
  const { scrollTo } = useSmoothScroll();

  return (
    <Hero
      title={title}
      subtitle={subtitle}
      highlights={highlights}
      cta={cta}
      image={image}
      role={role}
      onCtaClick={onCtaClick}
      onLearnMore={() => scrollTo("benefits")}
    />
  );
}

type LandingPageProps = {
  initialRole?: Role;
  useWpChrome?: boolean;
};

export function LandingPage({ initialRole = "pickers", useWpChrome = false }: LandingPageProps) {
  const t = useTranslations("roles");
  const tLanding = useTranslations("landing");
  const tCommon = useTranslations("common");
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
  const [applyOpen, setApplyOpen] = useState(false);
  const activeRole = selectedRole;

  const openApply = useCallback(() => setApplyOpen(true), []);

  const role = t.raw(activeRole) as RoleContent;

  const trustPoints =
    role.trust?.points ??
    [
      ...role.benefits.items.map((b) => ({ title: b.title, description: b.description })),
      ...role.howItWorks.items.map((s) => ({ title: s.title, description: s.description })),
    ].slice(0, 6);

  const featureItems = role.whyJoin.items.map((item, i) => ({
    ...item,
    image: item.image ? resolveCarouselImage(activeRole, item.image, i) : item.image,
  }));

  const missionBody = role.mission?.body ?? role.hero.subtitle;

  const trustStats = [
    { value: trustPoints.length, label: tLanding("trust.statRoles") },
    { value: role.benefits.items.length, label: tLanding("trust.statBenefits") },
    { value: role.whyJoin.items.length, label: tLanding("trust.statPerks") },
  ];

  useEffect(() => {
    publishCtaPromptContent({
      title: role.cta.title,
      button: role.cta.button,
    });
  }, [role.cta.title, role.cta.button]);

  useEffect(() => {
    const onApplyRequest = () => setApplyOpen(true);
    window.addEventListener(APPLY_REQUEST_EVENT, onApplyRequest);
    return () => window.removeEventListener(APPLY_REQUEST_EVENT, onApplyRequest);
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <LandingPageRoleSync onRoleFromUrl={setSelectedRole} />
      </Suspense>
      {!useWpChrome ? (
        <VolumetricChrome
          header={
            <Header
              activeRole={activeRole}
              onRoleChange={setSelectedRole}
              onApplyClick={openApply}
            />
          }
        />
      ) : null}
      <ApplyModal open={applyOpen} onOpenChange={setApplyOpen} role={activeRole} />

      <SectionNav sectionIds={[...SECTION_IDS]} />

      <main
        id="main-content"
        className={useWpChrome ? "relative" : "chrome-offset relative"}
      >
        <SectionShell
          id="hero"
          theme="hero"
          className="min-h-[calc(100dvh-var(--chrome-height-effective,var(--chrome-height)))]"
        >
          <HeroPanel
            title={role.hero.title}
            subtitle={role.hero.subtitle}
            highlights={role.hero.highlights}
            cta={role.hero.cta}
            image={resolveHeroImage(activeRole, role.hero.image)}
            role={activeRole}
            onCtaClick={openApply}
          />
        </SectionShell>

        <SectionTransition variant="hero-mission" role={activeRole} />

        <SectionScrollReveal
          as="section"
          id="mission"
          variant="fade-scale"
          className="theme-section bg-brand-surface"
        >
          <MissionSplit
            label={role.mission?.label ?? tLanding("missionLabel")}
            line1={role.mission?.headline1 ?? role.mission?.label ?? tLanding("missionLabel")}
            line2={role.mission?.headline2 ?? role.mission?.label ?? tLanding("missionLabel")}
            body={missionBody}
            perks={role.mission?.perks}
            highlights={role.mission?.highlights}
            role={activeRole}
            image={getMissionImage(activeRole)}
          />
        </SectionScrollReveal>

        <SectionTransition variant="mission-trust" role={activeRole} />

        <SectionScrollReveal
          as="section"
          id="trust"
          variant="stagger-up"
          className="theme-section bg-[var(--theme-benefits-bg)] py-12 md:py-20"
        >
          <TrustList
            label={role.trust?.label ?? tLanding("trust.label")}
            title={tLanding("trust.title")}
            subtitle={role.trust?.subtitle ?? tLanding("trust.subtitle")}
            points={trustPoints}
            stats={trustStats}
          />
        </SectionScrollReveal>

        <SectionTransition variant="trust-benefits" role={activeRole} />

        <ScrollSpreadSection id="benefits" pin spread pinDuration="+=40%" compact>
          <SectionShell theme="benefits" className="relative w-full overflow-hidden py-8 md:py-12">
            <SectionAmbient role={activeRole} variant="benefits" />
            <Benefits
              label={role.benefits.label}
              title={role.benefits.title}
              subtitle={role.benefits.subtitle}
              items={role.benefits.items}
              applyLabel={tCommon("apply")}
              onApply={openApply}
            />
          </SectionShell>
        </ScrollSpreadSection>

        <SectionTransition variant="benefits-features" role={activeRole} />

        <HorizontalPinSection
          id="features"
          className="bg-[var(--theme-features-bg)]"
          intro={
            <FeaturesIntro
              label={role.whyJoin.label}
              title={role.whyJoin.title}
              subtitle={role.whyJoin.subtitle}
            />
          }
          panels={featureItems.map((item, i) => (
            <FeaturePinCard key={item.title} item={item} index={i} />
          ))}
        />

        <SectionTransition variant="features-steps" role={activeRole} />

        <SectionScrollReveal
          as="section"
          id="how-it-works"
          variant="stagger-up"
          className="theme-section bg-[var(--theme-steps-bg)] py-10 md:py-16"
        >
          <HowItWorks
            label={role.howItWorks.label}
            title={role.howItWorks.title}
            subtitle={role.howItWorks.subtitle}
            items={role.howItWorks.items}
          />
        </SectionScrollReveal>

        <SectionTransition variant="steps-cta" role={activeRole} />

        <SectionScrollReveal
          as="section"
          id="cta"
          variant="blur-rise"
          className="theme-section relative overflow-hidden bg-[var(--theme-cta-bg)] py-14 md:py-20"
        >
          <SectionAmbient role={activeRole} variant="cta" />
          <div data-reveal-content className="relative z-[1]">
            <JourneyCta
              title={role.cta.title}
              subtitle={role.cta.subtitle}
              role={activeRole}
            />
          </div>
        </SectionScrollReveal>

        <footer id="footer">
          <Footer />
        </footer>
      </main>
    </>
  );
}
