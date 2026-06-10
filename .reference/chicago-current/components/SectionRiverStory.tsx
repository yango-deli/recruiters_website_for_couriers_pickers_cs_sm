"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import SplitTextReveal from "@/components/ui/SplitTextReveal";
import { prefersReducedMotion, isMobile } from "@/lib/utils";

export default function SectionRiverStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const para1Ref = useRef<HTMLParagraphElement>(null);
  const para2Ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !pinRef.current) return;

      if (isMobile()) {
        // Mobile: simple scroll-triggered staggered reveals
        gsap.from(labelRef.current, {
          opacity: 0,
          y: 20,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: labelRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });

        gsap.from(para1Ref.current, {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: para1Ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });

        gsap.from(para2Ref.current, {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: para2Ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });

        return;
      }

      // Desktop: pinned scroll timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200%",
          pin: pinRef.current,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.from(
        labelRef.current,
        { opacity: 0, y: 20, duration: 0.15 },
        0
      );

      tl.from(
        headlineRef.current,
        { opacity: 0, y: 20, duration: 0.2 },
        0.1
      );

      tl.from(
        para1Ref.current,
        { opacity: 0, y: 30, duration: 0.2 },
        0.3
      );

      tl.from(
        para2Ref.current,
        { opacity: 0, y: 30, duration: 0.2 },
        0.6
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      data-theme="river-story"
      className="relative bg-bg text-text"
    >
      <div
        ref={pinRef}
        className="flex min-h-screen flex-col items-center justify-center px-6"
      >
        <div className="mx-auto max-w-4xl text-center">
          <p
            ref={labelRef}
            className="mb-12 text-[length:var(--text-caption)] uppercase tracking-[0.3em] opacity-50"
          >
            The River&apos;s Story
          </p>

          <div ref={headlineRef}>
            <SplitTextReveal
              type="chars"
              stagger={0.02}
              className="font-serif text-[length:var(--text-section)] leading-[1.1]"
            >
              The Potawatomi called it Shikaakwa — the place of the wild onion.
            </SplitTextReveal>
          </div>

          <p
            ref={para1Ref}
            className="mx-auto mt-16 max-w-2xl text-[length:var(--text-body)] leading-relaxed opacity-80"
          >
            Long before steel and glass, the river wound through prairie and
            wetland — home to the Potawatomi, the Miami, the Illinois. In
            1900, engineers reversed its flow entirely, sending its waters
            toward the Mississippi instead of the lake.
          </p>

          <p
            ref={para2Ref}
            className="mx-auto mt-10 max-w-2xl text-[length:var(--text-body)] leading-relaxed opacity-80"
          >
            Today, the river is coming back. Dams have come down. Floating
            gardens bloom where the water was once declared dead. And from a
            kayak, sitting inches above the surface, you hear it all.
          </p>
        </div>
      </div>

      {/* Gradient bridge into Green section */}
      <div className="absolute bottom-0 left-0 h-8 w-full bg-gradient-to-b from-transparent to-[#1a3a2a]" />
    </section>
  );
}
