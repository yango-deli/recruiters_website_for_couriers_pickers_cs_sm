import type { RolePageContent } from "@/lib/landing/types";

export type WebsiteFormField = {
  key: string;
  type: "text" | "phone" | "select" | "checkbox";
  label: string;
  required?: boolean;
  options?: string[];
};

export type WebsiteFormConfig = {
  fields: WebsiteFormField[];
  consentCheckboxes: { key: string; label: string; required: boolean }[];
  showHiringTargets: boolean;
};

export type PublicJobNavItem = {
  slug: string;
  title: string;
  positionId: string;
};

export type PublicJobPayload = {
  slug: string;
  positionId: string;
  title: string;
  description: string | null;
  locationType: "store" | "city";
  landing: RolePageContent;
  formConfig: WebsiteFormConfig;
};

export type DynamicLeadPayload = {
  positionId: string;
  positionSlug: string;
  firstName: string;
  lastName: string;
  phone: string;
  locale?: string;
  city?: string;
  targetId?: string;
  storeId?: string;
  consent: Record<string, boolean>;
  formData: Record<string, string>;
  company?: string;
};
