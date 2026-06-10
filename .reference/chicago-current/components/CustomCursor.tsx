"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { isMobile } from "@/lib/utils";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const isHoveringRef = useRef(false);
  const isOverImageRef = useRef(false);

  const animate = useCallback(() => {
    const lerp = 0.15;
    posRef.current.x += (targetRef.current.x - posRef.current.x) * lerp;
    posRef.current.y += (targetRef.current.y - posRef.current.y) * lerp;

    const scale = isHoveringRef.current ? 2 : isOverImageRef.current ? 1.5 : 1;
    const opacity = isOverImageRef.current && !isHoveringRef.current ? 0.8 : 1;

    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%) scale(${scale})`;
      cursorRef.current.style.opacity = `${opacity}`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isMobile() || "ontouchstart" in window) return;

    setIsActive(true);
    document.body.style.cursor = "none";

    const onMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    };

    // Event delegation — works for dynamically rendered elements
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button']")) {
        isHoveringRef.current = true;
      }
      if (target.closest("img, [class*='aspect-']")) {
        isOverImageRef.current = true;
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const related = e.relatedTarget as HTMLElement | null;
      if (
        target.closest("a, button, [role='button']") &&
        !related?.closest("a, button, [role='button']")
      ) {
        isHoveringRef.current = false;
      }
      if (
        target.closest("img, [class*='aspect-']") &&
        !related?.closest("img, [class*='aspect-']")
      ) {
        isOverImageRef.current = false;
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      setIsActive(false);
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  return (
    <div
      ref={cursorRef}
      className={`pointer-events-none fixed top-0 left-0 z-[100] h-5 w-5 rounded-full border border-white mix-blend-difference transition-[width,height] duration-300 ${isActive ? "block" : "hidden"}`}
      aria-hidden="true"
    />
  );
}
