import { NextRequest, NextResponse } from "next/server";
import { getCrmBaseUrl } from "@/lib/crm-config";
import {
  locationTypeForRole,
  withFallbackTargets,
  type HiringTargetsResponse,
} from "@/lib/hiring-targets";

export const dynamic = "force-dynamic";

/** Server-side proxy to CRM public hiring targets (avoids browser CORS). */
export async function GET(request: NextRequest) {
  const role = new URL(request.url).searchParams.get("role")?.trim();
  if (!role) {
    return NextResponse.json({ error: "role required" }, { status: 400 });
  }

  const locationType = locationTypeForRole(role);
  const fallback = () =>
    NextResponse.json(withFallbackTargets({ role, locationType, targets: [] }));

  const base = getCrmBaseUrl();
  if (!base) {
    return fallback();
  }

  try {
    const res = await fetch(
      `${base}/api/public/hiring-targets?role=${encodeURIComponent(role)}`,
      { cache: "no-store" }
    );
    const data = (await res.json().catch(() => ({}))) as HiringTargetsResponse;

    if (!res.ok) {
      return fallback();
    }

    return NextResponse.json(
      withFallbackTargets({
        role: data.role ?? role,
        locationType: data.locationType ?? locationType,
        targets: data.targets ?? [],
        legacy: data.legacy,
      })
    );
  } catch (err) {
    console.error("[hiring-targets] CRM fetch failed:", err);
    return fallback();
  }
}
