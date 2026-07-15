import { NextRequest, NextResponse } from "next/server";
import { formatLeadTelegramMessage } from "@/lib/lead-message";
import { parseLeadForm, type LeadFormData } from "@/lib/forms/schema";
import { sendTelegramMessage } from "@/lib/telegram";
import { sendDynamicLeadToCrm, sendLeadToCrm } from "@/lib/crm";
import { isCrmConfigured } from "@/lib/crm-config";
import { isTelegramConfigured } from "@/lib/telegram-config";
import { isRole } from "@/types/role";
import type { DynamicLeadPayload } from "@/lib/jobs/types";

function parseDynamicLead(body: unknown): DynamicLeadPayload | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  if (!b.dynamicJob) return null;

  const positionId = typeof b.positionId === "string" ? b.positionId.trim() : "";
  const positionSlug = typeof b.positionSlug === "string" ? b.positionSlug.trim() : "";
  const firstName = typeof b.firstName === "string" ? b.firstName.trim() : "";
  const lastName = typeof b.lastName === "string" ? b.lastName.trim() : "";
  const phone = typeof b.phone === "string" ? b.phone.trim() : "";

  if (!positionId || !positionSlug || !firstName || !lastName || !phone) {
    return null;
  }

  return {
    positionId,
    positionSlug,
    firstName,
    lastName,
    phone,
    locale: typeof b.locale === "string" ? b.locale : undefined,
    city: typeof b.city === "string" ? b.city : undefined,
    targetId: typeof b.targetId === "string" ? b.targetId : undefined,
    storeId: typeof b.storeId === "string" ? b.storeId : undefined,
    consent:
      typeof b.consent === "object" && b.consent !== null
        ? (b.consent as Record<string, boolean>)
        : {},
    formData:
      typeof b.formData === "object" && b.formData !== null
        ? (b.formData as Record<string, string>)
        : {},
    company: typeof b.company === "string" ? b.company : undefined,
  };
}

/** Coerce a value (object, or JSON string from multipart) into a plain record. */
function coerceRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === "object" && parsed !== null) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      /* not JSON — ignore */
    }
  }
  return undefined;
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  let body: unknown;
  let cvFile: File | null = null;

  if (contentType.includes("multipart/form-data")) {
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }
    const record: Record<string, unknown> = {};
    for (const [key, value] of form.entries()) {
      if (value instanceof File) continue;
      record[key] = value;
    }
    // Restore types lost in multipart encoding.
    if ("ageConsent" in record) record.ageConsent = record.ageConsent === "true";
    if ("privacyConsent" in record)
      record.privacyConsent = record.privacyConsent === "true";
    if ("dynamicJob" in record)
      record.dynamicJob =
        record.dynamicJob === "true" || record.dynamicJob === "1";
    const consent = coerceRecord(record.consent);
    if (consent) record.consent = consent;
    const formData = coerceRecord(record.formData);
    if (formData) record.formData = formData;
    const cv = form.get("cv");
    if (cv instanceof File && cv.size > 0) cvFile = cv;
    body = record;
  } else {
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
  }

  const dynamicLead = parseDynamicLead(body);
  if (dynamicLead) {
    if (dynamicLead.company) {
      return NextResponse.json({ ok: true });
    }

    const crmConfigured = isCrmConfigured();
    if (!crmConfigured) {
      return NextResponse.json({ error: "Delivery not configured" }, { status: 503 });
    }

    const crmResult = await sendDynamicLeadToCrm(dynamicLead, cvFile);
    if (crmResult.ok) {
      return NextResponse.json({ ok: true, delivered: { crm: true } });
    }

    if (
      crmResult.reason === "unreachable" ||
      crmResult.reason === "error" ||
      crmResult.status === 503
    ) {
      return NextResponse.json(
        { error: "CRM integration is not live yet", code: "crm_pending" },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
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
      ? sendLeadToCrm(data, locale, cvFile).then((result) => {
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

  // Telegram remains the fallback channel until CRM webhook auth is live on delicrm.
  // When CRM is configured we still attempt delivery; Telegram success must not be
  // blocked by a temporary CRM secret mismatch (pipeline outage).
  if (telegramOk) {
    return NextResponse.json({
      ok: true,
      delivered: {
        telegram: true,
        crm: crmOk,
        crmPending: crmPending && !crmOk,
        crmRejected: crmConfigured && !crmOk && !crmPending,
      },
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
