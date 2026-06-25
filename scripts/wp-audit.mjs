#!/usr/bin/env node
/**
 * Audit published WordPress pages via REST API.
 * Usage: node scripts/wp-audit.mjs [--json]
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function loadEnv() {
  const path = join(ROOT, ".env.local");
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = loadEnv();
const WP_URL = (process.env.WP_URL || env.WP_URL || "https://yango-deli.co.il").replace(
  /\/$/,
  ""
);

const CAREERS_SLUGS = new Set([
  "careers",
  "yango-deli-careers-original",
  "work-with-us-couriers-he",
  "work-with-us-couriers-en",
  "work-with-us-storekeepers-he",
  "work-with-us-storekeepers-en",
  "work-with-us-support-he",
]);

function extractImages(html) {
  const urls = new Set();
  const re = /(?:https?:\/\/yango-deli\.co\.il)?(\/wp-content\/uploads\/[^"'\s)>]+)/gi;
  let m;
  while ((m = re.exec(html))) urls.add(m[1]);
  return [...urls];
}

function extractLinks(html) {
  const links = new Set();
  const re = /href="(https:\/\/yango-deli\.co\.il\/[^"#?]+)/gi;
  let m;
  while ((m = re.exec(html))) links.add(m[1]);
  return [...links];
}

function hasZoho(html) {
  return /zoho|forms\.zohopublic/i.test(html);
}

function elementorWidgets(html) {
  const types = new Set();
  const re = /data-widget_type="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) types.add(m[1]);
  return [...types].sort();
}

async function fetchPages() {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/pages?per_page=100&status=publish`);
  if (!res.ok) throw new Error(`WP API ${res.status}`);
  return res.json();
}

async function main() {
  const pages = await fetchPages();
  const report = pages.map((p) => {
    const html = p.content?.rendered ?? "";
    return {
      id: p.id,
      slug: p.slug,
      title: p.title?.rendered?.replace(/<[^>]+>/g, "") ?? "",
      link: p.link,
      htmlBytes: Buffer.byteLength(html, "utf8"),
      category: CAREERS_SLUGS.has(p.slug)
        ? "careers"
        : p.slug === "home"
          ? "home"
          : "legal",
      images: extractImages(html),
      internalLinks: extractLinks(html),
      hasZoho: hasZoho(html),
      hasIframe: /<iframe/i.test(html),
      elementorWidgets: elementorWidgets(html),
    };
  });

  report.sort((a, b) => a.slug.localeCompare(b.slug));

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log(`WP audit: ${WP_URL} — ${report.length} pages\n`);
  for (const r of report) {
    console.log(
      `${r.slug.padEnd(42)} ${String(r.htmlBytes).padStart(7)}B  ${r.category.padEnd(8)} zoho=${r.hasZoho} imgs=${r.images.length}`
    );
  }
  console.log(
    `\nCareers: ${report.filter((r) => r.category === "careers").length} | Legal: ${report.filter((r) => r.category === "legal").length}`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
