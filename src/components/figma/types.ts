import type { Role } from "@/types/role";

export type RoleHero = {
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  highlights?: string[];
};

export type RoleCardItem = {
  title: string;
  description: string;
  icon?: string;
  image?: string;
};

export type RoleContent = {
  hero: RoleHero;
  benefits: {
    title: string;
    subtitle?: string;
    label?: string;
    items: RoleCardItem[];
  };
  whyJoin: {
    title: string;
    subtitle?: string;
    label?: string;
    items: RoleCardItem[];
  };
  howItWorks: {
    title: string;
    subtitle?: string;
    label?: string;
    items: RoleCardItem[];
  };
  cta: {
    title: string;
    subtitle?: string;
    button: string;
  };
};

export type RegistrationStep = {
  number: string;
  text: string;
  image: string;
};

export type FigmaPageMode = "hub" | "role" | "manager";

export type FigmaCareersPageProps = {
  locale: string;
  initialRole: Role;
  pageMode: FigmaPageMode;
};

export function formAnchorId(role: Role): string {
  return `form-${role}`;
}
