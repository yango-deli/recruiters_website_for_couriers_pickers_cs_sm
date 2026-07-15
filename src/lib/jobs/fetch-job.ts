import type { PublicJobNavItem, PublicJobPayload } from "./types";

function getCrmBaseUrl(): string {
  const explicit = process.env.CRM_API_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;

  const intake = process.env.CRM_INTAKE_URL?.trim();
  if (intake) {
    return intake.replace(/\/api\/recruitment\/webhook\/?$/, "");
  }

  return "http://localhost:3000";
}

export async function fetchPublicJob(slug: string): Promise<PublicJobPayload | null> {
  const base = getCrmBaseUrl();
  const url = `${base}/api/public/jobs/${encodeURIComponent(slug)}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as PublicJobPayload;
  } catch {
    return null;
  }
}

export async function fetchPublicJobsList(): Promise<PublicJobNavItem[]> {
  const base = getCrmBaseUrl();
  try {
    const res = await fetch(`${base}/api/public/jobs`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      jobs: { slug: string; title: string; heroTitle: string; positionId: string }[];
    };
    return (data.jobs ?? []).map((job) => ({
      slug: job.slug!,
      title: job.title,
      positionId: job.positionId,
    }));
  } catch {
    return [];
  }
}
