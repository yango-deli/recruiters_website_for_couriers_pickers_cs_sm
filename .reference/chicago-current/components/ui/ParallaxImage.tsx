"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap-config";
import { prefersReducedMotion, isMobile } from "@/lib/utils";

interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  objectPosition?: string;
}

export default function ParallaxImage({
  src,
  alt,
  speed = 0.3,
  className = "",
  priority = false,
  sizes = "100vw",
  objectPosition = "center",
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !imageRef.current || !containerRef.current)
        return;

      const intensity = isMobile() ? speed * 0.5 : speed;
      const yDistance = 100 * intensity;

      gsap.set(imageRef.current, { yPercent: -yDistance / 2 });

      gsap.to(imageRef.current, {
        yPercent: yDistance / 2,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div ref={imageRef} className="relative h-[120%] w-full will-change-transform">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          style={{ objectPosition }}
          sizes={sizes}
          priority={priority}
        />
      </div>
    </div>
  );
}
