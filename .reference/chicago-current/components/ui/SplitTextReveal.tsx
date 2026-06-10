"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { prefersReducedMotion } from "@/lib/utils";

interface SplitTextRevealProps {
  children: string;
  type?: "words" | "chars";
  stagger?: number;
  className?: string;
  delay?: number;
}

export default function SplitTextReveal({
  children,
  type = "words",
  stagger = 0.03,
  className = "",
  delay = 0,
}: SplitTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !containerRef.current) return;

      const text = containerRef.current.textContent || "";
      const words = text.split(/\s+/).filter(Boolean);

      containerRef.current.innerHTML = "";

      const animTargets: HTMLSpanElement[] = [];

      words.forEach((word, wordIndex) => {
        // Word wrapper — keeps word together for natural line breaking
        const wordWrapper = document.createElement("span");
        wordWrapper.style.display = "inline-block";
        wordWrapper.style.whiteSpace = "nowrap";

        if (type === "chars") {
          // Split word into individual characters
          word.split("").forEach((char) => {
            const charOuter = document.createElement("span");
            charOuter.style.display = "inline-block";
            charOuter.style.clipPath = "inset(-0.3em -0.15em)";

            const charInner = document.createElement("span");
            charInner.style.display = "inline-block";
            charInner.textContent = char;
            charOuter.appendChild(charInner);

            wordWrapper.appendChild(charOuter);
            animTargets.push(charInner);
          });
        } else {
          // Whole word animation
          const outer = document.createElement("span");
          outer.style.display = "inline-block";
          outer.style.clipPath = "inset(-0.3em -0.15em)";

          const inner = document.createElement("span");
          inner.style.display = "inline-block";
          inner.textContent = word;
          outer.appendChild(inner);

          wordWrapper.appendChild(outer);
          animTargets.push(inner);
        }

        containerRef.current!.appendChild(wordWrapper);

        // Add space between words (except after last word)
        if (wordIndex < words.length - 1) {
          const space = document.createTextNode("\u00A0");
          containerRef.current!.appendChild(space);
        }
      });

      gsap.from(animTargets, {
        yPercent: 110,
        opacity: 0,
        duration: 0.8,
        stagger,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
