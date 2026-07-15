/** CRM / blob uploads are absolute URLs — bypass next/image optimizer (not on allowlist). */
export function isRemoteLandingImage(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

export function remoteLandingImageProps(src: string): { unoptimized?: true } {
  return isRemoteLandingImage(src) ? { unoptimized: true } : {};
}

export function landingMobileImagePath(desktopPath: string): string {
  if (isRemoteLandingImage(desktopPath)) return desktopPath;
  return desktopPath.replace(/(\.[^./]+)$/, "-mobile$1");
}
