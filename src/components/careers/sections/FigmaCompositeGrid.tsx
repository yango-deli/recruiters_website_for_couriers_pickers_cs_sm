import Image from "next/image";

type FigmaCompositeGridProps = {
  cards: string[];
  className?: string;
  cardWidth?: number;
  cardHeight?: number;
};

export function FigmaCompositeGrid({
  cards,
  className = "",
  cardWidth = 406,
  cardHeight = 420,
}: FigmaCompositeGridProps) {
  return (
    <div className={`careers-figma-composite ${className}`.trim()}>
      {cards.map((src) => (
        <Image
          key={src}
          src={src}
          alt=""
          width={cardWidth}
          height={cardHeight}
          className="careers-figma-composite__card"
        />
      ))}
    </div>
  );
}
