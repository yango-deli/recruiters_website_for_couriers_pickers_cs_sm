import { NextResponse } from "next/server";
import { getCrmBaseUrl } from "@/lib/crm-config";

export const dynamic = "force-dynamic";

/** Proxy published custom job pages for navbar (avoids browser CORS). */
export async function GET() {
  const base = getCrmBaseUrl();
  if (!base) {
    return NextResponse.json({ jobs: [] });
  }

  try {
    const res = await fetch(`${base}/api/public/jobs`, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ jobs: [] });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ jobs: [] });
  }
}
