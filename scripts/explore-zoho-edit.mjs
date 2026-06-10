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
  await page.goto("https://forms.zoho.com/recruit1yang1/home#myforms");
  await page.waitForTimeout(4000);

  const formTitle = "(couriers) אפליקציה - בואו לעבוד איתנו - שליחים";
  await page.locator(`text=${formTitle}`).first().click();
  await page.waitForTimeout(2000);

  const editBtn = page.locator('a:has-text("Edit"), button:has-text("Edit")').first();
  await editBtn.click();
  await page.waitForTimeout(6000);

  console.log("Edit URL:", page.url());
  const text = await page.locator("body").innerText();
  console.log("Edit page:", text.slice(0, 2500));

  await page.screenshot({ path: "scripts/zoho-edit.png", fullPage: true });

  const tabs = await page.locator('[role="tab"], .zf-tab, li, a').allInnerTexts();
  const unique = [...new Set(tabs.map((t) => t.trim()).filter((t) => t.length < 40))];
  console.log("Tabs:", unique.slice(0, 50));

  await browser.close();
}

main();
