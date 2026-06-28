import { setRequestLocale } from "next-intl/server";
import { FigmaCareersPage } from "@/components/figma/FigmaCareersPage";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { loadAllRoleContents } from "@/lib/wp/load-role-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    return null;
  }

  setRequestLocale(locale);
  const roleContents = loadAllRoleContents(locale);

  return (
    <FigmaCareersPage
      locale={locale}
      initialRole="pickers"
      pageMode="hub"
      roleContents={roleContents}
    />
  );
}
