"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { prefersReducedMotion } from "@/lib/utils";

interface ScrollHighlightProps {
  children: string;
  className?: string;
  tag?: "p" | "blockquote";
  start?: string;
  end?: string;
}

export default function ScrollHighlight({
  children,
  className = "",
  tag = "p",
  start = "top 75%",
  end = "bottom 35%",
}: ScrollHighlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const el = containerRef.current.querySelector("[data-highlight-text]");
      if (!el) return;

      const text = el.textContent || "";
      const words = text.split(/\s+/).filter(Boolean);

      el.innerHTML = "";

      const wordSpans: HTMLSpanElement[] = [];

      words.forEach((word, i) => {
        const span = document.createElement("span");
        span.style.display = "inline";
        span.textContent = word;
        wordSpans.push(span);

        el.appendChild(span);

        if (i < words.length - 1) {
          el.appendChild(document.createTextNode(" "));
        }
      });

      if (prefersReducedMotion()) return;

      gsap.set(wordSpans, { opacity: 0.15 });

      gsap.to(wordSpans, {
        opacity: 1,
        stagger: Math.max(0.02, 0.8 / wordSpans.length),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start,
          end,
          scrub: true,
        },
      });
    },
    { scope: containerRef }
  );

  const Tag = tag;

  return (
    <div ref={containerRef} className={className}>
      <Tag data-highlight-text>{children}</Tag>
    </div>
  );
}
