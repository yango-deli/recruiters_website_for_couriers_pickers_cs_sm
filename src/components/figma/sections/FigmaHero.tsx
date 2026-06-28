"use client";

import Image from "next/image";
import type { WpHeroContent } from "@/lib/wp/parse-role-page";
import type { Role } from "@/types/role";
import { formAnchorId } from "../types";

type FigmaHeroProps = {
  hero: WpHeroContent;
  role: Role;
  centered?: boolean;
};

export function FigmaHero({ hero, role, centered = false }: FigmaHeroProps) {
  const roleClass =
    role === "couriers" ? "figma-hero--couriers" : `figma-hero--${role}`;

  const shellClass =
    role === "couriers"
      ? "figma-hero__container figma-hero__container--full"
      : "figma-container figma-hero__container";

  return (
    <section id="hero" className={`figma-hero ${roleClass}`}>
      <div className={shellClass}>
        <div
          className={`figma-hero__inner ${centered ? "figma-hero__inner--centered" : ""}`}
        >
          <div className="figma-hero__copy">
            <h1
              className="figma-hero__title"
              dangerouslySetInnerHTML={{ __html: hero.titleHtml }}
            />
            {hero.subtitle ? (
              <p className="figma-hero__subtitle">{hero.subtitle}</p>
            ) : null}
            <div className="figma-hero__cta-wrap">
              <a href={`#${formAnchorId(role)}`} className="figma-btn-primary">
                {hero.cta}
              </a>
            </div>
          </div>
          <div className="figma-hero__media">
            <Image
              src={hero.image}
              alt=""
              width={606}
              height={566}
              priority
              className="figma-hero__image"
              sizes="(max-width: 768px) 100vw, 540px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
