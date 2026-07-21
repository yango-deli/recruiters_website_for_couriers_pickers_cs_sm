import Image from "next/image";
import type { CardItem } from "@/lib/landing/types";
import type { Role } from "@/types/role";
import { remoteLandingImageProps } from "@/lib/landing/image-props";
import { FigmaCompositeGrid } from "./FigmaCompositeGrid";

type BenefitsSectionProps = {
  title: string;
  items?: CardItem[];
  compositeCards?: string[];
  role?: Role;
};

export function BenefitsSection({
  title,
  items = [],
  compositeCards,
  role,
}: BenefitsSectionProps) {
  const roleClass = role === "couriers" ? "careers-benefits--couriers" : "";
  const figmaClass = compositeCards ? "careers-benefits--figma" : "";

  if (compositeCards?.length) {
    return (
      <section
        id="benefits"
        className={`careers-benefits ${roleClass} ${figmaClass}`.trim()}
      >
        <div className="careers-container careers-container--figma">
          <h2 className="careers-section-title careers-section-title--figma-end">
            {title}
          </h2>
          <FigmaCompositeGrid
            cards={compositeCards}
            className="careers-benefits__figma-grid"
            cardWidth={415}
            cardHeight={420}
          />
        </div>
      </section>
    );
  }

  return (
    <section id="benefits" className={`careers-benefits ${roleClass}`.trim()}>
      <div className="careers-container">
        <h2 className="careers-section-title">{title}</h2>
        <div className="careers-benefits__grid">
          {items.map((item) => {
            const panel = item.panelVariant ?? "yellow";
            const isCoinsIllus =
              role === "couriers" &&
              Boolean(item.image?.match(/\/orig-1(?:-\d+x\d+)?\.png/i));

            return (
              <article key={item.title} className="careers-benefit-card">
                <div className="careers-benefit-card__illus">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt=""
                      width={400}
                      height={240}
                      className={`careers-benefit-card__image${isCoinsIllus ? " careers-benefit-card__image--coins" : ""}`}
                      {...remoteLandingImageProps(item.image)}
                    />
                  ) : null}
                </div>
                <div
                  className={`careers-benefit-card__body careers-benefit-card__body--${panel}`}
                >
                  <h3 className="careers-benefit-card__title">{item.title}</h3>
                  {item.descriptionHtml ? (
                    <div
                      className="careers-benefit-card__text"
                      dangerouslySetInnerHTML={{ __html: item.descriptionHtml }}
                    />
                  ) : item.description ? (
                    <p className="careers-benefit-card__text">{item.description}</p>
                  ) : null}
                  {item.secondaryDescription ? (
                    <p className="careers-benefit-card__secondary">
                      {item.secondaryDescription}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
