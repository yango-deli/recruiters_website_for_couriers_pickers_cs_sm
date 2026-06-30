import { isRole, LANDING_ROLES, type Role } from "@/types/role";

/** Canonical Hebrew landing when no role is in the URL (was hub default). */
export const DEFAULT_LANDING_ROLE = "pickers" satisfies Role;

export function landingPathForRole(role: Role): string {
  return `/he/${role}`;
}

/** `/he`, `/en`, `/ru` and legacy `/careers` → role landing. */
export function resolveLocaleHomeRedirect(roleParam?: string | null): string {
  if (
    roleParam &&
    isRole(roleParam) &&
    LANDING_ROLES.includes(roleParam as (typeof LANDING_ROLES)[number])
  ) {
    return landingPathForRole(roleParam);
  }
  return landingPathForRole(DEFAULT_LANDING_ROLE);
}
