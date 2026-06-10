import { chromium } from "playwright";

const ZOHO_EMAIL = "Recruit1@yangodeli.co.il";
const ZOHO_PASSWORD = "ZoHoDeLi12&";

async function login(page) {
  await page.goto("https://accounts.zoho.com/signin?servicename=ZohoForms", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(2000);
  await page.locator('input#login_id, input[type="email"]').first().fill(ZOHO_EMAIL);
  await page.locator("#nextbtn").first().click();
  await page.waitForTimeout(1500);
  await page.locator('input#password').first().fill(ZOHO_PASSWORD);
  await page.locator("#nextbtn").first().click();
  await page.waitForTimeout(6000);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await login(page);
  await page.goto("https://forms.zoho.com/recruit1yang1/home#myforms");
  await page.waitForTimeout(4000);

  const formTitle = "(couriers) אפליקציה - בואו לעבוד איתנו - שליחים";
  await page.locator(`text=${formTitle}`).first().click();
  await page.waitForTimeout(4000);

  console.log("URL after click:", page.url());
  const text = await page.locator("body").innerText();
  console.log("Page text:", text.slice(0, 2000));

  const links = await page.locator("a, button").allInnerTexts();
  console.log("Buttons/links:", [...new Set(links)].filter(Boolean).slice(0, 40));

  await page.screenshot({ path: "scripts/zoho-form-detail.png", fullPage: true });
  await browser.close();
}

main();
