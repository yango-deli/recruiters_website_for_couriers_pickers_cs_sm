import { LeadForm } from "@/components/forms/LeadForm";
import type { Role } from "@/types/role";
import { formAnchorId } from "../types";

type FigmaFormSectionProps = {
  title: string;
  role: Role;
};

export function FigmaFormSection({ title, role }: FigmaFormSectionProps) {
  const anchorId = formAnchorId(role);

  return (
    <section id={anchorId} className="figma-form-section">
      <div className="figma-container">
        <h2 className="figma-section-title">{title}</h2>
        <div
          id="lead-form-mount"
          className="wp-lead-form-mount mx-auto w-full max-w-[461px]"
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
