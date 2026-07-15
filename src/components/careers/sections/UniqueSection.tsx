import Image from "next/image";
import type { CardItem } from "@/lib/landing/types";
import type { Role } from "@/types/role";
import { isRemoteLandingImage, remoteLandingImageProps } from "@/lib/landing/image-props";

type UniqueSectionProps = {
  title: string;
  footnote?: string;
  items: CardItem[];
  role?: Role;
};

function uniqueMediaSrc(item: CardItem): string | undefined {
  return item.image || item.icon;
}

function isLargeUniqueMedia(src: string): boolean {
  if (isRemoteLandingImage(src)) return true;
  return !src.startsWith("/careers/");
}

export function UniqueSection({ title, footnote, items, role }: UniqueSectionProps) {
  const roleClass = role === "couriers" ? "careers-unique--couriers" : "";

  return (
    <section
      id="unique"
      className={`careers-unique careers-unique--figma ${roleClass}`.trim()}
    >
      <div className="careers-container careers-container--figma">
        <h2 className="careers-section-title careers-section-title--figma-center">
          {title}
        </h2>
        <div
          className="careers-unique__grid careers-unique__grid--figma"
          data-items={Math.min(items.length, 5)}
        >
          {items.map((item) => {
            const mediaSrc = uniqueMediaSrc(item);
            const largeMedia = mediaSrc ? isLargeUniqueMedia(mediaSrc) : false;

            return (
              <article key={item.title} className="careers-unique-card">
                {mediaSrc ? (
                  <div
                    className={
                      largeMedia
                        ? "careers-unique-card__media"
                        : "careers-unique-card__icon"
                    }
                  >
                    <Image
                      src={mediaSrc}
                      alt=""
                      width={largeMedia ? 160 : 67}
                      height={largeMedia ? 140 : 60}
                      className={
                        largeMedia
                          ? "careers-unique-card__media-img"
                          : "careers-unique-card__icon-img"
                      }
                      {...remoteLandingImageProps(mediaSrc)}
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
            );
          })}
        </div>
        {footnote ? (
          <p className="careers-unique__footnote">{footnote}</p>
        ) : null}
      </div>
    </section>
  );
}
