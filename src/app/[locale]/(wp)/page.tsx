import { setRequestLocale } from "next-intl/server";
import { WpCareersPage } from "@/components/wp/WpCareersPage";
import { getWpHubSlug } from "@/lib/wp/manifest";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    return null;
  }

  setRequestLocale(locale);

  return (
    <WpCareersPage
      wpSlug={getWpHubSlug(locale)}
      locale={locale}
      pageMode="hub"
    />
  );
}
