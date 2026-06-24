/** Base URL of the Yango internal CRM (no trailing slash). */
export function getCrmBaseUrl(): string | null {
  const explicit = process.env.CRM_API_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;

  const intake = process.env.CRM_INTAKE_URL?.trim();
  if (!intake) return null;

  return intake.replace(/\/api\/recruitment\/webhook\/?$/, "");
}
