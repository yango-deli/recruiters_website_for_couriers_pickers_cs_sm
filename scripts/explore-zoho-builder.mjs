import { chromium } from "playwright";

const ZOHO_EMAIL = "Recruit1@yangodeli.co.il";
const ZOHO_PASSWORD = "ZoHoDeLi12&";

const BUILDERS = [
  { role: "couriers", link: "Untitled4", title: "(couriers)" },
  { role: "pickers", link: "Untitled", title: "Pickers" },
  { role: "support", link: "Untitled5", title: "שירות לקוחות" },
  { role: "manager", link: "Untitled1", title: "אחראי משמרת" },
];

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

  for (const form of BUILDERS) {
    const url = `https://forms.zoho.com/recruit1yang1/form/${form.link}/builder`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(5000);

    const text = await page.locator("body").innerText();
    const hasIntegrations = /integrations/i.test(text);
    const hasWebhook = /webhook/i.test(text);
    console.log(`\n${form.role} (${form.link}): ${page.url()}`);
    console.log("integrations:", hasIntegrations, "webhook:", hasWebhook);
    console.log("snippet:", text.slice(0, 600).replace(/\n/g, " | "));

    await page.screenshot({
      path: `scripts/builder-${form.role}.png`,
      fullPage: true,
    });
  }

  await browser.close();
}

main();
