import { NextRequest, NextResponse } from "next/server";
import { getCrmBaseUrl } from "@/lib/crm-config";
import type { HiringTargetsResponse } from "@/lib/hiring-targets";

export const dynamic = "force-dynamic";

/** Server-side proxy to CRM public hiring targets (avoids browser CORS). */
export async function GET(request: NextRequest) {
  const base = getCrmBaseUrl();
  if (!base) {
    return NextResponse.json({ error: "CRM_API_URL not configured" }, { status: 503 });
  }

  const role = new URL(request.url).searchParams.get("role")?.trim();
  if (!role) {
    return NextResponse.json({ error: "role required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${base}/api/public/hiring-targets?role=${encodeURIComponent(role)}`,
      { cache: "no-store" }
    );
    const data = (await res.json().catch(() => ({}))) as HiringTargetsResponse;
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[hiring-targets] CRM fetch failed:", err);
    return NextResponse.json({ error: "CRM unreachable" }, { status: 502 });
  }
}
