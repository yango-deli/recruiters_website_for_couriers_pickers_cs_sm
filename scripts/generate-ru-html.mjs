#!/usr/bin/env node
/**
 * Generate Russian WP HTML pages from synced he/en sources.
 * Usage: node scripts/generate-ru-html.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const HTML_DIR = join(ROOT, "content", "wp", "html");
const MAP_PATH = join(ROOT, "content", "wp", "translations", "ru-map.json");

const SOURCES = [
  {
    source: "work-with-us-couriers-en.html",
    target: "work-with-us-couriers-ru.html",
    slug: "work-with-us-couriers-ru",
    role: "couriers",
    baseId: 115,
  },
  {
    source: "work-with-us-storekeepers-en.html",
    target: "work-with-us-storekeepers-ru.html",
    slug: "work-with-us-storekeepers-ru",
    role: "pickers",
    baseId: 463,
  },
  {
    source: "work-with-us-support-he.html",
    target: "work-with-us-support-ru.html",
    slug: "work-with-us-support-ru",
    role: "support",
    baseId: 906,
  },
  {
    source: "careers.html",
    target: "careers-ru.html",
    slug: "careers-ru",
    role: null,
    baseId: 1052,
  },
];

const map = JSON.parse(readFileSync(MAP_PATH, "utf8"));
const entries = Object.entries(map).sort((a, b) => b[0].length - a[0].length);

/** Normalize WP typography quirks so map keys match HTML. */
function normalizeText(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\u2019/g, "'")
    .replace(/\u2018/g, "'")
    .replace(/\u201c/g, '"')
    .replace(/\u201d/g, '"')
    .replace(/\u2013/g, "-")
    .replace(/\u00a0/g, " ")
    .replace(/\u202f/g, " ")
    .replace(/\r\n/g, "\n");
}

/** Collapse HTML whitespace so map keys match hero `<br><span>` variants. */
function normalizeHtmlKey(value) {
  return normalizeText(value)
    .replace(/<br\s*\/?>/gi, "<br>")
    .replace(/<br>\s+/g, "<br>")
    .replace(/\s+/g, " ")
    .trim();
}

function applyTranslations(html) {
  let out = normalizeText(html);
  for (const [from, to] of entries) {
    const source = normalizeText(from);
    if (!source || source === to) continue;
    out = out.split(source).join(to);
    const htmlSource = normalizeHtmlKey(from);
    const htmlTarget = normalizeHtmlKey(to);
    if (htmlSource !== source) {
      out = out.split(htmlSource).join(htmlTarget);
    }
  }
  out = out.replace(/href="\/he\//g, 'href="/ru/');
  out = out.replace(/href="\/en\//g, 'href="/ru/');
  out = out.replace(/href='\/he\//g, "href='/ru/");
  out = out.replace(/href='\/en\//g, "href='/ru/");
  return out;
}

const BRAND_ALLOW = /^(Yango Deli|Yango|Deli|Israel|Ltd|©|\d{4})$/i;

function auditEnglish(html, fileName) {
  const issues = [];
  for (const m of html.matchAll(/>([^<]{4,400})</g)) {
    const t = m[1]
      .replace(/&nbsp;/g, " ")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim();
    if (!t || t.startsWith("/") || t.includes("wp-assets")) continue;
    const cyrillic = (t.match(/[\u0400-\u04FF]/g) || []).length;
    const hebrew = (t.match(/[\u0590-\u05FF]/g) || []).length;
    if (hebrew > 0) issues.push(t);
    if (!/[A-Za-z]{4,}/.test(t)) continue;
    if (cyrillic > 12) continue;
    if (/^Yango Deli Israel Ltd/.test(t)) continue;
    if (t.includes("iframe.src") || t.includes("queryParams")) continue;
    issues.push(t);
  }
  if (issues.length > 0) {
    console.warn(`\n⚠ ${fileName}: ${issues.length} possible untranslated fragment(s):`);
    [...new Set(issues)].slice(0, 8).forEach((line) => console.warn("  -", line.slice(0, 120)));
  }
  return issues.length;
}

let totalIssues = 0;

for (const { source, target } of SOURCES) {
  const srcPath = join(HTML_DIR, source);
  if (!existsSync(srcPath)) {
    console.error("Missing source:", srcPath);
    process.exit(1);
  }
  const html = applyTranslations(readFileSync(srcPath, "utf8"));
  const outPath = join(HTML_DIR, target);
  writeFileSync(outPath, html);
  console.log("Wrote", target, `(${html.length} bytes)`);
  totalIssues += auditEnglish(html, target);
}

const manifestPath = join(ROOT, "content", "wp", "manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

for (const { slug, target, role, baseId, source } of SOURCES) {
  const srcEntry = manifest.pages.find((p) => p.slug === source.replace(".html", ""));
  const htmlPath = `content/wp/html/${target}`;
  const bytes = readFileSync(join(HTML_DIR, target), "utf8").length;
  const existing = manifest.pages.findIndex((p) => p.slug === slug);
  const entry = {
    id: srcEntry?.id ?? baseId,
    slug,
    title: `Yango Deli careers (${slug})`,
    link: `https://yango-deli.co.il/${slug}/`,
    category: "careers",
    locale: "ru",
    role,
    htmlPath,
    imageCount: srcEntry?.imageCount ?? 0,
    hasZoho: true,
    htmlBytes: bytes,
  };
  if (existing >= 0) manifest.pages[existing] = entry;
  else manifest.pages.push(entry);
}

manifest.syncedAt = new Date().toISOString();
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log("Updated manifest.json");

console.log("\nRunning sanitize:wp…");
spawnSync(process.execPath, [join(__dirname, "sanitize-wp-card-copy.mjs")], {
  stdio: "inherit",
});

if (totalIssues > 0) {
  console.warn(`\nTotal audit issues: ${totalIssues} — add keys to content/wp/translations/ru-map.json`);
  process.exitCode = 0;
}
