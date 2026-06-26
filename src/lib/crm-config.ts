/** Production CRM domain (yango-internal-platform on Vercel). */
export const CRM_PRODUCTION_BASE_URL = "https://delicrm.com";

export const CRM_PRODUCTION_INTAKE_URL = `${CRM_PRODUCTION_BASE_URL}/api/recruitment/webhook`;

function trimEnv(value: string | undefined): string {
  return value?.trim() ?? "";
}

/** Base URL of the Yango internal CRM (no trailing slash). */
export function getCrmBaseUrl(): string | null {
  const explicit = trimEnv(process.env.CRM_API_URL).replace(/\/$/, "");
  if (explicit) return explicit;

  const intake = trimEnv(process.env.CRM_INTAKE_URL);
  if (!intake) return null;

  return intake.replace(/\/api\/recruitment\/webhook\/?$/, "");
}

export function getCrmIntakeUrl(): string | null {
  const url = trimEnv(process.env.CRM_INTAKE_URL);
  return url || null;
}

export function getCrmWebhookSecret(): string | null {
  const secret = trimEnv(process.env.CRM_WEBHOOK_SECRET);
  return secret || null;
}

export function isCrmConfigured(): boolean {
  return Boolean(getCrmIntakeUrl() && getCrmWebhookSecret());
}
