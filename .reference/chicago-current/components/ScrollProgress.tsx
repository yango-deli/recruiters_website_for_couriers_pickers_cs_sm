"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!barRef.current) return;

    gsap.to(barRef.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    });
  });

  return (
    <div className="fixed top-0 left-0 z-40 h-[2px] w-full">
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0 bg-[#c8956c]/60 shadow-[0_0_8px_rgba(200,149,108,0.4)]"
      />
    </div>
  );
}
