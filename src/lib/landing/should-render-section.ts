import type { LandingSection } from "@/lib/landing/types";
import { isTemplateLandingAsset } from "./placeholders";

export function shouldRenderLandingSection(section: LandingSection): boolean {
  if (section.type === "figmaBand") {
    return !isTemplateLandingAsset(section.image);
  }
  return true;
}
