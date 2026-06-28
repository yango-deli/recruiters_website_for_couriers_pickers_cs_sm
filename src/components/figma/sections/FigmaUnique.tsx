import Image from "next/image";
import type { RoleCardItem } from "../types";

type FigmaUniqueProps = {
  title: string;
  items: RoleCardItem[];
};

export function FigmaUnique({ title, items }: FigmaUniqueProps) {
  const cards = items.slice(0, 4);

  return (
    <section id="unique" className="bg-[#f5f5f7] py-12 md:py-16">
      <div className="figma-container">
        <h2 className="figma-section-title">{title}</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((item) => (
            <article key={item.title} className="figma-unique-card">
              {item.icon ? (
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center">
                  <Image
                    src={item.icon}
                    alt=""
                    width={57}
                    height={60}
                    className="h-auto max-h-14 w-auto object-contain"
                  />
                </div>
              ) : null}
              <h3 className="font-heading text-lg font-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed">
                <strong>{item.description}</strong>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
