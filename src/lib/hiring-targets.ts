export type HiringTarget = {
  targetId: string | null;
  storeId?: string | null;
  positionId?: string | null;
  name?: string | null;
  city?: string | null;
  address?: string | null;
  label: string;
};

export type HiringTargetsResponse = {
  role: string;
  locationType: "store" | "city";
  targets: HiringTarget[];
  legacy?: boolean;
};

export function targetOptionValue(target: HiringTarget): string {
  if (target.targetId) return target.targetId;
  if (target.positionId) return `legacy:${target.positionId}`;
  return target.label;
}

export function resolveTargetSelection(
  targets: HiringTarget[],
  value: string
): { targetId?: string; storeId?: string; city: string } | null {
  const target = targets.find((t) => targetOptionValue(t) === value);
  if (!target) return null;
  return {
    targetId: target.targetId ?? undefined,
    storeId: target.storeId ?? undefined,
    city: target.city ?? target.label,
  };
}
