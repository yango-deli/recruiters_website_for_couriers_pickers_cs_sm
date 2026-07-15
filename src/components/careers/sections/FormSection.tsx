import { LeadForm } from "@/components/forms/LeadForm";
import type { Role } from "@/types/role";
import { cn } from "@/lib/utils";
import { formAnchorId } from "../types";

type FormSectionProps = {
  title: string;
  subtitle?: string;
  role: Role;
};

export function FormSection({ title, subtitle, role }: FormSectionProps) {
  const anchorId = formAnchorId(role);
  const isCouriers = role === "couriers";
  const isPickers = role === "pickers";
  const isSupport = role === "support" || role === "service-rep";
  const isFigmaForm = isCouriers || isPickers || isSupport;

  return (
    <section
      id={anchorId}
      className={cn(
        "careers-form-section",
        isCouriers && "careers-form-section--couriers",
        isPickers && "careers-form-section--pickers",
        isSupport && "careers-form-section--support"
      )}
    >
      <div
        className={
          isFigmaForm
            ? isCouriers
              ? "careers-form-section__couriers-inner"
              : isPickers
                ? "careers-form-section__pickers-inner"
                : "careers-form-section__support-inner"
            : "careers-container"
        }
      >
        <header className="careers-form-section__header">
          <h2
            className={cn(
              isFigmaForm && "careers-form-section__title",
              isCouriers && "careers-form-section__title--couriers",
              isPickers && "careers-form-section__title--pickers",
              isSupport && "careers-form-section__title--support",
              !isFigmaForm && "careers-section-title"
            )}
          >
            {title}
          </h2>
          {subtitle ? (
            <p className="careers-form-section__subtitle">{subtitle}</p>
          ) : null}
        </header>
        <div
          id="lead-form-mount"
          className="wp-lead-form-mount careers-form-section__mount"
          data-role={role}
        >
          <div className="wp-lead-form">
            <LeadForm role={role} embedded />
          </div>
        </div>
      </div>
    </section>
  );
}
