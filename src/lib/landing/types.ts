import type { Role } from "@/types/role";

export type HeroContent = {
  title?: string;
  titleHtml?: string;
  subtitle: string;
  cta: string;
  image: string;
  imageMobile?: string;
};

export type CardItem = {
  title: string;
  descriptionHtml?: string;
  description?: string;
  /** Secondary body line under the primary description (muted typography). */
  secondaryDescription?: string;
  image?: string;
  icon?: string;
  panelVariant?: "yellow" | "black" | "grey";
  imageFirst?: boolean;
};

export type RegistrationStep = {
  number: string;
  textHtml: string;
  image: string;
};

export type LandingSection =
  | {
      type: "benefits";
      title: string;
      items?: CardItem[];
      compositeCards?: string[];
    }
  | {
      type: "unique";
      title: string;
      footnote?: string;
      items: CardItem[];
    }
  | {
      type: "whyJoin";
      title: string;
      variant: "courier" | "standard";
      items?: CardItem[];
      compositeCards?: string[];
    }
  | {
      type: "registration";
      title: string;
      subtitle: string;
      steps?: RegistrationStep[];
      compositeCards?: string[];
    }
  | {
      type: "figmaBand";
      id: string;
      image: string;
      width: number;
      height: number;
      variant?: "default" | "flush" | "rounded-top" | "rounded-top-black";
      ariaLabel?: string;
    }
  | {
      type: "form";
      title: string;
      subtitle?: string;
    };

export type RolePageContent = {
  hero: HeroContent;
  sections: LandingSection[];
};

export type LandingRole = Exclude<Role, "manager">;
