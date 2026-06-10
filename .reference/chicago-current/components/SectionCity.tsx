"use client";

import ParallaxImage from "@/components/ui/ParallaxImage";
import ImageReveal from "@/components/ui/ImageReveal";
import ScaleImage from "@/components/ui/ScaleImage";
import TextReveal from "@/components/ui/TextReveal";
import SplitTextReveal from "@/components/ui/SplitTextReveal";

export default function SectionCity() {
  return (
    <section
      data-theme="city"
      className="relative bg-bg py-32 text-text md:py-48"
    >
      <div className="mx-auto max-w-7xl px-6">
        <TextReveal>
          <p className="text-[length:var(--text-caption)] uppercase tracking-[0.3em] opacity-50">
            Mile 7
          </p>
        </TextReveal>
        <TextReveal delay={0.1}>
          <h2 className="mt-4 font-serif text-[length:var(--text-section)]">
            The City Closes In
          </h2>
        </TextReveal>

        {/* Dense image grid — fast-paced reveals */}
        <div className="mt-20 grid gap-4 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-8">
            <ScaleImage
              src="/images/city-01.jpg"
              alt="Chicago skyline from the river"
              className="relative aspect-[16/9] w-full"
              sizes="(max-width: 768px) 100vw, 67vw"
              objectPosition="center center"
            />
          </div>
          <div className="md:col-span-4">
            <ImageReveal
              src="/images/city-02.jpg"
              alt="Bridge architecture from below"
              direction="right"
              className="relative aspect-[3/4] w-full"
              sizes="(max-width: 768px) 100vw, 33vw"
              objectPosition="center center"
            />
          </div>
          <div className="md:col-span-5">
            <ParallaxImage
              src="/images/city-03.jpg"
              alt="Reflections of buildings in the water"
              speed={0.15}
              className="relative aspect-[2/3] w-full"
              sizes="(max-width: 768px) 100vw, 42vw"
              objectPosition="center 30%"
            />
          </div>
          <div className="flex items-center md:col-span-7">
            <TextReveal className="px-4 md:px-12">
              <p className="text-[length:var(--text-body)] leading-relaxed">
                Past the Chicago &amp; Northwestern Railway Bridge — a
                behemoth completed in 1908 — the buildings press in from both
                sides. At Wolf Point, where traders have gathered since the
                1780s, the river&apos;s three branches converge. Tour boat
                wakes rock the kayak as each bridge announces a new chapter.
              </p>
            </TextReveal>
          </div>
        </div>

        {/* Pull quote */}
        <div className="my-32 flex items-center justify-center md:my-48">
          <SplitTextReveal
            type="words"
            stagger={0.05}
            className="mx-auto max-w-3xl text-center font-serif text-[length:var(--text-section)] italic leading-[1.2]"
          >
            It&apos;s almost a warm embrace — the canyon walls of glass and
            steel, sheltering rather than looming.
          </SplitTextReveal>
        </div>

        {/* Final city image */}
        <ImageReveal
          src="/images/city-04.jpg"
          alt="Wolf Point, the historic confluence of the Chicago River's three branches"
          direction="top"
          className="relative aspect-[16/9] w-full"
          objectPosition="center center"
        />
      </div>

      {/* Gradient bridge into Summit section */}
      <div className="absolute bottom-0 left-0 h-8 w-full bg-gradient-to-b from-transparent to-[#c8956c]" />
    </section>
  );
}
