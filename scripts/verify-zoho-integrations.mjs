import { chromium } from "playwright";

const ZOHO_EMAIL = "Recruit1@yangodeli.co.il";
const ZOHO_PASSWORD = "ZoHoDeLi12&";
const WEBHOOK_BASE =
  "https://yangodeli-couriers-carriers-website.vercel.app/api/zoho-webhook";

const FORMS = ["Untitled4", "Untitled", "Untitled5", "Untitled1"];

async function login(page) {
  await page.goto("https://accounts.zoho.com/signin?servicename=ZohoForms", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(2000);
  const emailInput = page.locator('input[type="email"], #login_id').first();
  if (await emailInput.isVisible({ timeout: 8000 }).catch(() => false)) {
    await emailInput.fill(ZOHO_EMAIL);
    await page.locator("#nextbtn, button:has-text('Next')").first().click();
  }
  await page.waitForTimeout(1500);
  await page.locator('input[type="password"], #password').first().fill(ZOHO_PASSWORD);
  await page.locator("#nextbtn, button:has-text('Sign in')").first().click();
  await page.waitForTimeout(5000);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await login(page);
  await page.goto("https://forms.zoho.com/recruit1yang1/home#myforms");
  await page.waitForTimeout(4000);

  const bodyText = await page.locator("body").innerText();
  console.log("Forms visible:", FORMS.map((f) => bodyText.includes(f)));

  for (const formName of FORMS) {
    try {
      await page.goto("https://forms.zoho.com/recruit1yang1/home#myforms");
      await page.waitForTimeout(3000);

      const row = page.locator("tr, .zf-form-list-item, li").filter({
        hasText: formName,
      }).first();

      if (await row.isVisible({ timeout: 5000 }).catch(() => false)) {
        await row.click();
        await page.waitForTimeout(2000);
      }

      const pageContent = await page.content();
      const hasWebhook = pageContent.includes(WEBHOOK_BASE);
      const hasGoogle = /google sheets|googlesheets/i.test(pageContent);

      console.log(`${formName}: webhook=${hasWebhook} google=${hasGoogle} url=${page.url()}`);
      await page.screenshot({
        path: `scripts/verify-${formName.replace(/\s/g, "_")}.png`,
        fullPage: true,
      });
    } catch (e) {
      console.log(`${formName}: error ${e.message}`);
    }
  }

  await browser.close();
}

main();
