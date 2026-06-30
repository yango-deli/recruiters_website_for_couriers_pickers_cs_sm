#!/usr/bin/env node
/**
 * Capture support landing section bands from live page (1366px) when Figma export is unavailable.
 * Usage: node scripts/capture-support-sections.mjs [baseUrl]
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../public/careers/support");
const BASE = process.argv[2] ?? "http://localhost:3001";

const SECTIONS = [
  { id: "benefits", file: "benefits-section.png" },
  { id: "why-join", file: "why-join-section.png" },
  { id: "unique", file: "unique-band.png" },
  { id: "steps", file: "steps-section.png" },
];

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  await page.goto(`${BASE}/he/support`, { waitUntil: "networkidle", timeout: 120_000 });

  const hero = page.locator("#hero .careers-hero__media img, #hero .careers-hero__image").first();
  if (await hero.count()) {
    await hero.screenshot({ path: join(OUT, "hero-photo.png") });
    console.log("Wrote hero-photo.png");
  }

  for (const { id, file } of SECTIONS) {
    const el = page.locator(`#${id}`).first();
    if (!(await el.count())) {
      console.warn(`Skip ${file}: #${id} not found`);
      continue;
    }
    await el.screenshot({ path: join(OUT, file) });
    console.log(`Wrote ${file}`);
  }

  const footerLogo = page.locator(".careers-footer__figma-logo-img").first();
  if (await footerLogo.count()) {
    await footerLogo.screenshot({ path: join(OUT, "footer-logo.png") });
    console.log("Wrote footer-logo.png");
  } else {
    await page.locator(".careers-footer").first().screenshot({
      path: join(OUT, "footer-logo.png"),
      clip: { x: 900, y: 0, width: 400, height: 200 },
    });
    console.log("Wrote footer-logo.png (clip fallback)");
  }

  await browser.close();
  console.log("Done:", OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
