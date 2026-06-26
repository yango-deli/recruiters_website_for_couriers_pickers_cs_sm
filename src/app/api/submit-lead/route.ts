import { NextRequest, NextResponse } from "next/server";
import { formatLeadTelegramMessage } from "@/lib/lead-message";
import { parseLeadForm, type LeadFormData } from "@/lib/forms/schema";
import { sendTelegramMessage } from "@/lib/telegram";
import { sendLeadToCrm } from "@/lib/crm";
import { isCrmConfigured } from "@/lib/crm-config";
import { isTelegramConfigured } from "@/lib/telegram-config";
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

  const telegramConfigured = isTelegramConfigured();
  const crmConfigured = isCrmConfigured();

  if (!telegramConfigured && !crmConfigured) {
    console.error("[submit-lead] No delivery channel configured");
    return NextResponse.json({ error: "Delivery not configured" }, { status: 503 });
  }

  let telegramOk = false;
  let crmOk = false;
  let crmPending = false;

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
      ? sendLeadToCrm(data, locale).then((result) => {
          if (result.ok) {
            crmOk = true;
            return;
          }

          const pending =
            result.reason === "unreachable" ||
            result.reason === "error" ||
            result.status === 404 ||
            result.status === 501 ||
            result.status === 503;

          if (pending) {
            crmPending = true;
            console.warn(
              "[submit-lead] CRM not ready yet (will work after CRM deploy):",
              result.message
            );
          } else {
            console.error("[submit-lead] CRM intake rejected:", result);
          }
        })
      : Promise.resolve(),
  ]);

  // Telegram is the live channel until CRM recruitment webhook is on prod.
  if (telegramOk) {
    return NextResponse.json({
      ok: true,
      delivered: { telegram: true, crm: crmOk, crmPending: crmPending && !crmOk },
    });
  }

  if (crmOk) {
    return NextResponse.json({ ok: true, delivered: { telegram: false, crm: true } });
  }

  if (crmConfigured && !telegramConfigured && crmPending) {
    return NextResponse.json(
      {
        error: "CRM integration is not live yet",
        code: "crm_pending",
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
}
