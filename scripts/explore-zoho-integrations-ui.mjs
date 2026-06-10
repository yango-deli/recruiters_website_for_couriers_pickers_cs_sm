import { chromium } from "playwright";

const ZOHO_EMAIL = "Recruit1@yangodeli.co.il";
const ZOHO_PASSWORD = "ZoHoDeLi12&";

async function login(page) {
  await page.goto("https://accounts.zoho.com/signin?servicename=ZohoForms", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(2000);
  await page.locator('input#login_id').first().fill(ZOHO_EMAIL);
  await page.locator("#nextbtn").first().click();
  await page.waitForTimeout(1500);
  await page.locator('input#password').first().fill(ZOHO_PASSWORD);
  await page.locator("#nextbtn").first().click();
  await page.waitForTimeout(6000);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await login(page);

  await page.goto(
    "https://forms.zoho.com/recruit1yang1/form/Untitled4/builder",
    { waitUntil: "domcontentloaded" }
  );
  await page.waitForTimeout(5000);

  await page.locator('text=INTEGRATIONS').first().click();
  await page.waitForTimeout(4000);

  const text = await page.locator("body").innerText();
  console.log("Integrations page:", text.slice(0, 3000));

  const html = await page.content();
  const matches = [...html.matchAll(/webhook|google.?sheet|sheet and calendar/gi)].map(
    (m) => m[0]
  );
  console.log("HTML matches:", [...new Set(matches)]);

  await page.screenshot({ path: "scripts/integrations-tab.png", fullPage: true });

  // Try clicking Webhooks
  const wh = page.locator("text=Webhooks").first();
  if (await wh.isVisible({ timeout: 5000 }).catch(() => false)) {
    await wh.click();
    await page.waitForTimeout(3000);
    console.log("\nWebhooks subpage:", (await page.locator("body").innerText()).slice(0, 2000));
    await page.screenshot({ path: "scripts/webhooks-tab.png", fullPage: true });
  }

  await browser.close();
}

main();
