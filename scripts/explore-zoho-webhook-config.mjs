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

async function openWebhooks(page) {
  await page.goto(
    "https://forms.zoho.com/recruit1yang1/form/Untitled4/builder",
    { waitUntil: "domcontentloaded" }
  );
  await page.waitForTimeout(5000);
  await page.locator('text=INTEGRATIONS').first().click();
  await page.waitForTimeout(2000);
  await page.locator("text=Webhooks").first().click();
  await page.waitForTimeout(2000);
  await page.locator("text=Configure Webhook").first().click();
  await page.waitForTimeout(3000);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await login(page);
  await openWebhooks(page);

  const text = await page.locator("body").innerText();
  console.log(text.slice(0, 3500));

  const inputs = await page.locator("input, textarea, select").evaluateAll((els) =>
    els.map((el) => ({
      tag: el.tagName,
      type: el.getAttribute("type"),
      name: el.getAttribute("name"),
      id: el.id,
      placeholder: el.getAttribute("placeholder"),
      value: (el).value?.slice?.(0, 80),
    }))
  );
  console.log("\nInputs:", JSON.stringify(inputs, null, 2));

  await page.screenshot({ path: "scripts/webhook-config.png", fullPage: true });
  await browser.close();
}

main();
