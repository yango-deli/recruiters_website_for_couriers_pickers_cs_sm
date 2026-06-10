"use client";

import ImageReveal from "@/components/ui/ImageReveal";
import ScaleImage from "@/components/ui/ScaleImage";
import TextReveal from "@/components/ui/TextReveal";
import SplitTextReveal from "@/components/ui/SplitTextReveal";
import ScrollHighlight from "@/components/ui/ScrollHighlight";

export default function SectionLaunch() {
  return (
    <section
      data-theme="launch"
      className="relative bg-bg py-32 text-text md:py-48"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Mile marker + title */}
        <TextReveal className="mx-auto max-w-2xl text-center">
          <p className="text-[length:var(--text-caption)] uppercase tracking-[0.3em] opacity-50">
            Mile 0
          </p>
        </TextReveal>
        <TextReveal delay={0.1} className="mx-auto max-w-2xl text-center">
          <h2 className="mt-4 font-serif text-[length:var(--text-section)]">
            The Launch
          </h2>
        </TextReveal>

        {/* Intro text */}
        <TextReveal className="mx-auto mt-12 max-w-2xl text-center">
          <p className="text-[length:var(--text-body)] leading-relaxed">
            We inflated our Kokopelli kayaks at River Park in Lincoln Square,
            the North Shore Channel still and dark in the early light.
          </p>
        </TextReveal>

        {/* Pull quote — fishing dad */}
        <div className="my-16 flex items-center justify-center md:my-24">
          <SplitTextReveal
            type="words"
            stagger={0.05}
            className="mx-auto max-w-2xl text-center font-serif text-[length:var(--text-section)] italic leading-[1.2]"
          >
            &ldquo;Great day for a kayak.&rdquo;
          </SplitTextReveal>
        </div>

        {/* Image grid */}
        <div className="mt-24 grid gap-6 md:grid-cols-2 md:gap-8">
          <ImageReveal
            src="/images/launch-01.jpg"
            alt="Pre-paddle preparations at the River Park dock"
            direction="bottom"
            className="relative aspect-[3/4] w-full"
            objectPosition="center center"
          />
          <div className="flex flex-col gap-6 md:gap-8 md:pt-24">
            <ScaleImage
              src="/images/launch-02.jpg"
              alt="Paddling past the North Shore Channel waterfall"
              className="relative aspect-[4/3] w-full"
              sizes="(max-width: 768px) 100vw, 50vw"
              objectPosition="center center"
            />
            <TextReveal>
              <p className="text-[length:var(--text-caption)] uppercase tracking-[0.2em] opacity-60">
                North Shore Channel &middot; 6:47 AM
              </p>
            </TextReveal>
          </div>
        </div>

        {/* Pull text — scroll highlight */}
        <ScrollHighlight className="mx-auto mt-24 max-w-3xl text-[length:var(--text-body)] leading-relaxed">
          There&apos;s a particular silence that settles over a city river in the early morning — not the absence of sound, but a muffling of it, as if the water itself absorbs the noise of a waking metropolis.
        </ScrollHighlight>
      </div>

      {/* Bottom gradient fade into River Story */}
      <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-b from-transparent to-[#f0ece4]" />
    </section>
  );
}
