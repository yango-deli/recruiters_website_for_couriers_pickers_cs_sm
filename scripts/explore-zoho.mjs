import { chromium } from "playwright";
import { writeFileSync } from "fs";

const ZOHO_EMAIL = "Recruit1@yangodeli.co.il";
const ZOHO_PASSWORD = "ZoHoDeLi12&";

async function login(page) {
  await page.goto("https://accounts.zoho.com/signin?servicename=ZohoForms", {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await page.waitForTimeout(3000);

  for (const sel of ['input#login_id', 'input[name="LOGIN_ID"]', 'input[type="email"]']) {
    const el = page.locator(sel).first();
    if (await el.isVisible({ timeout: 2000 }).catch(() => false)) {
      await el.fill(ZOHO_EMAIL);
      break;
    }
  }

  const next = page.locator("#nextbtn, button:has-text('Next')").first();
  if (await next.isVisible({ timeout: 3000 }).catch(() => false)) {
    await next.click();
    await page.waitForTimeout(2000);
  }

  await page.locator('input#password, input[type="password"]').first().fill(ZOHO_PASSWORD);
  await page.locator("#nextbtn, button:has-text('Sign in')").first().click();
  await page.waitForTimeout(8000);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  await login(page);
  console.log("After login URL:", page.url());

  await page.goto("https://forms.zoho.com/recruit1yang1/home#myforms", {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await page.waitForTimeout(5000);

  const text = await page.locator("body").innerText();
  writeFileSync("scripts/zoho-home-text.txt", text);
  await page.screenshot({ path: "scripts/zoho-home.png", fullPage: true });
  console.log("Home text length:", text.length);
  console.log("Snippet:", text.slice(0, 1500));

  const editUrls = [
    "https://forms.zoho.com/recruit1yang1/form/Untitled4/edit",
    "https://forms.zoho.com/recruit1yang1/form/Untitled/edit",
    "https://forms.zoho.com/recruit1yang1/form/Untitled5/edit",
    "https://forms.zoho.com/recruit1yang1/form/Untitled1/edit",
    "https://forms.zoho.com/recruit1yang1/form/Untitled4/build",
    "https://forms.zoho.com/recruit1yang1/formbuilder/Untitled4/edit",
  ];

  for (const url of editUrls) {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(3000);
    const title = await page.title();
    const snippet = (await page.locator("body").innerText()).slice(0, 400);
    console.log("\nURL:", url);
    console.log("Title:", title);
    console.log("Snippet:", snippet.replace(/\n/g, " | "));
  }

  await browser.close();
}

main().catch(console.error);
