import type { LeadFormData } from "@/lib/forms/schema";
import type { DynamicLeadPayload } from "@/lib/jobs/types";
import { getCrmIntakeUrl, getCrmWebhookSecret } from "@/lib/crm-config";

export type CrmDeliveryResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "unreachable" | "rejected" | "error"; status?: number; message: string };

/**
 * POST a lead payload to the CRM webhook. When a CV file is present the request
 * is sent as multipart/form-data (object fields are JSON-stringified so the CRM
 * can restore them); otherwise a plain JSON body is used.
 */
async function postToCrm(
  url: string,
  secret: string,
  payload: Record<string, unknown>,
  cvFile?: File | null
): Promise<CrmDeliveryResult> {
  let response: Response;
  try {
    if (cvFile) {
      const form = new FormData();
      for (const [key, value] of Object.entries(payload)) {
        if (value === undefined || value === null) continue;
        form.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : String(value)
        );
      }
      form.append("cv", cvFile, cvFile.name);
      response = await fetch(url, {
        method: "POST",
        headers: { "X-Webhook-Secret": secret },
        body: form,
      });
    } else {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Secret": secret,
        },
        body: JSON.stringify(payload),
      });
    }
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
  locale?: string,
  cvFile?: File | null
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
    city: data.city?.trim() || undefined,
    targetId: data.targetId,
    storeId: data.storeId,
    vehicle: data.vehicle,
    taxRegistered: data.taxRegistered,
    locale: locale ?? data.locale,
  };

  return postToCrm(url, secret, payload, cvFile);
}

export async function sendDynamicLeadToCrm(
  data: DynamicLeadPayload,
  cvFile?: File | null
): Promise<CrmDeliveryResult> {
  const url = getCrmIntakeUrl();
  const secret = getCrmWebhookSecret();

  if (!url || !secret) {
    return { ok: false, reason: "not_configured", message: "CRM env not set" };
  }

  const payload = {
    positionId: data.positionId,
    positionSlug: data.positionSlug,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    city: data.city,
    targetId: data.targetId,
    storeId: data.storeId,
    locale: data.locale,
    consent: data.consent,
    formData: data.formData,
  };

  return postToCrm(url, secret, payload, cvFile);
}
