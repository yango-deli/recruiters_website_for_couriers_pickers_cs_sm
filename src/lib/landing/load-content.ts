import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Role } from "@/types/role";
import { LANDING_ROLES } from "@/types/role";
import type { LandingRole, RolePageContent } from "./types";

const CONTENT_ROOT = join(process.cwd(), "src/content/landing");

function loadJsonContent(role: LandingRole, locale: string): RolePageContent {
  const localePath = join(CONTENT_ROOT, locale, `${role}.json`);
  if (existsSync(localePath)) {
    return JSON.parse(readFileSync(localePath, "utf8")) as RolePageContent;
  }

  const fallbackPath = join(CONTENT_ROOT, "he", `${role}.json`);
  if (!existsSync(fallbackPath)) {
    throw new Error(`No landing JSON for ${role} (${locale})`);
  }
  return JSON.parse(readFileSync(fallbackPath, "utf8")) as RolePageContent;
}

export function loadRoleContent(role: Role, locale: string): RolePageContent {
  const landingRole = role as LandingRole;
  if (!LANDING_ROLES.includes(landingRole)) {
    throw new Error(`No landing content for role: ${role}`);
  }
  return loadJsonContent(landingRole, locale);
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
