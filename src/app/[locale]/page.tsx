import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { CareersPage } from "@/components/careers/CareersPage";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { loadHubRoleContents } from "@/lib/landing/load-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    return null;
  }

  if (locale !== "he") {
    redirect("/he");
  }

  setRequestLocale(locale);
  const roleContents = loadHubRoleContents(locale);

  return (
    <CareersPage
      locale={locale}
      initialRole="pickers"
      pageMode="hub"
      roleContents={roleContents}
    />
  );
}
