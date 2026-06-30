import Image from "next/image";
import type { Role } from "@/types/role";
import {
  careersMobileAssetPath,
  FIGMA_MOBILE_BAND_HEIGHTS,
} from "@/lib/landing/mobile-assets";

type FigmaBandSectionProps = {
  id: string;
  image: string;
  width: number;
  height: number;
  role: Role;
  variant?: "default" | "flush" | "rounded-top" | "rounded-top-black";
  ariaLabel?: string;
};

export function FigmaBandSection({
  id,
  image,
  width,
  height,
  role,
  variant = "default",
  ariaLabel,
}: FigmaBandSectionProps) {
  const mobileImage = careersMobileAssetPath(image);
  const mobileHeight =
    FIGMA_MOBILE_BAND_HEIGHTS[role]?.[id] ??
    Math.round((height / width) * 375);

  return (
    <section
      id={id}
      className={`careers-figma-band careers-figma-band--${variant}`}
      aria-label={ariaLabel}
    >
      <Image
        src={image}
        alt=""
        width={width}
        height={height}
        unoptimized
        className="careers-figma-band__img careers-figma-band__img--desktop"
        sizes="(max-width: 767px) 0px, 1366px"
      />
      <Image
        src={mobileImage}
        alt=""
        width={375}
        height={mobileHeight}
        unoptimized
        className="careers-figma-band__img careers-figma-band__img--mobile"
        sizes="100vw"
      />
    </section>
  );
}
