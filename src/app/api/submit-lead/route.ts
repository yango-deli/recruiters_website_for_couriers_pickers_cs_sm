import { NextRequest, NextResponse } from "next/server";
import { formatLeadTelegramMessage } from "@/lib/lead-message";
import { parseLeadForm, type LeadFormData } from "@/lib/forms/schema";
import { sendTelegramMessage } from "@/lib/telegram";
import { sendLeadToCrm } from "@/lib/crm";
import { isRole } from "@/types/role";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const role =
    typeof body === "object" && body !== null && "role" in body
      ? (body as { role: string }).role
      : null;

  if (!isRole(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const parsed = parseLeadForm(role, body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const data: LeadFormData = parsed.data;

  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  const locale =
    typeof body === "object" && body !== null && "locale" in body
      ? String((body as { locale: string }).locale)
      : undefined;

  // Deliver to Telegram (primary) and the CRM (secondary) in parallel.
  // A CRM failure must never break the applicant-facing submission.
  const [telegram, crm] = await Promise.allSettled([
    sendTelegramMessage(formatLeadTelegramMessage(data, locale)),
    sendLeadToCrm(data, locale),
  ]);

  if (crm.status === "rejected") {
    console.error("[submit-lead] CRM intake failed:", crm.reason);
  }

  if (telegram.status === "rejected") {
    console.error("[submit-lead] Telegram delivery failed:", telegram.reason);
    return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
