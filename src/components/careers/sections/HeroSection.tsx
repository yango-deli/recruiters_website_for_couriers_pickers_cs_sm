"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import type { HeroContent } from "@/lib/landing/types";
import type { Role } from "@/types/role";
import { FIGMA_MOBILE_HERO_HEIGHT } from "@/lib/landing/mobile-assets";
import { formAnchorId } from "../types";

type HeroSectionProps = {
  hero: HeroContent;
  role: Role;
  centered?: boolean;
};

function heroTitle(hero: HeroContent): string {
  if (hero.title) return hero.title;
  if (hero.titleHtml) return hero.titleHtml.replace(/<[^>]+>/g, "");
  return "";
}

function FigmaMobileHero({
  hero,
  role,
}: {
  hero: HeroContent;
  role: Role;
}) {
  const mobileSrc =
    hero.imageMobile?.trim() || `/careers/${role}/hero-mobile.png`;
  const mobileHeight = FIGMA_MOBILE_HERO_HEIGHT[role] ?? 482;
  const isUploaded =
    Boolean(hero.imageMobile?.trim()) &&
    (hero.imageMobile!.startsWith("http") || hero.imageMobile!.startsWith("/"));

  return (
    <div className="careers-hero__figma-mobile">
      <Image
        src={mobileSrc}
        alt=""
        width={375}
        height={mobileHeight}
        priority
        unoptimized={isUploaded}
        className="careers-hero__figma-mobile-img"
        sizes="100vw"
      />
      <h1 className="careers-hero__figma-mobile-sr">{heroTitle(hero)}</h1>
      <a
        href={`#${formAnchorId(role)}`}
        className="careers-hero__figma-mobile-cta"
      >
        {hero.cta}
      </a>
    </div>
  );
}

function FigmaHeroShell({
  hero,
  role,
  children,
}: {
  hero: HeroContent;
  role: Role;
  children: ReactNode;
}) {
  return (
    <>
      <div className="careers-hero__figma-desktop">{children}</div>
      <FigmaMobileHero hero={hero} role={role} />
    </>
  );
}

/** Couriers — Figma node 2:25219 */
function CouriersHero({ hero, role }: { hero: HeroContent; role: Role }) {
  return (
    <section id="hero" className="careers-hero careers-hero--couriers">
      <FigmaHeroShell hero={hero} role={role}>
        <div className="careers-hero__figma">
          <div className="careers-hero__figma-photo">
            <div className="careers-hero__figma-photo-frame">
              <Image
                src={hero.image}
                alt=""
                fill
                priority
                unoptimized
                className="careers-hero__figma-photo-img"
                sizes="606px"
              />
            </div>
            <div className="careers-hero__figma-arrows" aria-hidden>
              <Image
                src="/careers/shared/arrow-circle.svg"
                alt=""
                width={62}
                height={62}
                className="careers-hero__figma-arrow careers-hero__figma-arrow--circle"
              />
              <Image
                src="/careers/shared/arrow-square.svg"
                alt=""
                width={62}
                height={62}
                className="careers-hero__figma-arrow"
              />
            </div>
          </div>
          <div className="careers-hero__figma-panel">
            <div className="careers-hero__figma-title-wrap">
              <h1 className="careers-hero__figma-title">{heroTitle(hero)}</h1>
            </div>
            <div className="careers-hero__figma-bottom">
              {hero.subtitle ? (
                <p className="careers-hero__figma-subtitle">{hero.subtitle}</p>
              ) : null}
              <a
                href={`#${formAnchorId(role)}`}
                className="careers-hero__figma-cta"
              >
                {hero.cta}
              </a>
            </div>
          </div>
        </div>
      </FigmaHeroShell>
    </section>
  );
}

/** Pickers — responsive HTML hero (desktop + mobile use the same photo). */
function PickersHero({ hero, role }: { hero: HeroContent; role: Role }) {
  return (
    <section id="hero" className="careers-hero careers-hero--pickers">
      <div className="careers-hero__figma careers-hero__figma--pickers careers-hero__figma--responsive">
        <div className="careers-hero__figma-photo">
          <div className="careers-hero__figma-photo-frame">
            <Image
              src={hero.image}
              alt=""
              fill
              priority
              unoptimized
              className="careers-hero__figma-photo-img careers-hero__figma-photo-img--pickers"
              sizes="(max-width: 767px) 100vw, 606px"
            />
          </div>
        </div>
        <div className="careers-hero__figma-panel">
          <div className="careers-hero__figma-title-wrap">
            <h1 className="careers-hero__figma-title">{heroTitle(hero)}</h1>
          </div>
          <div className="careers-hero__figma-bottom">
            {hero.subtitle ? (
              <p className="careers-hero__figma-subtitle">{hero.subtitle}</p>
            ) : null}
            <a
              href={`#${formAnchorId(role)}`}
              className="careers-hero__figma-cta"
            >
              {hero.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Support / service-rep — Figma node 2:51. Responsive HTML hero (no baked-text PNG on mobile). */
function SupportHero({ hero, role }: { hero: HeroContent; role: Role }) {
  const roleMod = role === "service-rep" ? "service-rep" : "support";
  return (
    <section id="hero" className={`careers-hero careers-hero--${roleMod}`}>
      <div
        className={`careers-hero__figma careers-hero__figma--${roleMod} careers-hero__figma--responsive`}
      >
        <div className="careers-hero__figma-photo">
          <div className="careers-hero__figma-photo-frame">
            <Image
              src={hero.image}
              alt=""
              fill
              priority
              unoptimized
              className={`careers-hero__figma-photo-img careers-hero__figma-photo-img--${roleMod}`}
              sizes="(max-width: 767px) 100vw, 606px"
            />
          </div>
        </div>
        <div className="careers-hero__figma-panel">
          <div className="careers-hero__figma-title-wrap">
            <h1 className="careers-hero__figma-title">{heroTitle(hero)}</h1>
          </div>
          <div className="careers-hero__figma-bottom">
            {hero.subtitle ? (
              <p className="careers-hero__figma-subtitle">{hero.subtitle}</p>
            ) : null}
            <a
              href={`#${formAnchorId(role)}`}
              className="careers-hero__figma-cta"
            >
              {hero.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HeroSection({ hero, role, centered = false }: HeroSectionProps) {
  if (role === "couriers") {
    return <CouriersHero hero={hero} role={role} />;
  }

  if (role === "pickers") {
    return <PickersHero hero={hero} role={role} />;
  }

  if (role === "support" || role === "service-rep") {
    return <SupportHero hero={hero} role={role} />;
  }

  const roleClass = `careers-hero--${role}`;
  const shellClass = "careers-container careers-hero__container";

  return (
    <section id="hero" className={`careers-hero ${roleClass}`}>
      <div className={shellClass}>
        <div
          className={`careers-hero__inner ${centered ? "careers-hero__inner--centered" : ""}`}
        >
          <div className="careers-hero__copy">
            <h1 className="careers-hero__title">
              {hero.titleHtml ? (
                <span dangerouslySetInnerHTML={{ __html: hero.titleHtml }} />
              ) : (
                heroTitle(hero)
              )}
            </h1>
            {hero.subtitle ? (
              <p className="careers-hero__subtitle">{hero.subtitle}</p>
            ) : null}
            <div className="careers-hero__cta-wrap">
              <a href={`#${formAnchorId(role)}`} className="careers-btn-primary">
                {hero.cta}
              </a>
            </div>
          </div>
          <div className="careers-hero__media">
            <Image
              src={hero.image}
              alt=""
              width={606}
              height={566}
              priority
              className="careers-hero__image"
              sizes="(max-width: 768px) 100vw, 540px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
