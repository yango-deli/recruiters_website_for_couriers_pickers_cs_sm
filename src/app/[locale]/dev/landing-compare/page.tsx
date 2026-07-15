import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { WhyJoinSection } from "@/components/careers/sections/WhyJoinSection";
import { BenefitsSection } from "@/components/careers/sections/BenefitsSection";
import { UniqueSection } from "@/components/careers/sections/UniqueSection";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import type { CardItem } from "@/lib/landing/types";

const FIGMA_WHY_JOIN_ITEMS: CardItem[] = [
  {
    title: "15% הנחה",
    description:
      "הנחה קבועה על מגוון מוצרים באיסוף עצמי — ארוחות מוכנות להפסקה או קניות לבית.",
    image: "/careers/couriers/unique-deliveries.png",
    panelVariant: "grey",
  },
  {
    title: "יש גם בונוסים",
    description:
      "בונוסים שונים שמגדילים את ההכנסה — בונוס חג, מזג אוויר, מרחק ומשקל.",
    image: "/careers/couriers/unique-hours.png",
    panelVariant: "grey",
  },
  {
    title: "תשלום סופר מהיר",
    description:
      "עבור עצמאים — התשלום מגיע כל שבועיים, בלי לחכות לסוף החודש.",
    image: "/careers/couriers/unique-zones.png",
    panelVariant: "grey",
  },
];

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LandingComparePage({ params }: PageProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <div className="careers-site careers-site--couriers careers-site--couriers-figma min-h-full">
      <main id="main-content" className="careers-main">
        <div className="careers-container careers-container--figma py-8 space-y-12">
          <header className="space-y-2 border-b border-ink/10 pb-6">
            <p className="text-sm text-ink-muted">Dev only — block comparison</p>
            <h1 className="text-2xl font-bold">Landing blocks vs Figma</h1>
          </header>

          <section className="space-y-4" aria-labelledby="why-join-ref">
            <h2 id="why-join-ref" className="text-lg font-semibold">
              Why Join — Figma reference
            </h2>
            <Image
              src="/careers/couriers/why-join-section.png"
              alt="Figma why join reference"
              width={2732}
              height={1124}
              className="w-full h-auto rounded-xl border border-ink/10"
              priority
            />
          </section>

          <section className="space-y-4" aria-labelledby="why-join-live">
            <h2 id="why-join-live" className="text-lg font-semibold">
              Why Join — live component (courier variant)
            </h2>
            <div className="rounded-xl border border-ink/10 overflow-hidden">
              <WhyJoinSection
                title="למה שווה לך להצטרף?"
                items={FIGMA_WHY_JOIN_ITEMS}
                variant="courier"
                role="couriers"
              />
            </div>
          </section>

          <section className="space-y-4" aria-labelledby="benefits-ref">
            <h2 id="benefits-ref" className="text-lg font-semibold">
              Benefits — Figma reference
            </h2>
            <Image
              src="/careers/couriers/benefits-section.png"
              alt="Figma benefits reference"
              width={2732}
              height={1266}
              className="w-full h-auto rounded-xl border border-ink/10"
            />
          </section>

          <section className="space-y-4" aria-labelledby="unique-ref">
            <h2 id="unique-ref" className="text-lg font-semibold">
              Unique — Figma reference
            </h2>
            <Image
              src="/careers/couriers/unique-band.png"
              alt="Figma unique reference"
              width={2732}
              height={1054}
              className="w-full h-auto rounded-xl border border-ink/10"
            />
            <div className="rounded-xl border border-ink/10 overflow-hidden">
              <UniqueSection
                title="מה יש לנו שאין לאחרים"
                items={[
                  {
                    title: "שעות גמישות",
                    icon: "/careers/couriers/unique-hours.png",
                  },
                  {
                    title: "משלוחים בקרבה",
                    icon: "/careers/couriers/unique-deliveries.png",
                  },
                  {
                    title: "אזורי עבודה",
                    icon: "/careers/couriers/unique-zones.png",
                  },
                ]}
                role="couriers"
              />
            </div>
          </section>

          <section className="space-y-4" aria-labelledby="benefits-live">
            <h2 id="benefits-live" className="text-lg font-semibold">
              Benefits — live component
            </h2>
            <BenefitsSection
              title="ההחלטה שלך"
              items={[
                {
                  title: "משכורת שעתית גבוהה",
                  description: "השכר השעתי הממוצע לשליחים בישראל",
                  panelVariant: "yellow",
                },
                {
                  title: "שעות גמישות",
                  description: "אתה קובע מתי לעבוד",
                  panelVariant: "black",
                },
                {
                  title: "בונוסים",
                  description: "תוספות שמגדילות את ההכנסה",
                  panelVariant: "yellow",
                },
              ]}
              role="couriers"
            />
          </section>
        </div>
      </main>
    </div>
  );
}
