import Image from "next/image";
import { resolveCarouselImage } from "@/lib/role-images";
import type { Role } from "@/types/role";
import type { RoleCardItem } from "../types";

type FigmaWhyJoinProps = {
  title: string;
  items: RoleCardItem[];
  role: Role;
};

export function FigmaWhyJoin({ title, items, role }: FigmaWhyJoinProps) {
  const cards = items.slice(0, 3);

  return (
    <section id="why-join" className="bg-white py-12 md:py-16">
      <div className="figma-container">
        <h2 className="figma-section-title">{title}</h2>
        <div className="flex flex-col gap-6">
          {cards.map((item, index) => {
            const imageSrc = item.image
              ? resolveCarouselImage(role, item.image, index)
              : null;
            const imageFirst = index % 2 === 1;

            return (
              <article key={item.title} className="figma-why-card">
                <div
                  className={`figma-why-card__inner flex min-h-[12rem] flex-col md:min-h-[14rem] md:flex-row ${
                    imageFirst ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
                    <h3 className="font-heading text-xl font-black md:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed md:text-base">
                      <strong>{item.description}</strong>
                    </p>
                  </div>
                  {imageSrc ? (
                    <div className="flex flex-1 items-center justify-center bg-[#ececec]/40 p-6 md:max-w-[40%]">
                      <Image
                        src={imageSrc}
                        alt=""
                        width={200}
                        height={260}
                        className="h-auto max-h-[15rem] w-auto object-contain"
                      />
                    </div>
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
