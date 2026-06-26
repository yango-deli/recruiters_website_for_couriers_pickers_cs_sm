import type { LeadFormData } from "@/lib/forms/schema";

export type SubmitLeadResult =
  | { success: true }
  | { success: false; error: string };

export async function submitLead(
  data: LeadFormData,
  locale?: string
): Promise<SubmitLeadResult> {
  const response = await fetch("/api/submit-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, locale }),
  });

  let payload: { ok?: boolean; error?: string; code?: string; delivered?: { crm?: boolean; telegram?: boolean } } = {};
  try {
    payload = await response.json();
  } catch {
    return { success: false, error: "submit_failed" };
  }

  if (!response.ok) {
    if (payload.code === "crm_pending") {
      return { success: false, error: "crm_pending" };
    }
    return { success: false, error: payload.error ?? "submit_failed" };
  }

  if (payload.delivered && !payload.delivered.crm && !payload.delivered.telegram) {
    return { success: false, error: "delivery_failed" };
  }

  return { success: true };
}
