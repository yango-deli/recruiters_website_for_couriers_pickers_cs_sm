import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Role } from "@/types/role";
import { LANDING_ROLES } from "@/types/role";
import type { LandingRole, RolePageContent } from "./types";

const CONTENT_ROOT = join(process.cwd(), "src/content/landing");

function landingLocale(locale: string): "he" {
  return locale === "he" ? "he" : "he";
}

export function loadRoleContent(role: Role, locale: string): RolePageContent {
  const landingRole = role as LandingRole;
  if (!LANDING_ROLES.includes(landingRole)) {
    throw new Error(`No landing content for role: ${role}`);
  }

  const filePath = join(CONTENT_ROOT, landingLocale(locale), `${landingRole}.json`);
  const raw = readFileSync(filePath, "utf8");
  return JSON.parse(raw) as RolePageContent;
}

export function loadHubRoleContents(
  locale: string
): Record<LandingRole, RolePageContent> {
  const contents = {} as Record<LandingRole, RolePageContent>;
  for (const role of LANDING_ROLES) {
    contents[role] = loadRoleContent(role, locale);
  }
  return contents;
}
