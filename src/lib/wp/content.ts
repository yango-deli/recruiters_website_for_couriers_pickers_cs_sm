import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getWpPageBySlug } from "@/lib/wp/manifest";
import { stripWpLegacyChrome } from "@/lib/wp/strip-legacy-chrome";
import type { Role } from "@/types/role";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

function inferRoleForIframe(html: string, index: number, fallback?: Role): Role | undefined {
  if (fallback) return fallback;

  const before = html.slice(Math.max(0, index - 900), index);
  const idMatches = [...before.matchAll(/id="form-(couriers|pickers|support)"/gi)];
  if (idMatches.length > 0) {
    return idMatches[idMatches.length - 1][1].toLowerCase() as Role;
  }

  const srcChunk = html.slice(index, index + 500);
  if (/אחראי|משמרת/i.test(srcChunk)) return "manager";
  if (/Untitled4/.test(srcChunk)) return "couriers";
  if (/Untitled5/.test(srcChunk)) return "support";
  if (/Untitled1/.test(srcChunk)) return "support";
  if (/form\/Untitled\//.test(srcChunk)) return "pickers";

  return undefined;
}

function buildFormMount(iframeTag: string, role?: Role, index = 0): string {
  const roleAttr = role ? ` data-role="${role}"` : "";
  const id = index === 0 ? 'id="lead-form-mount"' : `id="lead-form-mount-${index}"`;

  return `<div ${id} class="wp-lead-form-mount"${roleAttr}></div>`;
}

export function sanitizeWpHtml(html: string): string {
  let out = html;
  out = out.replace(/<script[\s\S]*?<\/script>/gi, "");
  out = out.replace(/<iframe[\s\S]*?<\/iframe>/gi, "");
  out = out.replace(/<object[\s\S]*?<\/object>/gi, "");
  out = out.replace(/<embed[\s\S]*?\/?>/gi, "");
  out = out.replace(/\s+on\w+="[^"]*"/gi, "");
  out = out.replace(/\s+on\w+='[^']*'/gi, "");
  return out.trim();
}

export function injectLeadFormSlot(html: string, defaultRole?: Role): string {
  let mountIndex = 0;

  return html.replace(/<iframe[\s\S]*?<\/iframe>/gi, (iframeTag, offset) => {
    const role = inferRoleForIframe(html, offset, defaultRole);
    const mount = buildFormMount(iframeTag, role, mountIndex);
    mountIndex += 1;
    return mount;
  });
}

export function loadWpHtml(slug: string): string | null {
  const page = getWpPageBySlug(slug);
  if (!page) return null;

  const candidates = [
    join(ROOT, page.htmlPath),
    join(ROOT, "content/wp/html", `${slug}.html`),
    join(ROOT, "content/wp/html", `${decodeURIComponent(slug)}.html`),
  ];

  for (const filePath of candidates) {
    if (existsSync(filePath)) {
      return readFileSync(filePath, "utf8");
    }
  }
  return null;
}

function rewriteLocalePaths(html: string, locale: string): string {
  return html.replace(/href="\/(he|en|ru)\//g, `href="/${locale}/`);
}

const FOOTER_LINK_LABELS: Record<string, { terms: string; privacy: string }> = {
  he: { terms: "תנאי שימוש", privacy: "מדיניות פרטיות" },
  en: { terms: "Terms of Use", privacy: "Privacy Policy" },
  ru: { terms: "Условия использования", privacy: "Политика конфиденциальности" },
};

/** WP footer links ship in English even on HE pages — localize per locale. */
function localizeFooterLinks(html: string, locale: string): string {
  const labels = FOOTER_LINK_LABELS[locale];
  if (!labels) return html;
  return html
    .replace(/Terms of Use/g, labels.terms)
    .replace(/Privacy Policy/g, labels.privacy);
}

export function prepareCareersHtml(
  slug: string,
  role?: Role,
  locale?: string
): string | null {
  const raw = loadWpHtml(slug);
  if (!raw) return null;
  let html = stripWpLegacyChrome(injectLeadFormSlot(raw, role));
  html = sanitizeWpHtml(html);
  if (locale) {
    html = rewriteLocalePaths(html, locale);
    html = localizeFooterLinks(html, locale);
  }
  return html;
}

export function prepareLegalHtml(slug: string, locale?: string): string | null {
  const raw = loadWpHtml(slug);
  if (!raw) return null;
  let html = sanitizeWpHtml(raw);
  if (locale) {
    html = rewriteLocalePaths(html, locale);
  }
  return html;
}
