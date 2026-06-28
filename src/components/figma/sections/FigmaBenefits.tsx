import Image from "next/image";
import type { WpCardItem } from "@/lib/wp/parse-role-page";
import type { Role } from "@/types/role";

type FigmaBenefitsProps = {
  title: string;
  items: WpCardItem[];
  role?: Role;
};

export function FigmaBenefits({ title, items, role }: FigmaBenefitsProps) {
  const roleClass = role === "couriers" ? "figma-benefits--couriers" : "";

  return (
    <section id="benefits" className={`figma-benefits ${roleClass}`.trim()}>
      <div className="figma-container">
        <h2 className="figma-section-title">{title}</h2>
        <div className="figma-benefits__grid">
          {items.map((item) => {
            const panel = item.panelVariant ?? "yellow";
            const isCoinsIllus =
              role === "couriers" &&
              Boolean(item.image?.match(/\/orig-1(?:-\d+x\d+)?\.png/i));

            return (
              <article key={item.title} className="figma-benefit-card">
                <div className="figma-benefit-card__illus">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt=""
                      width={400}
                      height={240}
                      className={`figma-benefit-card__image${isCoinsIllus ? " figma-benefit-card__image--coins" : ""}`}
                    />
                  ) : null}
                </div>
                <div
                  className={`figma-benefit-card__body figma-benefit-card__body--${panel}`}
                >
                  <h3 className="figma-benefit-card__title">{item.title}</h3>
                  {item.descriptionHtml ? (
                    <div
                      className="figma-benefit-card__text"
                      dangerouslySetInnerHTML={{ __html: item.descriptionHtml }}
                    />
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
