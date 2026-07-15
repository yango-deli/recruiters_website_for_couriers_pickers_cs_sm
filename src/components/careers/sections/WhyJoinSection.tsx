import Image from "next/image";
import type { CardItem } from "@/lib/landing/types";
import type { Role } from "@/types/role";
import { remoteLandingImageProps } from "@/lib/landing/image-props";
import { FigmaCompositeGrid } from "./FigmaCompositeGrid";

type WhyJoinSectionProps = {
  title: string;
  items?: CardItem[];
  compositeCards?: string[];
  variant: "courier" | "standard";
  role?: Role;
};

function courierCopyPanel(item: CardItem, role?: Role): "grey" | "black" | "yellow" {
  if (role === "couriers") {
    return "grey";
  }
  return item.panelVariant ?? "grey";
}

export function WhyJoinSection({
  title,
  items = [],
  compositeCards,
  variant,
  role,
}: WhyJoinSectionProps) {
  const isStandard = variant === "standard";
  const isCouriersCourier = role === "couriers" && !isStandard && !compositeCards?.length;
  const isPickersWhyJoin = role === "pickers" && !isStandard && !compositeCards?.length;

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

  const sectionClass = [
    "careers-why-join",
    isStandard ? "careers-why-join--standard" : "careers-why-join--courier",
    isCouriersCourier ? "careers-why-join--couriers" : "",
    isPickersWhyJoin ? "careers-why-join--pickers" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const listClass = isStandard
    ? "careers-why-join__grid"
    : "careers-why-join__list careers-why-join__list--courier";

  return (
    <section id="why-join" className={sectionClass}>
      <div
        className={
          isCouriersCourier || isPickersWhyJoin
            ? "careers-container careers-container--figma"
            : "careers-container"
        }
      >
        <h2
          className={
            isCouriersCourier
              ? "careers-section-title careers-section-title--figma-center careers-why-join__couriers-title"
              : isPickersWhyJoin
                ? "careers-section-title careers-section-title--figma-end careers-why-join__pickers-title"
                : "careers-section-title"
          }
        >
          {title}
        </h2>
        <div className={listClass}>
          {items.map((item) => {
            const textPanel = isStandard
              ? (item.panelVariant ?? "black")
              : courierCopyPanel(item, role);
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
                ) : item.description ? (
                  <p className="careers-why-card__text">{item.description}</p>
                ) : null}
              </div>
            );

            const mediaBlock = item.image ? (
              <div className="careers-why-card__media">
                <Image
                  src={item.image}
                  alt=""
                  width={isCouriersCourier ? 280 : 200}
                  height={isCouriersCourier ? 220 : 260}
                  className="careers-why-card__image"
                  {...remoteLandingImageProps(item.image)}
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
