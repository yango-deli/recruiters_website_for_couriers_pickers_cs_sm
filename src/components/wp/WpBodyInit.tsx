import type { WpPageMode } from "@/components/wp/WpCareersPage";

type WpBodyInitProps = {
  postId?: number | null;
  pageMode?: WpPageMode;
  locale: string;
};

const PAGE_MODE_CLASSES: Record<WpPageMode, string> = {
  role: "wp-page-role",
  hub: "wp-page-hub",
  manager: "wp-page-manager",
  support: "wp-page-support",
};

/** Applies Elementor body classes synchronously on first paint (before React hydrate). */
export function WpBodyInit({
  postId,
  pageMode = "role",
  locale,
}: WpBodyInitProps) {
  const classes = [
    "wp-site",
    "elementor-default",
    "elementor-kit-8",
    "elementor-page",
    "elementor-template-canvas",
    PAGE_MODE_CLASSES[pageMode],
    locale === "he" ? "rtl" : "ltr",
    ...(postId ? [`elementor-page-${postId}`] : []),
  ];

  const script = `(function(){var b=document.body,c=${JSON.stringify(classes)},l=${JSON.stringify(locale)},d=${JSON.stringify(locale === "he" ? "rtl" : "ltr")};if(!b)return;b.classList.add.apply(b.classList,c);document.documentElement.lang=l;document.documentElement.dir=d;})();`;

  return (
    <script
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
