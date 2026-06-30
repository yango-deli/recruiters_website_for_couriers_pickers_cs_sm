import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import "../globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const base = "https://yango-deli.co.il";

  return {
    metadataBase: new URL(base),
    title: messages.meta.title,
    description: messages.meta.description,
    icons: { icon: "/logos/favicon-32.png" },
    alternates: {
      canonical: `${base}/${locale}`,
      languages: {
        he: `${base}/he`,
        en: `${base}/en`,
        ru: `${base}/ru`,
      },
    },
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      url: `${base}/${locale}`,
      siteName: "Yango Deli",
      locale,
      images: [{ url: "/logos/yango-deli-logo.png", width: 300, height: 300 }],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "he" ? "rtl" : "ltr";
  return (
    <html lang={locale} dir={dir} className="h-full">
      <head>
        <link
          rel="preload"
          href="/fonts/yango-text/YangoText_Rg.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/yango-text/YangoText_A_Rg.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/yango-headline/YangoHeadline-Black.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/yango-headline/yango-headline-hebrew.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body className="h-full antialiased" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
