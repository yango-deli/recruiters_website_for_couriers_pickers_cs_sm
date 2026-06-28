import Image from "next/image";
import type { WpCardItem } from "@/lib/wp/parse-role-page";

type FigmaUniqueProps = {
  title: string;
  items: WpCardItem[];
};

export function FigmaUnique({ title, items }: FigmaUniqueProps) {
  return (
    <section id="unique" className="figma-unique">
      <div className="figma-container">
        <h2 className="figma-section-title">{title}</h2>
        <div className="figma-unique__grid">
          {items.map((item) => (
            <article key={item.title} className="figma-unique-card">
              {item.icon ? (
                <div className="figma-unique-card__icon">
                  <Image
                    src={item.icon}
                    alt=""
                    width={67}
                    height={60}
                    className="figma-unique-card__icon-img"
                  />
                </div>
              ) : null}
              <h3 className="figma-unique-card__title">{item.title}</h3>
              {item.descriptionHtml ? (
                <div
                  className="figma-unique-card__text"
                  dangerouslySetInnerHTML={{ __html: item.descriptionHtml }}
                />
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
