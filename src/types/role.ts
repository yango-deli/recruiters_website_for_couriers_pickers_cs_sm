export const ROLES = ["pickers", "couriers", "support", "manager"] as const;

export type Role = (typeof ROLES)[number];

/** Roles with Figma landing pages (manager deferred). */
export const LANDING_ROLES = ROLES.filter((r) => r !== "manager");

export function isRole(value: string | null | undefined): value is Role {
  return ROLES.includes(value as Role);
}
