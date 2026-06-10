"use client";

import ScaleImage from "@/components/ui/ScaleImage";
import TextReveal from "@/components/ui/TextReveal";
import SplitTextReveal from "@/components/ui/SplitTextReveal";
import ScrollHighlight from "@/components/ui/ScrollHighlight";

export default function SectionSummit() {
  return (
    <section
      data-theme="summit"
      className="relative bg-bg text-text"
    >
      {/* Full-bleed hero image */}
      <div className="relative h-screen">
        <ScaleImage
          src="/images/summit-01.jpg"
          alt="A lone kayak at the Riverwalk boat launch"
          className="h-full w-full"
          objectPosition="center 60%"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/40 to-bg/10" />

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 px-6 [text-shadow:0_2px_12px_rgba(0,0,0,0.3)]">
          <TextReveal>
            <p className="text-[length:var(--text-caption)] uppercase tracking-[0.3em] opacity-60">
              Mile 9 &middot; Journey&apos;s End
            </p>
          </TextReveal>
          <TextReveal delay={0.2}>
            <h2 className="mt-4 text-center font-serif text-[length:var(--text-section)]">
              The Summit
            </h2>
          </TextReveal>
        </div>
      </div>

      {/* Closing content */}
      <div className="px-6 py-32 md:py-48">
        <div className="mx-auto max-w-3xl">
          <TextReveal>
            <p className="text-[length:var(--text-body)] leading-relaxed">
              We hauled the kayaks up the cascading steps of the River
              Theater, nearly seven hours after pushing off from Lincoln
              Square. Riverwalk pedestrians eyed our overstuffed kayaks and
              rosy cheeks. Nine miles of river behind us — one last
              high-five.
            </p>
          </TextReveal>

          <div className="my-24 md:my-32">
            <SplitTextReveal
              type="chars"
              stagger={0.02}
              delay={0.2}
              className="text-center font-serif text-[length:var(--text-section)] italic leading-[1.2]"
            >
              If this isn&apos;t true adventure, I don&apos;t know what is.
            </SplitTextReveal>
          </div>

          <ScrollHighlight className="mt-8 text-center text-[length:var(--text-body)] leading-relaxed" end="bottom 65%">
            The river doesn&apos;t belong to the city. The city belongs to the river.
          </ScrollHighlight>

          {/* Closing mark */}
          <TextReveal delay={0.3}>
            <div className="mt-20 flex justify-center">
              <div className="h-px w-16 bg-text/20" />
            </div>
          </TextReveal>
        </div>
      </div>

      {/* Gradient bridge into Footer */}
      <div className="absolute bottom-0 left-0 h-6 w-full bg-gradient-to-b from-transparent to-[#1a1410]" />
    </section>
  );
}
