import type { LeadFormData } from "@/lib/forms/schema";
import { getCrmIntakeUrl, getCrmWebhookSecret } from "@/lib/crm-config";

export type CrmDeliveryResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "unreachable" | "rejected" | "error"; status?: number; message: string };

/**
 * Forward a validated lead to the Yango Deli CRM intake webhook.
 *
 * Configured via env:
 *   CRM_INTAKE_URL      e.g. https://delicrm.com/api/recruitment/webhook
 *   CRM_WEBHOOK_SECRET  shared secret; sent as the X-Webhook-Secret header
 *                       (must match RECRUITMENT_WEBHOOK_SECRET in the CRM)
 *
 * Designed to be non-fatal while CRM is not yet deployed: callers treat Telegram
 * as the live channel and log CRM failures until delicrm.com serves the webhook.
 */
export async function sendLeadToCrm(
  data: LeadFormData,
  locale?: string
): Promise<CrmDeliveryResult> {
  const url = getCrmIntakeUrl();
  const secret = getCrmWebhookSecret();

  if (!url || !secret) {
    return { ok: false, reason: "not_configured", message: "CRM env not set" };
  }

  const payload = {
    role: data.role,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    city: data.city,
    targetId: data.targetId,
    storeId: data.storeId,
    vehicle: data.vehicle,
    taxRegistered: data.taxRegistered,
    locale: locale ?? data.locale,
  };

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": secret,
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "fetch failed";
    return { ok: false, reason: "unreachable", message };
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const reason =
      response.status === 401 || response.status === 403 ? "rejected" : "error";
    return {
      ok: false,
      reason,
      status: response.status,
      message: body.slice(0, 200) || `HTTP ${response.status}`,
    };
  }

  return { ok: true };
}
