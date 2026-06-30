import Image from "next/image";
import type { CardItem } from "@/lib/landing/types";

type UniqueSectionProps = {
  title: string;
  footnote?: string;
  items: CardItem[];
};

export function UniqueSection({ title, footnote, items }: UniqueSectionProps) {
  return (
    <section id="unique" className="careers-unique careers-unique--figma">
      <div className="careers-container careers-container--figma">
        <h2 className="careers-section-title careers-section-title--figma-center">
          {title}
        </h2>
        <div className="careers-unique__grid careers-unique__grid--figma">
          {items.map((item) => (
            <article key={item.title} className="careers-unique-card">
              {item.icon ? (
                <div className="careers-unique-card__icon">
                  <Image
                    src={item.icon}
                    alt=""
                    width={67}
                    height={60}
                    className="careers-unique-card__icon-img"
                  />
                </div>
              ) : null}
              <h3 className="careers-unique-card__title">{item.title}</h3>
              {item.description ? (
                <p className="careers-unique-card__text">{item.description}</p>
              ) : item.descriptionHtml ? (
                <div
                  className="careers-unique-card__text"
                  dangerouslySetInnerHTML={{ __html: item.descriptionHtml }}
                />
              ) : null}
            </article>
          ))}
        </div>
        {footnote ? (
          <p className="careers-unique__footnote">{footnote}</p>
        ) : null}
      </div>
    </section>
  );
}
