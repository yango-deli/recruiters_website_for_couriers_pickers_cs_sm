import Image from "next/image";

type FigmaBandSectionProps = {
  id: string;
  image: string;
  width: number;
  height: number;
  variant?: "default" | "flush" | "rounded-top" | "rounded-top-black";
  ariaLabel?: string;
};

export function FigmaBandSection({
  id,
  image,
  width,
  height,
  variant = "default",
  ariaLabel,
}: FigmaBandSectionProps) {
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
        className="careers-figma-band__img"
        sizes="(max-width: 1366px) 100vw, 1366px"
      />
    </section>
  );
}
