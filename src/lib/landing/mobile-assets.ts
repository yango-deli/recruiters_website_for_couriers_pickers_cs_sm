/** Desktop PNG → paired mobile export (`-mobile` suffix before extension). */
export function careersMobileAssetPath(desktopPath: string): string {
  return desktopPath.replace(/(\.[^./]+)$/, "-mobile$1");
}

/** Logical mobile artboard heights from Figma frames (375px wide). */
export const FIGMA_MOBILE_BAND_HEIGHTS: Record<
  string,
  Record<string, number>
> = {
  couriers: {
    benefits: 1068,
    unique: 965,
    "why-join": 1083,
    steps: 870,
  },
  pickers: {
    benefits: 1068,
    "why-join": 1143,
    unique: 807,
    steps: 870,
  },
  support: {
    benefits: 1068,
    "why-join": 1103,
    unique: 656,
    steps: 870,
  },
};

export const FIGMA_MOBILE_HERO_HEIGHT: Record<string, number> = {
  couriers: 482,
  pickers: 482,
  support: 581,
  "service-rep": 581,
};
