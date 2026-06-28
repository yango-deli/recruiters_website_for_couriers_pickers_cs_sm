import Image from "next/image";
import type { RoleCardItem } from "../types";

type FigmaBenefitsProps = {
  title: string;
  items: RoleCardItem[];
};

export function FigmaBenefits({ title, items }: FigmaBenefitsProps) {
  const cards = items.slice(0, 3);

  return (
    <section id="benefits" className="bg-white py-12 md:py-16">
      <div className="figma-container">
        <h2 className="figma-section-title">{title}</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((item) => (
            <article key={item.title} className="figma-benefit-card">
              <div className="figma-benefit-card__illus">
                {item.icon ? (
                  <Image
                    src={item.icon}
                    alt=""
                    width={280}
                    height={180}
                    className="h-auto max-h-[10rem] w-auto max-w-[min(92%,16rem)] object-contain"
                  />
                ) : null}
              </div>
              <div className="figma-benefit-card__body">
                <h3 className="figma-benefit-card__title">{item.title}</h3>
                <p className="text-sm leading-relaxed md:text-base">
                  <strong>{item.description}</strong>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
