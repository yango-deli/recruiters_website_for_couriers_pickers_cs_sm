import Image from "next/image";
import type { RegistrationStep } from "../types";

type FigmaRegistrationStepsProps = {
  title: string;
  steps: RegistrationStep[];
};

export function FigmaRegistrationSteps({ title, steps }: FigmaRegistrationStepsProps) {
  const ordered = [...steps].reverse();

  return (
    <section id="steps" className="bg-white py-12 md:py-16">
      <div className="figma-container">
        <h2 className="figma-section-title">{title}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ordered.map((step) => (
            <article key={step.number} className="figma-step-card">
              <div className="figma-step-card__illus">
                <Image
                  src={step.image}
                  alt=""
                  width={220}
                  height={160}
                  className="h-auto max-h-[8rem] w-auto max-w-[85%] object-contain"
                />
              </div>
              <div className="p-4 md:p-5">
                <p className="figma-step-card__number">{step.number}</p>
                <p className="mt-2 text-sm leading-relaxed md:text-base">
                  <strong>{step.text}</strong>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
