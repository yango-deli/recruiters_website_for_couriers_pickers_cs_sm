import type { WpRolePageContent } from "@/lib/wp/parse-role-page";
import type { Role } from "@/types/role";

export type FigmaPageMode = "hub" | "role" | "manager";

export type FigmaCareersPageProps = {
  locale: string;
  initialRole: Role;
  pageMode: FigmaPageMode;
  roleContents: Record<Role, WpRolePageContent>;
};

export function formAnchorId(role: Role): string {
  return `form-${role}`;
}

export type { WpRolePageContent, WpLandingSection, WpCardItem, WpHeroContent, WpRegistrationStep } from "@/lib/wp/parse-role-page";
