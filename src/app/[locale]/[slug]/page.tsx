import { setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { CareersPage } from "@/components/careers/CareersPage";
import { loadHubRoleContents } from "@/lib/landing/load-content";
import { resolveLocaleHomeRedirect } from "@/lib/landing/default-route";
import { isRoleSlug } from "@/lib/wp/manifest";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import type { Role } from "@/types/role";
import { LANDING_ROLES } from "@/types/role";

const LEGAL_REDIRECTS: Record<string, string> = {
  "privacy-policy": "https://yango-deli.co.il/privacy-policy/",
  "terms-of-use": "https://yango-deli.co.il/terms-of-use/",
};

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const role of LANDING_ROLES) {
      params.push({ locale, slug: role });
    }
    for (const slug of Object.keys(LEGAL_REDIRECTS)) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, locale } = await params;
  const decoded = decodeURIComponent(slug);

  if (isRoleSlug(decoded)) {
    // Sync message lookup avoids next-intl async setup during parallel SSG.
    const catalog =
      locale === "ru"
        ? (await import("../../../messages/ru.json")).default
        : locale === "en"
          ? (await import("../../../messages/en.json")).default
          : (await import("../../../messages/he.json")).default;
    const roleTitle =
      (catalog as { nav: { roles: Record<string, string> } }).nav.roles[
        decoded
      ] ?? decoded;
    return { title: `Yango Deli — ${roleTitle}` };
  }

  return { title: decoded };
}

export default async function SlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const decoded = decodeURIComponent(slug);

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  if (decoded === "careers" || decoded === "yango-deli-careers-original") {
    redirect(resolveLocaleHomeRedirect(null, locale));
  }

  if (decoded === "manager") {
    notFound();
  }

  const legalUrl = LEGAL_REDIRECTS[decoded];
  if (legalUrl) {
    redirect(legalUrl);
  }

  if (isRoleSlug(decoded)) {
    const role = decoded as Role;

    if (!LANDING_ROLES.includes(role as (typeof LANDING_ROLES)[number])) {
      notFound();
    }

    const roleContents = loadHubRoleContents(locale);

    return (
      <CareersPage
        locale={locale}
        initialRole={role}
        pageMode="role"
        roleContents={roleContents}
      />
    );
  }

  notFound();
}
