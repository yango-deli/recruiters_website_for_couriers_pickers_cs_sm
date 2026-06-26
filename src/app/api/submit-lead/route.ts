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

  const telegramConfigured = Boolean(
    process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID
  );
  const crmConfigured = Boolean(
    process.env.CRM_INTAKE_URL && process.env.CRM_WEBHOOK_SECRET
  );

  if (!telegramConfigured && !crmConfigured) {
    console.error("[submit-lead] No delivery channel configured");
    return NextResponse.json({ error: "Delivery not configured" }, { status: 503 });
  }

  let telegramOk = false;
  let crmOk = false;

  await Promise.all([
    telegramConfigured
      ? sendTelegramMessage(formatLeadTelegramMessage(data, locale))
          .then(() => {
            telegramOk = true;
          })
          .catch((error) => {
            console.error("[submit-lead] Telegram delivery failed:", error);
          })
      : Promise.resolve(),
    crmConfigured
      ? sendLeadToCrm(data, locale)
          .then((ok) => {
            if (ok) crmOk = true;
            else console.error("[submit-lead] CRM intake skipped or misconfigured");
          })
          .catch((error) => {
            console.error("[submit-lead] CRM intake failed:", error);
          })
      : Promise.resolve(),
  ]);

  if (!telegramOk && !crmOk) {
    return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: { telegram: telegramOk, crm: crmOk } });
}
