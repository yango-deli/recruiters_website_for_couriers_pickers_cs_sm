import { setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { FigmaCareersPage } from "@/components/figma/FigmaCareersPage";
import { WpLegalPage } from "@/components/wp/WpLegalPage";
import { prepareLegalHtml } from "@/lib/wp/content";
import {
  getLegalPages,
  getWpPageBySlug,
  getElementorPostId,
  isRoleSlug,
  ROLE_SLUGS,
} from "@/lib/wp/manifest";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import type { Role } from "@/types/role";

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
    const role = decoded as Role;
    const pageMode = role === "manager" ? "manager" : "role";

    return (
      <FigmaCareersPage
        locale={locale}
        initialRole={role}
        pageMode={pageMode}
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
