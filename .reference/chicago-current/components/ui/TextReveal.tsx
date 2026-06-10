"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { prefersReducedMotion } from "@/lib/utils";

interface TextRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right";
  className?: string;
}

export default function TextReveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;

      const xFrom =
        direction === "left" ? -40 : direction === "right" ? 40 : 0;
      const yFrom = direction === "up" ? 40 : 0;

      gsap.from(ref.current, {
        y: yFrom,
        x: xFrom,
        opacity: 0,
        duration: 1,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      className={className}
    >
      {children}
    </div>
  );
}
