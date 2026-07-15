/** Built-in careers site assets — not custom uploads; must not render as user content. */
export const TEMPLATE_LANDING_ASSETS = new Set([
  "/careers/couriers/benefits-section.png",
  "/careers/couriers/unique-band.png",
  "/careers/couriers/why-join-section.png",
  "/careers/couriers/steps-section.png",
  "/careers/couriers/hero-photo.png",
  "/careers/couriers/step-1.png",
  "/careers/couriers/step-2.png",
  "/careers/couriers/step-3.png",
  "/careers/pickers/hero-photo.png",
  "/careers/support/hero-photo.png",
  "/careers/service-rep/hero-photo.png",
]);

export function landingAssetPath(src: string): string {
  try {
    if (/^https?:\/\//i.test(src)) {
      return new URL(src).pathname;
    }
  } catch {
    /* relative path */
  }
  return src.startsWith("/") ? src : `/${src}`;
}

export function isTemplateLandingAsset(src: string | undefined): boolean {
  if (!src?.trim()) return true;
  return TEMPLATE_LANDING_ASSETS.has(landingAssetPath(src));
}
