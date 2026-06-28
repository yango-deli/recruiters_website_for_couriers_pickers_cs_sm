"use client";

import Image from "next/image";
import { resolveHeroImage } from "@/lib/role-images";
import type { Role } from "@/types/role";
import type { RoleHero } from "../types";
import { formAnchorId } from "../types";

type FigmaHeroProps = {
  hero: RoleHero;
  role: Role;
};

export function FigmaHero({ hero, role }: FigmaHeroProps) {
  const imageSrc = resolveHeroImage(role, hero.image);

  return (
    <section id="hero" className="figma-hero">
      <div className="figma-container py-8 md:py-10">
        <div className="figma-hero__inner flex flex-col-reverse items-center gap-8 md:flex-row md:items-stretch md:gap-6 lg:gap-10">
          <div className="flex flex-1 flex-col justify-center text-center md:text-start md:max-w-[52%]">
            <h1 className="figma-hero__title text-balance">{hero.title}</h1>
            <p className="figma-hero__subtitle mt-4 text-balance">{hero.subtitle}</p>
            <div className="mt-6 flex justify-center md:justify-start">
              <a href={`#${formAnchorId(role)}`} className="figma-btn-primary">
                {hero.cta}
              </a>
            </div>
          </div>
          <div className="relative flex flex-1 items-center justify-center md:max-w-[48%]">
            <div className="relative aspect-[4/3] w-full max-w-lg">
              <Image
                src={imageSrc}
                alt=""
                fill
                priority
                className="object-contain object-center"
                sizes="(max-width: 768px) 100vw, 540px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
