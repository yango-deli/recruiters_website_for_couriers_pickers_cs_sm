"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import ParallaxImage from "@/components/ui/ParallaxImage";
import ImageReveal from "@/components/ui/ImageReveal";
import TextReveal from "@/components/ui/TextReveal";
import ScrollHighlight from "@/components/ui/ScrollHighlight";
import { prefersReducedMotion } from "@/lib/utils";

export default function SectionTransition() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !sectionRef.current) return;

      gsap.fromTo(
        sectionRef.current,
        { "--bg": "#1a3a2a", "--text": "#e8e0d0" },
        {
          "--bg": "#3a3e44",
          "--text": "#e8e4e0",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "top 10%",
            scrub: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      data-theme="transition"
      className="relative bg-bg py-32 text-text transition-colors md:py-48"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Mile marker + title */}
        <TextReveal>
          <p className="text-[length:var(--text-caption)] uppercase tracking-[0.3em] opacity-50">
            Mile 4
          </p>
        </TextReveal>
        <TextReveal delay={0.1}>
          <h2 className="mt-4 font-serif text-[length:var(--text-section)]">
            The Corridor
          </h2>
        </TextReveal>

        <ScrollHighlight className="mx-auto mt-12 max-w-3xl text-[length:var(--text-body)] leading-relaxed">
          The green corridor ends without ceremony. Past Lincoln Yards, the trees thin and the banks harden to concrete. It&apos;s eerily quiet for how central we are to I-94. You feel the city before you see it — a shift in the air, a deepening of sound.
        </ScrollHighlight>

        <div className="mt-24 grid gap-6 md:grid-cols-12 md:gap-8">
          <div className="flex flex-col gap-6 md:col-span-7 md:gap-8">
            <ParallaxImage
              src="/images/transition-01.jpg"
              alt="The Chicago Tribune printing plant from the river"
              speed={0.25}
              className="relative aspect-[16/10] w-full"
              sizes="(max-width: 768px) 100vw, 58vw"
              objectPosition="center center"
            />
            <TextReveal>
              <p className="text-[length:var(--text-body)] leading-relaxed opacity-80">
                Loading docks sit silent on the east bank. A railroad bridge
                towers a hundred feet above. This is where the river&apos;s
                industrial past is most visible — rusted steel and the ghosts
                of factories that once drove the nation&apos;s economy.
              </p>
            </TextReveal>
          </div>
          <div className="md:col-span-5">
            <ImageReveal
              src="/images/transition-02.jpg"
              alt="Weathered concrete along the riverbank"
              direction="bottom"
              className="relative aspect-[3/4] w-full"
              objectPosition="center center"
            />
          </div>
        </div>

        <TextReveal className="mx-auto mt-24 max-w-3xl text-center">
          <p className="text-[length:var(--text-body)] leading-relaxed">
            And yet, even here, there are signs of return. The Wild
            Mile&apos;s floating gardens mark where the river&apos;s newest
            chapter begins.
          </p>
        </TextReveal>
      </div>
    </section>
  );
}
