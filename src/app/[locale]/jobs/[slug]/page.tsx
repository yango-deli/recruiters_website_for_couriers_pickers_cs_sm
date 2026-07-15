import { setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { DynamicJobPage } from "@/components/careers/DynamicJobPage";
import { fetchPublicJob } from "@/lib/jobs/fetch-job";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const job = await fetchPublicJob(decodeURIComponent(slug));
  return {
    title: job ? `Yango Deli — ${job.title}` : "Yango Deli Careers",
  };
}

export default async function JobSlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const decoded = decodeURIComponent(slug);

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  if (locale !== "he") {
    redirect(`/he/jobs/${decoded}`);
  }

  const job = await fetchPublicJob(decoded);
  if (!job) {
    notFound();
  }

  return (
    <DynamicJobPage
      slug={job.slug}
      positionId={job.positionId}
      content={job.landing}
      formConfig={job.formConfig}
    />
  );
}
