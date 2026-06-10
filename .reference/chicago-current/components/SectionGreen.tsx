"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import ImageReveal from "@/components/ui/ImageReveal";
import TextReveal from "@/components/ui/TextReveal";
import { prefersReducedMotion, isMobile } from "@/lib/utils";

type RevealDirection = "left" | "right" | "top" | "bottom";

const images = [
  {
    src: "/images/green-01.jpg",
    alt: "Dense tree canopy arching over the river",
    caption: "North Branch, looking south",
    orientation: "landscape" as const,
    objectPosition: "70% center",
    mobileReveal: "left" as RevealDirection,
  },
  {
    src: "/images/green-02.jpg",
    alt: "Kayaker paddling through a tunnel of green",
    caption: "The green tunnel near Horner Park",
    orientation: "landscape" as const,
    objectPosition: "70% center",
    mobileReveal: "right" as RevealDirection,
  },
  {
    src: "/images/green-04.jpg",
    alt: "A juvenile black-crowned night heron on the riverbank",
    caption: "Juvenile black-crowned night heron",
    orientation: "landscape" as const,
    objectPosition: "30% center",
    mobileReveal: "bottom" as RevealDirection,
  },
  {
    src: "/images/green-03.jpg",
    alt: "Native wildflowers at Horner Park Natural Area",
    caption: "Wildflowers at Horner Park",
    orientation: "portrait" as const,
    objectPosition: "center center",
    mobileReveal: "left" as RevealDirection,
  },
];

export default function SectionGreen() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || isMobile() || !trackRef.current) return;

      const scrollTween = gsap.to(trackRef.current, {
        x: () => -(trackRef.current!.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${trackRef.current!.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Nested animations: each image scales up and fades in within its panel
      const panels = gsap.utils.toArray<HTMLElement>(
        ".green-image-panel",
        trackRef.current
      );

      panels.forEach((panel) => {
        const inner = panel.querySelector(".green-image-inner");
        if (!inner) return;

        gsap.fromTo(
          inner,
          { scale: 1.15, opacity: 0.6 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scrollTween,
              start: "left 90%",
              end: "left 30%",
              scrub: true,
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      data-theme="green"
      className="relative bg-bg text-text"
    >
      {/* Section header (mobile) */}
      <div className="px-6 pt-32 pb-12 md:hidden">
        <TextReveal>
          <p className="text-[length:var(--text-caption)] uppercase tracking-[0.3em] opacity-50">
            Mile 2
          </p>
        </TextReveal>
        <TextReveal delay={0.1}>
          <h2 className="mt-4 font-serif text-[length:var(--text-section)]">
            Into the Green
          </h2>
        </TextReveal>
        <TextReveal delay={0.15}>
          <p className="mt-4 max-w-sm text-[length:var(--text-body)] leading-relaxed opacity-70">
            The North Branch narrows and overhanging branches form tunnels
            — ten degrees cooler in the shade.
          </p>
        </TextReveal>
      </div>

      {/* Mobile: animated vertical gallery */}
      <div className="flex flex-col gap-6 px-6 pb-24 md:hidden">
        {images.map((img, i) => {
          const isPortrait = img.orientation === "portrait";
          return (
            <ImageReveal
              key={i}
              src={img.src}
              alt={img.alt}
              direction={img.mobileReveal}
              objectPosition={img.objectPosition}
              sizes="100vw"
              className={`relative w-full ${isPortrait ? "aspect-[2/3]" : "aspect-[4/3]"}`}
            />
          );
        })}
      </div>

      {/* Desktop: horizontal scroll track */}
      <div
        ref={trackRef}
        className="hidden md:flex md:h-screen md:flex-row md:items-center md:gap-12 md:px-0 will-change-transform"
      >
        {/* Title panel */}
        <div className="shrink-0 md:flex md:h-full md:w-screen md:flex-col md:items-center md:justify-center md:px-24">
          <p className="text-[length:var(--text-caption)] uppercase tracking-[0.3em] opacity-50">
            Mile 2
          </p>
          <h2 className="mt-4 font-serif text-[length:var(--text-hero)] leading-[0.9]">
            Into the Green
          </h2>
          <p className="mt-6 max-w-md text-[length:var(--text-body)] leading-relaxed opacity-70">
            The North Branch narrows and overhanging branches form tunnels —
            ten degrees cooler in the shade. At Horner Park, purple
            coneflowers line the riverbank. Here, the river remembers what it
            was before concrete and steel.
          </p>
        </div>

        {/* Image panels */}
        {images.map((img, i) => {
          const isPortrait = img.orientation === "portrait";
          return (
            <div
              key={i}
              className={`green-image-panel group relative shrink-0 overflow-hidden md:h-[80vh] ${isPortrait ? "md:w-[40vw]" : "md:w-[60vw]"}`}
            >
              <div className="green-image-inner relative h-full w-full overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  style={{ objectPosition: img.objectPosition }}
                  sizes={isPortrait ? "40vw" : "60vw"}
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/50 to-transparent px-6 pb-5 pt-12 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <p className="text-[length:var(--text-caption)] tracking-[0.1em] text-white/80">
                  {img.caption}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
