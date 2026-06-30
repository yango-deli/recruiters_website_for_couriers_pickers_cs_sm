import type { LandingRole, RolePageContent } from "@/lib/landing/types";
import type { Role } from "@/types/role";

export type CareersPageMode = "hub" | "role";

export type CareersPageProps = {
  locale: string;
  initialRole: Role;
  pageMode: CareersPageMode;
  roleContents: Record<LandingRole, RolePageContent>;
};

export function formAnchorId(role: Role): string {
  return `form-${role}`;
}

export type { RolePageContent, LandingSection, CardItem, HeroContent, RegistrationStep } from "@/lib/landing/types";
