import type { Role } from "@/types/role";
import { ROLES } from "@/types/role";
import { loadWpHtml } from "./content";
import {
  extractManagerTabHtml,
  parseWpRolePage,
  type WpRolePageContent,
} from "./parse-role-page";
import { getWpHubSlug, getWpSlugForRole } from "./manifest";

export function loadRolePageContent(role: Role, locale: string): WpRolePageContent {
  if (role === "manager") {
    const hubHtml = loadWpHtml(getWpHubSlug(locale));
    if (!hubHtml) {
      throw new Error(`Missing WP hub HTML for manager (${locale})`);
    }
    return parseWpRolePage(extractManagerTabHtml(hubHtml), role);
  }

  const slug = getWpSlugForRole(role, locale);
  const html = loadWpHtml(slug);
  if (!html) {
    throw new Error(`Missing WP HTML for ${role} (${slug})`);
  }

  return parseWpRolePage(html, role);
}

export function loadAllRoleContents(
  locale: string
): Record<Role, WpRolePageContent> {
  const contents = {} as Record<Role, WpRolePageContent>;
  for (const role of ROLES) {
    contents[role] = loadRolePageContent(role, locale);
  }
  return contents;
}
