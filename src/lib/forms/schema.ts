import { z } from "zod";
import { ROLE_FORM_FIELDS, VEHICLE_OPTIONS } from "@/lib/forms/form-fields";
import { ROLES, type Role } from "@/types/role";

const requiredConsent = z
  .boolean()
  .refine((value) => value === true, { message: "required" });

export type LeadFormData = {
  role: Role;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  ageConsent: boolean;
  privacyConsent: boolean;
  locale?: string;
  company?: string;
  targetId?: string;
  storeId?: string;
  vehicle?: (typeof VEHICLE_OPTIONS)[number];
  taxRegistered?: "yes" | "no";
};

export const leadFormSchema = z
  .object({
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    phone: z.string().trim().min(9).max(20),
    // Empty allowed for “Any cities / Any branches” fallback when no campaign targets.
    city: z.string().trim(),
    ageConsent: requiredConsent,
    privacyConsent: requiredConsent,
    role: z.enum(ROLES),
    locale: z.string().optional(),
    company: z.string().max(0).optional(),
    targetId: z.string().optional(),
    storeId: z.string().optional(),
    vehicle: z.enum(VEHICLE_OPTIONS).optional(),
    taxRegistered: z.enum(["yes", "no"]).optional(),
  })
  .superRefine((data, ctx) => {
    const fields = ROLE_FORM_FIELDS[data.role];
    if (fields.includes("vehicle") && !data.vehicle) {
      ctx.addIssue({ code: "custom", path: ["vehicle"], message: "required" });
    }
    if (fields.includes("taxRegistered") && !data.taxRegistered) {
      ctx.addIssue({
        code: "custom",
        path: ["taxRegistered"],
        message: "required",
      });
    }
  });

export function parseLeadForm(role: Role, data: unknown) {
  const parsed = leadFormSchema.safeParse(data);
  if (!parsed.success) return parsed;
  if (parsed.data.role !== role) {
    return {
      success: false as const,
      error: new z.ZodError([
        {
          code: "custom",
          path: ["role"],
          message: "role_mismatch",
        },
      ]),
    };
  }
  return parsed;
}
