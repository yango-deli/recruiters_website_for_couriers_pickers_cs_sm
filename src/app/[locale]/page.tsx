import { redirect } from "next/navigation";
import { resolveLocaleHomeRedirect } from "@/lib/landing/default-route";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ role?: string }>;
};

/** Locale root has no standalone hub — only per-role Figma pages. */
export default async function HomePage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { role } = await searchParams;

  if (!routing.locales.includes(locale as Locale)) {
    return null;
  }

  redirect(resolveLocaleHomeRedirect(role));
}
