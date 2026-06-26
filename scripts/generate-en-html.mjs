#!/usr/bin/env node
/**
 * Generate English WP HTML from Russian pages (ru-map inverts EN→RU).
 * Usage: node scripts/generate-en-html.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const HTML_DIR = join(ROOT, "content", "wp", "html");
const RU_MAP_PATH = join(ROOT, "content", "wp", "translations", "ru-map.json");
const EN_OVERRIDES_PATH = join(
  ROOT,
  "content",
  "wp",
  "translations",
  "en-overrides.json"
);

const SOURCES = [
  {
    source: "careers-ru.html",
    target: "careers-en.html",
    slug: "careers-en",
    role: null,
    baseId: 1052,
  },
  {
    source: "work-with-us-support-ru.html",
    target: "work-with-us-support-en.html",
    slug: "work-with-us-support-en",
    role: "support",
    baseId: 906,
  },
];

const ruMap = JSON.parse(readFileSync(RU_MAP_PATH, "utf8"));
const overrides = existsSync(EN_OVERRIDES_PATH)
  ? JSON.parse(readFileSync(EN_OVERRIDES_PATH, "utf8"))
  : {};

/** Build RU → EN from ru-map (EN/HE keys → RU values). */
function buildRuToEn() {
  const ruToEn = { ...overrides };
  const candidates = new Map();

  for (const [from, to] of Object.entries(ruMap)) {
    if (!to || from === to) continue;
    const latin = (from.match(/[A-Za-z]/g) || []).length;
    const hebrew = (from.match(/[\u0590-\u05FF]/g) || []).length;
    const cyrillic = (to.match(/[\u0400-\u04FF]/g) || []).length;
    if (cyrillic < 3) continue;
    if (latin >= 3 && latin >= hebrew) {
      const list = candidates.get(to) ?? [];
      list.push(from);
      candidates.set(to, list);
    }
  }

  for (const [ru, list] of candidates) {
    if (ruToEn[ru]) continue;
    list.sort((a, b) => b.length - a.length);
    ruToEn[ru] = list[0];
  }

  return ruToEn;
}

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

function applyReplacements(html, pairs) {
  let out = normalizeText(html);
  const entries = pairs.sort((a, b) => b[0].length - a[0].length);
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
  return out;
}

/** Build HE → EN via RU bridge (for fragments still in Hebrew after RU source pass). */
function buildHeToEn(ruToEn) {
  const heToEn = {};
  for (const [from, ru] of Object.entries(ruMap)) {
    const hebrew = (from.match(/[\u0590-\u05FF]/g) || []).length;
    if (hebrew < 4) continue;
    const en = ruToEn[ru] ?? overrides[ru];
    if (!en || en === from) continue;
    heToEn[from] = en;
  }
  return heToEn;
}

function applyTranslations(html, ruToEn, heToEn) {
  let out = applyReplacements(html, Object.entries(ruToEn));
  out = applyReplacements(out, Object.entries(heToEn));
  out = out.replace(/href="\/ru\//g, 'href="/en/');
  out = out.replace(/href='\/ru\//g, "href='/en/");
  return out;
}

function auditCyrillic(html, fileName) {
  const issues = [];
  for (const m of html.matchAll(/>([^<]{4,400})</g)) {
    const t = m[1].replace(/\s+/g, " ").trim();
    if (!t) continue;
    const cyrillic = (t.match(/[\u0400-\u04FF]/g) || []).length;
    const hebrew = (t.match(/[\u0590-\u05FF]/g) || []).length;
    if (cyrillic > 8) issues.push(t);
    if (hebrew > 4) issues.push(t);
  }
  if (issues.length > 0) {
    console.warn(`\n⚠ ${fileName}: ${issues.length} untranslated fragment(s):`);
    [...new Set(issues)].slice(0, 6).forEach((line) => console.warn("  -", line.slice(0, 120)));
  }
  return issues.length;
}

const ruToEn = buildRuToEn();
const heToEn = buildHeToEn(ruToEn);
let totalIssues = 0;

for (const { source, target } of SOURCES) {
  const srcPath = join(HTML_DIR, source);
  if (!existsSync(srcPath)) {
    console.error("Missing source:", srcPath);
    process.exit(1);
  }
  const html = applyTranslations(readFileSync(srcPath, "utf8"), ruToEn, heToEn);
  writeFileSync(join(HTML_DIR, target), html);
  console.log("Wrote", target, `(${html.length} bytes)`);
  totalIssues += auditCyrillic(html, target);
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
    locale: "en",
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
  console.warn(`\nTotal audit issues: ${totalIssues}`);
}
