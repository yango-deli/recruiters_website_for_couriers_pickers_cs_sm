import Image from "next/image";
import type { RegistrationStep } from "@/lib/landing/types";
import type { Role } from "@/types/role";
import { remoteLandingImageProps } from "@/lib/landing/image-props";
import { FigmaCompositeGrid } from "./FigmaCompositeGrid";

type StepsSectionProps = {
  title: string;
  subtitle?: string;
  steps?: RegistrationStep[];
  compositeCards?: string[];
  role?: Role;
};

export function StepsSection({
  title,
  subtitle,
  steps = [],
  compositeCards,
  role,
}: StepsSectionProps) {
  const roleClass = role === "couriers" ? "careers-steps--couriers" : "";

  if (compositeCards?.length) {
    return (
      <section
        id="steps"
        className={`careers-steps careers-steps--figma ${roleClass}`.trim()}
      >
        <div className="careers-container careers-container--figma">
          <div className="careers-steps__figma-band">
            <h2 className="careers-steps__title careers-steps__title--figma">
              {title}
            </h2>
            {subtitle ? (
              <p className="careers-steps__subtitle careers-steps__subtitle--figma">
                {subtitle}
              </p>
            ) : null}
            <FigmaCompositeGrid
              cards={compositeCards}
              className="careers-steps__figma-grid"
              cardWidth={301}
              cardHeight={292}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="steps" className={`careers-steps ${roleClass}`.trim()}>
      <div className="careers-container">
        <div className="careers-steps__band">
          <h2 className="careers-steps__title">{title}</h2>
          {subtitle ? <p className="careers-steps__subtitle">{subtitle}</p> : null}
          <div className="careers-steps__grid">
            {steps.map((step) => (
              <article key={step.number} className="careers-step-card">
                <div className="careers-step-card__illus">
                  <Image
                    src={step.image}
                    alt=""
                    width={220}
                    height={160}
                    className="careers-step-card__image"
                    {...remoteLandingImageProps(step.image)}
                  />
                </div>
                <div className="careers-step-card__body">
                  <p className="careers-step-card__number">{step.number}</p>
                  <div
                    className="careers-step-card__text"
                    dangerouslySetInnerHTML={{ __html: step.textHtml }}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
