import type { Role } from "@/types/role";

export type RoleFormConfig = {
  showLocation: boolean;
  locationRequired: boolean;
  showResume: boolean;
  resumeRequired: boolean;
  showFooterApplyCta: boolean;
  showFooterDisclaimer: boolean;
  privacyYear: number;
};

const DEFAULT_CONFIG: RoleFormConfig = {
  showLocation: true,
  locationRequired: true,
  showResume: true,
  resumeRequired: false,
  showFooterApplyCta: true,
  showFooterDisclaimer: true,
  privacyYear: 2026,
};

export const ROLE_FORM_CONFIG: Record<Role, RoleFormConfig> = {
  support: {
    ...DEFAULT_CONFIG,
    showLocation: false,
    locationRequired: false,
    showResume: true,
    resumeRequired: true,
    showFooterApplyCta: false,
    showFooterDisclaimer: true,
  },
  couriers: {
    ...DEFAULT_CONFIG,
    showLocation: true,
    locationRequired: true,
    showResume: false,
    resumeRequired: false,
    showFooterApplyCta: false,
    showFooterDisclaimer: false,
  },
  pickers: {
    ...DEFAULT_CONFIG,
    showLocation: true,
    locationRequired: true,
    showResume: true,
    resumeRequired: false,
    showFooterApplyCta: false,
    showFooterDisclaimer: false,
  },
  "service-rep": {
    ...DEFAULT_CONFIG,
    showLocation: false,
    locationRequired: false,
    showResume: true,
    resumeRequired: true,
    showFooterApplyCta: false,
    showFooterDisclaimer: false,
  },
  manager: {
    ...DEFAULT_CONFIG,
  },
};

export function getRoleFormConfig(role: Role): RoleFormConfig {
  return ROLE_FORM_CONFIG[role] ?? DEFAULT_CONFIG;
}
