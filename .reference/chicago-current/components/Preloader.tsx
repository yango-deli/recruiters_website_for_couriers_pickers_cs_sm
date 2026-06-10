"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { usePreloader } from "@/providers/PreloaderProvider";

export default function Preloader() {
  const { isLoading } = usePreloader();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!titleRef.current || !barRef.current) return;

      const chars = titleRef.current.textContent?.split("") || [];
      titleRef.current.innerHTML = "";

      const spans = chars.map((char) => {
        const span = document.createElement("span");
        span.style.display = "inline-block";
        span.textContent = char === " " ? "\u00A0" : char;
        titleRef.current!.appendChild(span);
        return span;
      });

      gsap.from(spans, {
        yPercent: 100,
        opacity: 0,
        duration: 0.6,
        stagger: 0.04,
        ease: "power3.out",
        delay: 0.3,
      });

      gsap.to(barRef.current, {
        scaleX: 1,
        duration: 1.8,
        delay: 0.5,
        ease: "power2.inOut",
      });
    },
    { scope: containerRef }
  );

  useGSAP(
    () => {
      if (isLoading || !containerRef.current) return;

      gsap.to(containerRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: "power3.inOut",
        delay: 0.2,
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = "none";
          }
        },
      });
    },
    { scope: containerRef, dependencies: [isLoading] }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#2c1810]"
      aria-hidden={!isLoading}
    >
      <div
        ref={titleRef}
        className="overflow-hidden font-serif text-[clamp(1.5rem,4vw,3rem)] tracking-tight text-[#f5f0e8]"
      >
        Chicago Current
      </div>

      <div className="mt-8 h-[1px] w-48 overflow-hidden bg-[#f5f0e8]/20">
        <div
          ref={barRef}
          className="h-full w-full origin-left scale-x-0 bg-[#c8956c]"
        />
      </div>
    </div>
  );
}
