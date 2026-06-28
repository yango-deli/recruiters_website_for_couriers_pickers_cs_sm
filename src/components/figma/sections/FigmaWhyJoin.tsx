import Image from "next/image";
import type { WpCardItem } from "@/lib/wp/parse-role-page";

type FigmaWhyJoinProps = {
  title: string;
  items: WpCardItem[];
  variant: "courier" | "standard";
};

export function FigmaWhyJoin({ title, items, variant }: FigmaWhyJoinProps) {
  const isStandard = variant === "standard";

  return (
    <section
      id="why-join"
      className={`figma-why-join ${isStandard ? "figma-why-join--standard" : "figma-why-join--courier"}`}
    >
      <div className="figma-container">
        <h2 className="figma-section-title">{title}</h2>
        <div
          className={
            isStandard ? "figma-why-join__grid" : "figma-why-join__list"
          }
        >
          {items.map((item) => {
            const textPanel =
              item.panelVariant ?? (isStandard ? "black" : "grey");
            const imageFirst = item.imageFirst ?? false;

            const copyBlock = (
              <div
                className={`figma-why-card__copy figma-why-card__copy--${textPanel}`}
              >
                <h3 className="figma-why-card__title">{item.title}</h3>
                {item.descriptionHtml ? (
                  <div
                    className="figma-why-card__text"
                    dangerouslySetInnerHTML={{ __html: item.descriptionHtml }}
                  />
                ) : null}
              </div>
            );

            const mediaBlock = item.image ? (
              <div className="figma-why-card__media">
                <Image
                  src={item.image}
                  alt=""
                  width={200}
                  height={260}
                  className="figma-why-card__image"
                />
              </div>
            ) : null;

            return (
              <article
                key={item.title}
                className={`figma-why-card figma-why-card--${variant}`}
              >
                <div
                  className={`figma-why-card__inner${
                    !isStandard && imageFirst
                      ? " figma-why-card__inner--image-end"
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
