"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import ParallaxImage from "@/components/ui/ParallaxImage";
import SplitTextReveal from "@/components/ui/SplitTextReveal";
import TextReveal from "@/components/ui/TextReveal";

export default function Hero() {
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!scrollIndicatorRef.current) return;

    // Bounce animation
    gsap.to(scrollIndicatorRef.current, {
      y: 10,
      opacity: 0.4,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });

    // Fade out on scroll
    gsap.to(scrollIndicatorRef.current, {
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: scrollIndicatorRef.current,
        start: "top 95%",
        end: "top 75%",
        scrub: true,
      },
    });
  });

  return (
    <section
      data-theme="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-bg text-text"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <ParallaxImage
          src="/images/hero.jpg"
          alt="Kayakers on the Chicago River at dawn"
          speed={0.2}
          className="h-full w-full"
          priority
          objectPosition="center center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/20 via-bg/60 to-bg/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center [text-shadow:0_1px_12px_rgba(245,240,232,0.6),0_0_40px_rgba(245,240,232,0.3)]">
        <SplitTextReveal
          type="chars"
          stagger={0.04}
          className="font-serif text-[length:var(--text-hero)] leading-[0.9] tracking-tight"
        >
          Charting Course
        </SplitTextReveal>

        <TextReveal delay={0.6} className="mt-6">
          <p className="font-serif text-[length:var(--text-section)] italic leading-tight opacity-80">
            Paddling the Chicago River
          </p>
        </TextReveal>

        <TextReveal delay={1} className="mt-8">
          <p className="text-[length:var(--text-caption)] uppercase tracking-[0.3em] opacity-70">
            Photography by Ryan Calacsan &middot; Words by Erica Zazo
          </p>
        </TextReveal>

        <TextReveal delay={1.2} className="mt-2">
          <p className="text-[length:var(--text-caption)] uppercase tracking-[0.2em] opacity-50">
            Mountain Gazette
          </p>
        </TextReveal>
      </div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 z-10 h-32 w-full bg-gradient-to-b from-transparent to-[#ede6da]" />

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="opacity-60"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
