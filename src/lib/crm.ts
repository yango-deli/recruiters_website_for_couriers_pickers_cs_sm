import type { LeadFormData } from "@/lib/forms/schema";

/**
 * Forward a validated lead to the Yango Deli CRM intake webhook.
 *
 * Configured via env:
 *   CRM_INTAKE_URL      e.g. https://crm.example.com/api/recruitment/webhook
 *   CRM_WEBHOOK_SECRET  shared secret; sent as the X-Webhook-Secret header
 *                       (must match RECRUITMENT_WEBHOOK_SECRET in the CRM)
 *
 * Designed to be non-fatal: if the CRM is unreachable or misconfigured this
 * throws/returns false, and the caller keeps Telegram as the primary channel.
 */
export async function sendLeadToCrm(
  data: LeadFormData,
  locale?: string
): Promise<boolean> {
  const url = process.env.CRM_INTAKE_URL;
  const secret = process.env.CRM_WEBHOOK_SECRET;

  if (!url || !secret) {
    // Integration not configured — silently skip (Telegram remains primary).
    return false;
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

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Webhook-Secret": secret,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`CRM intake responded with ${response.status}`);
  }

  return true;
}
