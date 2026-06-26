type WpElementorStylesProps = {
  postId?: number | null;
  locale?: string;
};

const WIDGETS = ["heading", "image", "image-box"] as const;

const WP_BLACK_CTA_IDS = [
  "e1170ad",
  "29c4f7a",
  "00ecb37",
  "7840307",
  "73960e4a",
  "13f07b06",
  "457d7d1",
] as const;

const blackCtaRules = WP_BLACK_CTA_IDS.map(
  (id) => `
body.wp-site .elementor-element-${id} .elementor-button {
  color: #ffffff !important;
  fill: #ffffff !important;
}`
).join("");

/**
 * Loaded after Elementor post CSS — brand kit + typography only.
 * Text colors come from synced post-*.css (white on dark panels, black on yellow).
 */
const WP_BRAND_OVERRIDES = `
body.wp-site.elementor-kit-8,
body.wp-site .elementor-kit-8,
body.wp-site .elementor {
  --e-global-color-primary: #000000 !important;
  --e-global-color-secondary: #000000 !important;
  --e-global-color-text: #000000 !important;
  --e-global-color-accent: #ffcc00 !important;
  --e-global-typography-primary-font-family: "Yango Headline", "Yango Text", sans-serif !important;
  --e-global-typography-secondary-font-family: "Yango Headline", "Yango Text", sans-serif !important;
  --e-global-typography-text-font-family: "Yango Text", sans-serif !important;
  --e-global-typography-accent-font-family: "Yango Text", sans-serif !important;
}
body.wp-site .elementor .elementor-heading-title {
  font-family: "Yango Headline", "Yango Text", sans-serif !important;
}
body.wp-site .elementor p,
body.wp-site .elementor .elementor-widget-text-editor,
body.wp-site .elementor .elementor-image-box-title,
body.wp-site .elementor .elementor-image-box-description,
body.wp-site .elementor .elementor-button,
body.wp-site .elementor .elementor-button-text {
  font-family: "Yango Text", sans-serif !important;
}
body.wp-site .elementor .e-n-tab-title,
body.wp-site .elementor .e-n-tab-title .e-n-tab-title-text {
  color: #000000 !important;
}
body.wp-site .elementor .elementor-element.elementor-element-f1a1893:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-f77fac1:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-12ec484:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-ff28f6d:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-2eaad409:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-bf9b706:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-d26b98c:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-54c787f7:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-2612de9d:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-7d90f1d2:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-1a64e198:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-341aad6:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-90d02cb:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-7726b96:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-e2abde5:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-71374d84:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-1df94e2d:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-39061da:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-b3c8f0c:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-c7b95a6:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-6477bcb0:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-169cfe0e:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-6fa7cfc2:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-2402f80:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-6dca3de:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-50fed994:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-792c6553:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-60e3baae:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-2086a96e:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-f0781fd:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-906d16f:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-b8d2cc2:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-92c0cfd:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-3ce975a:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-c7571ce:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-a2d8137:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-096e059:not(.elementor-motion-effects-element-type-background),
body.wp-site .elementor .elementor-element.elementor-element-f1a1893 > .elementor-motion-effects-container > .elementor-motion-effects-layer,
body.wp-site .elementor .elementor-element.elementor-element-f77fac1 > .elementor-motion-effects-container > .elementor-motion-effects-layer,
body.wp-site .elementor .elementor-element.elementor-element-12ec484 > .elementor-motion-effects-container > .elementor-motion-effects-layer,
body.wp-site .elementor .elementor-element.elementor-element-ff28f6d > .elementor-motion-effects-container > .elementor-motion-effects-layer,
body.wp-site .elementor .elementor-element.elementor-element-2eaad409 > .elementor-motion-effects-container > .elementor-motion-effects-layer,
body.wp-site .elementor .elementor-element.elementor-element-bf9b706 > .elementor-motion-effects-container > .elementor-motion-effects-layer,
body.wp-site .elementor .elementor-element.elementor-element-d26b98c > .elementor-motion-effects-container > .elementor-motion-effects-layer,
body.wp-site .elementor .elementor-element.elementor-element-54c787f7 > .elementor-motion-effects-container > .elementor-motion-effects-layer,
body.wp-site .elementor .elementor-element.elementor-element-2612de9d > .elementor-motion-effects-container > .elementor-motion-effects-layer {
  background-color: #ffcc00 !important;
}
body.wp-site .elementor .elementor-button[style*="FEDE47"],
body.wp-site .elementor .elementor-button[style*="fede47"],
body.wp-site .elementor .elementor-button[style*="FFCC66"],
body.wp-site .elementor-element-7238539 .elementor-button,
body.wp-site .elementor-element-43f8131 .elementor-button {
  background-color: #ffcc00 !important;
}
body.wp-site .elementor .elementor-image-box-title {
  font-weight: 500 !important;
}
body.wp-site .elementor .elementor-element.elementor-element-6e67c2cf img,
body.wp-site .elementor .elementor-element.elementor-element-893c928 img,
body.wp-site .elementor .elementor-element.elementor-element-79ff86fb img {
  width: auto !important;
  height: auto !important;
  max-width: 100% !important;
  max-height: clamp(300px, 36vw, 435px) !important;
  object-fit: contain !important;
  object-position: center center !important;
}
@media (max-width: 1024px) {
  body.wp-site .elementor .elementor-element.elementor-element-6e67c2cf img,
  body.wp-site .elementor .elementor-element.elementor-element-893c928 img,
  body.wp-site .elementor .elementor-element.elementor-element-79ff86fb img {
    max-height: clamp(220px, 52vw, 340px) !important;
  }
}
body.wp-site .elementor .elementor-element.elementor-element-515e0e6 .elementor-heading-title .wp-hero-sub,
body.wp-site .elementor .elementor-element.elementor-element-0ce76a5 .elementor-heading-title {
  font-family: "Yango Text", sans-serif !important;
  font-weight: 400 !important;
  font-size: clamp(0.875rem, 1.6vw, 1.125rem) !important;
  line-height: 1.35 !important;
}
@media (max-width: 1024px) {
  body.wp-site .elementor .elementor-element.elementor-element-515e0e6 .elementor-heading-title .wp-hero-sub,
  body.wp-site .elementor .elementor-element.elementor-element-0ce76a5 .elementor-heading-title {
    font-size: clamp(0.8125rem, 3.2vw, 1rem) !important;
  }
}
${blackCtaRules}
body.wp-site.wp-page-hub .e-n-tabs-content > [role="tabpanel"] { display: none !important; }
body.wp-site.wp-page-hub .e-n-tabs-content > [role="tabpanel"][data-tab-index="1"] { display: flex !important; }
body.wp-site.wp-page-manager .e-n-tabs-content > [role="tabpanel"] { display: none !important; }
body.wp-site.wp-page-manager .e-n-tabs-content > [role="tabpanel"][data-tab-index="4"] { display: flex !important; }
`;

/** Elementor CSS — loaded in document head via Next.js stylesheet links. */
export function WpElementorStyles({ postId, locale = "he" }: WpElementorStylesProps) {
  const rtl = locale === "he";
  const widgetSuffix = rtl ? "-rtl" : "";

  return (
    <>
      <link
        rel="stylesheet"
        href="/wp-assets/plugins/elementor/assets/css/frontend.min.css"
        precedence="high"
      />
      {WIDGETS.map((widget) => (
        <link
          key={widget}
          rel="stylesheet"
          href={`/wp-assets/plugins/elementor/assets/css/widget-${widget}${widgetSuffix}.min.css`}
          precedence="high"
        />
      ))}
      <link
        rel="stylesheet"
        href="/wp-assets/uploads/elementor/css/post-8.css"
        precedence="high"
      />
      {postId ? (
        <link
          rel="stylesheet"
          href={`/wp-assets/uploads/elementor/css/post-${postId}.css`}
          precedence="high"
        />
      ) : null}
      <style precedence="high" dangerouslySetInnerHTML={{ __html: WP_BRAND_OVERRIDES }} />
    </>
  );
}
