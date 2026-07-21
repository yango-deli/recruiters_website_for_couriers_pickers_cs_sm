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

/**
 * Canonical courier/CS cities from CRM hiring campaign list (Hebrew labels).
 * Used only when CRM returns an empty city list — never invent beyond this set.
 */
export const CAREERS_HIRING_CITIES = [
  "תל אביב",
  "צפון תל אביב",
  "רמת גן",
  "פתח תקווה",
  "בת ים",
  "ראשון לציון",
  "מודיעין",
  "רמת השרון",
  "נתניה",
  "חיפה",
] as const;

const STORE_ROLES = new Set<Role>(["manager", "pickers"]);

export function locationTypeForRole(role: string): "store" | "city" {
  return isRole(role) && STORE_ROLES.has(role) ? "store" : "city";
}

function normalizeDedupeKey(target: HiringTarget): string {
  const name = (target.name ?? "").trim().toLowerCase();
  const city = (target.city ?? "").trim().toLowerCase();
  if (name || city) return `${name}|${city}`;
  return (target.label ?? "").trim().toLowerCase();
}

/** Stable de-dupe for branch/city lists (keeps first occurrence). */
export function dedupeHiringTargets(targets: HiringTarget[]): HiringTarget[] {
  const seen = new Set<string>();
  const out: HiringTarget[] = [];
  for (const t of targets) {
    const key = normalizeDedupeKey(t);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

export function citiesAsHiringTargets(cities: readonly string[]): HiringTarget[] {
  return cities.map((city) => ({
    targetId: null,
    city,
    label: city,
  }));
}

/** Default target so leads still reach the pipeline without a published campaign. */
export function createFallbackTarget(locationType: "store" | "city"): HiringTarget {
  const label = locationType === "store" ? "Any branches" : "Any cities";
  return {
    targetId: null,
    storeId: null,
    positionId: null,
    city: null,
    label,
    isFallback: true,
  };
}

export function withFallbackTargets(
  response: Partial<HiringTargetsResponse> & { role: string }
): HiringTargetsResponse {
  const locationType = response.locationType ?? locationTypeForRole(response.role);
  let targets = response.targets?.length
    ? dedupeHiringTargets(response.targets)
    : [];

  if (targets.length === 0 && locationType === "city") {
    targets = citiesAsHiringTargets(CAREERS_HIRING_CITIES);
  }

  if (targets.length === 0) {
    targets = [createFallbackTarget(locationType)];
  }

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
  if (target.storeId) return `store:${target.storeId}`;
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
      city: "",
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
