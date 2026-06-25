import { setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { WpCareersPage } from "@/components/wp/WpCareersPage";
import { WpLegalPage } from "@/components/wp/WpLegalPage";
import { prepareLegalHtml } from "@/lib/wp/content";
import {
  getLegalPages,
  getWpPageBySlug,
  getWpSlugForRole,
  getWpHubSlug,
  getElementorPostId,
  isRoleSlug,
  ROLE_SLUGS,
} from "@/lib/wp/manifest";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const role of ROLE_SLUGS) {
      params.push({ locale, slug: role });
    }
    for (const page of getLegalPages()) {
      params.push({ locale, slug: decodeURIComponent(page.slug) });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);

  if (isRoleSlug(decoded)) {
    return { title: `Yango Deli — ${decoded}` };
  }

  const page = getWpPageBySlug(decoded);
  return { title: page?.title ?? decoded };
}

export default async function SlugPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const decoded = decodeURIComponent(slug);

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  if (decoded === "careers" || decoded === "yango-deli-careers-original") {
    redirect(`/${locale}`);
  }

  if (isRoleSlug(decoded)) {
    if (decoded === "manager") {
      return (
        <WpCareersPage
          wpSlug={getWpHubSlug(locale)}
          role="manager"
          locale={locale}
          pageMode="manager"
        />
      );
    }

    const wpSlug = getWpSlugForRole(decoded, locale);
    return (
      <WpCareersPage
        wpSlug={wpSlug}
        role={decoded}
        locale={locale}
        pageMode="role"
      />
    );
  }

  const page = getWpPageBySlug(decoded);
  if (!page || page.category !== "legal") {
    notFound();
  }

  const html = prepareLegalHtml(page.slug, locale);
  if (!html) notFound();

  return (
    <WpLegalPage
      html={html}
      locale={locale}
      postId={getElementorPostId(page.slug)}
    />
  );
}
