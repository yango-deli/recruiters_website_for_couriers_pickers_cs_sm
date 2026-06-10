/**
 * Configures Zoho Forms webhooks + Google Sheets for all 4 role forms.
 */
import { chromium } from "playwright";

const ZOHO_EMAIL = process.env.ZOHO_EMAIL ?? "Recruit1@yangodeli.co.il";
const ZOHO_PASSWORD = process.env.ZOHO_PASSWORD ?? "ZoHoDeLi12&";
const WEBHOOK_SECRET =
  process.env.ZOHO_WEBHOOK_SECRET ?? "9cdca914df31b124987d83f03ec869f6";
const WEBHOOK_BASE =
  process.env.WEBHOOK_BASE ??
  "https://yangodeli-couriers-carriers-website.vercel.app/api/zoho-webhook";

const FORMS = [
  {
    role: "couriers",
    link: "Untitled4",
    sheetName: "Leads — Couriers",
  },
  {
    role: "pickers",
    link: "Untitled",
    sheetName: "Leads — Pickers",
  },
  {
    role: "support",
    link: "Untitled5",
    sheetName: "Leads — Support",
  },
  {
    role: "manager",
    link: "Untitled1",
    sheetName: "Leads — Manager",
  },
];

async function login(page) {
  await page.goto("https://accounts.zoho.com/signin?servicename=ZohoForms", {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await page.waitForTimeout(2000);
  await page.locator('input#login_id').first().fill(ZOHO_EMAIL);
  await page.locator("#nextbtn").first().click();
  await page.waitForTimeout(1500);
  await page.locator('input#password').first().fill(ZOHO_PASSWORD);
  await page.locator("#nextbtn").first().click();
  await page.waitForTimeout(6000);
}

async function openIntegrations(page, linkName) {
  await page.goto(
    `https://forms.zoho.com/recruit1yang1/form/${linkName}/builder`,
    { waitUntil: "domcontentloaded", timeout: 90000 }
  );
  await page.waitForTimeout(5000);
  await page.locator('text=INTEGRATIONS').first().click();
  await page.waitForTimeout(2500);
}

async function configureWebhook(page, role) {
  const webhookUrl = `${WEBHOOK_BASE}?role=${role}&secret=${WEBHOOK_SECRET}`;

  await page.locator("text=Webhooks").first().click();
  await page.waitForTimeout(2000);

  const configureBtn = page.locator("text=Configure Webhook").first();
  if (await configureBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await configureBtn.click();
    await page.waitForTimeout(2000);
  }

  const urlInput = page.locator("#webhook_url");
  await urlInput.waitFor({ state: "visible", timeout: 10000 });
  await urlInput.fill(webhookUrl);

  const autoMap = page.locator("text=Auto-Map Fields").first();
  if (await autoMap.isVisible({ timeout: 3000 }).catch(() => false)) {
    await autoMap.click();
    await page.waitForTimeout(1500);
  }

  const saveBtn = page.getByRole("button", { name: "Save", exact: true });
  await saveBtn.click({ timeout: 10000 });
  await page.waitForTimeout(3000);

  const savedUrl = await urlInput.inputValue().catch(() => "");
  return { webhookUrl, saved: savedUrl.includes(WEBHOOK_BASE) };
}

async function configureGoogleSheets(page, sheetName) {
  await page.locator("text=Google Sheets").first().click();
  await page.waitForTimeout(3000);

  const integrateBtn = page
    .locator('button:has-text("Integrate"), text=Integrate, text=Configure')
    .first();
  if (await integrateBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await integrateBtn.click();
    await page.waitForTimeout(3000);
  }

  const createNew = page
    .locator("text=Create new spreadsheet, text=New Spreadsheet, text=Create New")
    .first();
  if (await createNew.isVisible({ timeout: 5000 }).catch(() => false)) {
    await createNew.click();
    await page.waitForTimeout(1000);
  }

  const nameInput = page
    .locator('input[placeholder*="Spreadsheet"], input[placeholder*="sheet"], input[type="text"]')
    .filter({ hasNot: page.locator("#webhook_url") })
    .first();
  if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await nameInput.fill(sheetName);
  }

  const autoMap = page.locator("text=Auto-Map Fields, text=Auto Map").first();
  if (await autoMap.isVisible({ timeout: 3000 }).catch(() => false)) {
    await autoMap.click();
    await page.waitForTimeout(1500);
  }

  for (const label of ["Integrate", "Save"]) {
    const btn = page.getByRole("button", { name: label, exact: true });
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click();
      await page.waitForTimeout(4000);
      break;
    }
  }

  const body = await page.locator("body").innerText();
  return {
    sheetName,
    configured: /integrated|connected|success|already/i.test(body),
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  const results = [];

  try {
    console.log("Logging into Zoho...");
    await login(page);

    for (const form of FORMS) {
      console.log(`\n=== ${form.role} (${form.link}) ===`);
      try {
        await openIntegrations(page, form.link);

        const webhook = await configureWebhook(page, form.role);
        console.log("Webhook:", webhook);

        await openIntegrations(page, form.link);
        const sheets = await configureGoogleSheets(page, form.sheetName);
        console.log("Sheets:", sheets);

        results.push({
          role: form.role,
          webhook: webhook.saved,
          sheets: sheets.configured,
        });
      } catch (err) {
        console.error(`Error ${form.role}:`, err.message);
        await page.screenshot({
          path: `scripts/setup-error-${form.role}.png`,
          fullPage: true,
        });
        results.push({ role: form.role, error: err.message });
      }
    }
  } finally {
    await browser.close();
  }

  console.log("\n=== RESULTS ===");
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
