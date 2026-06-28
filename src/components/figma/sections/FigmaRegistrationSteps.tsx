import Image from "next/image";
import type { WpRegistrationStep } from "@/lib/wp/parse-role-page";
import type { Role } from "@/types/role";

type FigmaRegistrationStepsProps = {
  title: string;
  subtitle?: string;
  steps: WpRegistrationStep[];
  role?: Role;
};

export function FigmaRegistrationSteps({
  title,
  subtitle,
  steps,
  role,
}: FigmaRegistrationStepsProps) {
  const roleClass = role === "couriers" ? "figma-steps--couriers" : "";

  return (
    <section id="steps" className={`figma-steps ${roleClass}`.trim()}>
      <div className="figma-container">
        <div className="figma-steps__band">
          <h2 className="figma-steps__title">{title}</h2>
          {subtitle ? <p className="figma-steps__subtitle">{subtitle}</p> : null}
          <div className="figma-steps__grid">
            {steps.map((step) => (
              <article key={step.number} className="figma-step-card">
                <div className="figma-step-card__illus">
                  <Image
                    src={step.image}
                    alt=""
                    width={220}
                    height={160}
                    className="figma-step-card__image"
                  />
                </div>
                <div className="figma-step-card__body">
                  <p className="figma-step-card__number">{step.number}</p>
                  <div
                    className="figma-step-card__text"
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
