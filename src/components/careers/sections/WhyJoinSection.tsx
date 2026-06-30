import Image from "next/image";
import type { CardItem } from "@/lib/landing/types";
import { FigmaCompositeGrid } from "./FigmaCompositeGrid";

type WhyJoinSectionProps = {
  title: string;
  items?: CardItem[];
  compositeCards?: string[];
  variant: "courier" | "standard";
};

export function WhyJoinSection({
  title,
  items = [],
  compositeCards,
  variant,
}: WhyJoinSectionProps) {
  const isStandard = variant === "standard";

  if (compositeCards?.length) {
    return (
      <section
        id="why-join"
        className="careers-why-join careers-why-join--figma"
      >
        <div className="careers-why-join__figma-shell">
          <div className="careers-container careers-container--figma">
            <h2 className="careers-section-title careers-section-title--figma-end careers-why-join__figma-title">
              {title}
            </h2>
            <FigmaCompositeGrid
              cards={compositeCards}
              className="careers-why-join__figma-grid"
              cardWidth={406}
              cardHeight={325}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="why-join"
      className={`careers-why-join ${isStandard ? "careers-why-join--standard" : "careers-why-join--courier"}`}
    >
      <div className="careers-container">
        <h2 className="careers-section-title">{title}</h2>
        <div
          className={
            isStandard ? "careers-why-join__grid" : "careers-why-join__list"
          }
        >
          {items.map((item) => {
            const textPanel =
              item.panelVariant ?? (isStandard ? "black" : "grey");
            const imageFirst = item.imageFirst ?? false;

            const copyBlock = (
              <div
                className={`careers-why-card__copy careers-why-card__copy--${textPanel}`}
              >
                <h3 className="careers-why-card__title">{item.title}</h3>
                {item.descriptionHtml ? (
                  <div
                    className="careers-why-card__text"
                    dangerouslySetInnerHTML={{ __html: item.descriptionHtml }}
                  />
                ) : null}
              </div>
            );

            const mediaBlock = item.image ? (
              <div className="careers-why-card__media">
                <Image
                  src={item.image}
                  alt=""
                  width={200}
                  height={260}
                  className="careers-why-card__image"
                />
              </div>
            ) : null;

            return (
              <article
                key={item.title}
                className={`careers-why-card careers-why-card--${variant}`}
              >
                <div
                  className={`careers-why-card__inner${
                    !isStandard && imageFirst
                      ? " careers-why-card__inner--image-end"
                      : ""
                  }`}
                >
                  {isStandard ? (
                    <>
                      {copyBlock}
                      {mediaBlock}
                    </>
                  ) : imageFirst ? (
                    <>
                      {mediaBlock}
                      {copyBlock}
                    </>
                  ) : (
                    <>
                      {copyBlock}
                      {mediaBlock}
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
