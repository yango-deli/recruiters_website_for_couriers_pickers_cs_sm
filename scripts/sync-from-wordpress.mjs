#!/usr/bin/env node
/**
 * Sync WordPress pages + uploads into content/wp/ and public/wp-assets/.
 * Usage: node scripts/sync-from-wordpress.mjs [--skip-assets]
 */
import {
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
  createWriteStream,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CONTENT_DIR = join(ROOT, "content", "wp");
const HTML_DIR = join(CONTENT_DIR, "html");
const ASSETS_DIR = join(ROOT, "public", "wp-assets");

const CAREERS_SLUGS = new Set([
  "careers",
  "yango-deli-careers-original",
  "work-with-us-couriers-he",
  "work-with-us-couriers-en",
  "work-with-us-storekeepers-he",
  "work-with-us-storekeepers-en",
  "work-with-us-support-he",
]);

const ROLE_BY_SLUG = {
  "work-with-us-couriers-he": "couriers",
  "work-with-us-couriers-en": "couriers",
  "work-with-us-storekeepers-he": "pickers",
  "work-with-us-storekeepers-en": "pickers",
  "work-with-us-support-he": "support",
};

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
const SKIP_ASSETS = process.argv.includes("--skip-assets");

function extractImages(html) {
  const urls = new Set();
  const re = /(?:https:\/\/yango-deli\.co\.il)?(\/wp-content\/uploads\/[^"'\s)>]+)/gi;
  let m;
  while ((m = re.exec(html))) urls.add(m[1]);
  return [...urls];
}

function hasZoho(html) {
  return /zoho|forms\.zohopublic/i.test(html);
}

function guessLocale(slug) {
  if (slug.endsWith("-ru")) return "ru";
  if (slug.endsWith("-en")) return "en";
  if (slug.endsWith("-he")) return "he";
  return "he";
}

function rewriteAssetPaths(html) {
  return html
    .replace(
      /https:\/\/yango-deli\.co\.il\/wp-content\/uploads\//g,
      "/wp-assets/uploads/"
    )
    .replace(/\/wp-content\/uploads\//g, "/wp-assets/uploads/");
}

function rewriteInternalLinks(html, slug) {
  const locale = guessLocale(slug);
  return html.replace(
    /https:\/\/yango-deli\.co\.il\/([a-z0-9-]+)\/?/gi,
    (_, pathSlug) => {
      if (pathSlug === "work-with-us-couriers-he") return `/${locale}/couriers`;
      if (pathSlug === "work-with-us-couriers-en") return `/en/couriers`;
      if (pathSlug === "work-with-us-storekeepers-he") return `/${locale}/pickers`;
      if (pathSlug === "work-with-us-storekeepers-en") return `/en/pickers`;
      if (pathSlug === "work-with-us-support-he") return `/${locale}/support`;
      if (pathSlug === "careers") return `/${locale}`;
      return `/${locale}/${pathSlug}`;
    }
  );
}

async function fetchPages() {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/pages?per_page=100&status=publish`);
  if (!res.ok) throw new Error(`WP API ${res.status}`);
  return res.json();
}

async function downloadAsset(assetPath) {
  const rel = assetPath.replace(/^\/wp-content\//, "");
  const dest = join(ASSETS_DIR, rel);
  mkdirSync(dirname(dest), { recursive: true });
  if (existsSync(dest)) return dest;

  const url = `${WP_URL}${assetPath}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  skip asset ${res.status}: ${url}`);
    return null;
  }
  await pipeline(res.body, createWriteStream(dest));
  return dest;
}

async function main() {
  mkdirSync(HTML_DIR, { recursive: true });
  mkdirSync(ASSETS_DIR, { recursive: true });

  console.log(`Syncing from ${WP_URL}...`);
  const pages = await fetchPages();
  const allImages = new Set();
  const manifest = {
    syncedAt: new Date().toISOString(),
    wpUrl: WP_URL,
    pages: [],
  };

  for (const p of pages) {
    const slug = p.slug;
    const raw = p.content?.rendered ?? "";
    const images = extractImages(raw);
    images.forEach((img) => allImages.add(img));

    let html = rewriteAssetPaths(raw);
    html = rewriteInternalLinks(html, slug);

    writeFileSync(join(HTML_DIR, `${slug}.html`), html, "utf8");

    const category = CAREERS_SLUGS.has(slug)
      ? "careers"
      : slug === "home"
        ? "home"
        : "legal";

    manifest.pages.push({
      id: p.id,
      slug,
      title: p.title?.rendered?.replace(/<[^>]+>/g, "") ?? "",
      link: p.link,
      category,
      locale: guessLocale(slug),
      role: ROLE_BY_SLUG[slug] ?? null,
      htmlPath: `content/wp/html/${slug}.html`,
      imageCount: images.length,
      hasZoho: hasZoho(raw),
      htmlBytes: Buffer.byteLength(raw, "utf8"),
    });
  }

  manifest.pages.sort((a, b) => a.slug.localeCompare(b.slug));

  const manifestPath = join(CONTENT_DIR, "manifest.json");
  if (existsSync(manifestPath)) {
    const prev = JSON.parse(readFileSync(manifestPath, "utf8"));
    for (const page of prev.pages ?? []) {
      if (page.locale === "ru" && page.slug?.endsWith("-ru")) {
        if (!manifest.pages.some((p) => p.slug === page.slug)) {
          manifest.pages.push(page);
        }
      }
    }
    manifest.pages.sort((a, b) => a.slug.localeCompare(b.slug));
  }

  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`Saved ${manifest.pages.length} HTML files → content/wp/html/`);

  if (!SKIP_ASSETS) {
    console.log(`Downloading ${allImages.size} assets...`);
    let ok = 0;
    for (const img of allImages) {
      const dest = await downloadAsset(img);
      if (dest) ok++;
    }
    console.log(`Downloaded ${ok}/${allImages.size} → public/wp-assets/`);
  }

  writeFileSync(join(CONTENT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log("manifest → content/wp/manifest.json");
  console.log("Tip: run npm run generate:ru to refresh Russian HTML pages.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
