import { isRole, type Role } from "@/types/role";

export type HiringTarget = {
  targetId: string | null;
  storeId?: string | null;
  positionId?: string | null;
  name?: string | null;
  city?: string | null;
  address?: string | null;
  label: string;
  /** Synthetic option when CRM has no published targets. */
  isFallback?: boolean;
};

export type HiringTargetsResponse = {
  role: string;
  locationType: "store" | "city";
  targets: HiringTarget[];
  legacy?: boolean;
};

/** Sentinel value for the “any location” dropdown option (no campaign target). */
export const ANY_TARGET_VALUE = "__any__";

const STORE_ROLES = new Set<Role>(["pickers", "manager"]);

export function locationTypeForRole(role: string): "store" | "city" {
  return isRole(role) && STORE_ROLES.has(role) ? "store" : "city";
}

/** Default target so leads still reach the pipeline without a published campaign. */
export function createFallbackTarget(locationType: "store" | "city"): HiringTarget {
  const label = locationType === "store" ? "Any branches" : "Any cities";
  return {
    targetId: null,
    storeId: null,
    positionId: null,
    city: label,
    label,
    isFallback: true,
  };
}

export function withFallbackTargets(
  response: Partial<HiringTargetsResponse> & { role: string }
): HiringTargetsResponse {
  const locationType = response.locationType ?? locationTypeForRole(response.role);
  const targets =
    response.targets && response.targets.length > 0
      ? response.targets
      : [createFallbackTarget(locationType)];

  return {
    role: response.role,
    locationType,
    targets,
    legacy: response.legacy,
  };
}

export function targetOptionValue(target: HiringTarget): string {
  if (target.isFallback) return ANY_TARGET_VALUE;
  if (target.targetId) return target.targetId;
  if (target.positionId) return `legacy:${target.positionId}`;
  return target.label;
}

export function resolveTargetSelection(
  targets: HiringTarget[],
  value: string
): { targetId?: string; storeId?: string; city: string } | null {
  if (value === ANY_TARGET_VALUE) {
    const fallback = targets.find((t) => t.isFallback);
    if (!fallback) return null;
    return {
      city: fallback.city ?? fallback.label,
    };
  }

  const target = targets.find((t) => targetOptionValue(t) === value);
  if (!target) return null;
  return {
    targetId: target.targetId ?? undefined,
    storeId: target.storeId ?? undefined,
    city: target.city ?? target.label,
  };
}

export function fallbackTargetLabel(
  target: HiringTarget,
  locationType: "store" | "city",
  labels: { anyCity: string; anyBranch: string }
): string {
  if (!target.isFallback) return target.label;
  return locationType === "store" ? labels.anyBranch : labels.anyCity;
}
