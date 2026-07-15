#!/usr/bin/env node
/**
 * Push runtime env vars to the linked Vercel project (non-interactive).
 *
 * Used by CI on production deploy. Values come from process.env / GitHub Secrets.
 *
 * Plain config (TELEGRAM_*, CRM_API_URL, CRM_INTAKE_URL) is force-synced every deploy.
 *
 * CRM_WEBHOOK_SECRET is handled specially: it authenticates the site -> CRM lead
 * webhook. A stale/empty CI value silently overwriting the live Vercel value once
 * broke lead intake, so we no longer blindly `--force` it. Instead we VERIFY the
 * value against the live CRM webhook before syncing:
 *   - missing/empty       -> skip (never clobber the live secret), warn, continue
 *   - accepted by CRM     -> sync (force)
 *   - rejected (401/403)  -> FAIL the deploy with a clear error (secret mismatch),
 *                            WITHOUT overwriting the live value
 *   - CRM unreachable     -> skip (don't clobber), warn, continue
 */
import { spawnSync } from "node:child_process";

const targets = ["production"];

// Plain config values — safe to force-sync every deploy.
const CONFIG_KEYS = [
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_CHAT_ID",
  "CRM_API_URL",
  "CRM_INTAKE_URL",
];

function setEnv(key, value, env) {
  const res = spawnSync(
    "npx",
    ["vercel", "env", "add", key, env, "--force", "--token", process.env.VERCEL_TOKEN],
    { input: value, stdio: ["pipe", "inherit", "inherit"] }
  );
  if (res.status !== 0) {
    console.error(`[sync-vercel-env] failed ${key} (${env})`);
    process.exit(res.status ?? 1);
  }
  console.log(`[sync-vercel-env] set ${key} (${env})`);
}

/**
 * Confirm the CRM webhook accepts `secret` without mutating anything.
 * The CRM checks auth before parsing the body, so an empty JSON body yields
 * 401/403 for a bad secret and a 4xx validation error (never a stored record)
 * for a good one.
 * @returns {Promise<"accepted" | "rejected" | "unreachable">}
 */
async function verifyCrmSecret(intakeUrl, secret) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(intakeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Webhook-Secret": secret },
      body: "{}",
      signal: controller.signal,
    });
    return res.status === 401 || res.status === 403 ? "rejected" : "accepted";
  } catch {
    return "unreachable";
  } finally {
    clearTimeout(timeout);
  }
}

async function syncCrmWebhookSecret() {
  const secret = process.env.CRM_WEBHOOK_SECRET?.trim();
  const intakeUrl = process.env.CRM_INTAKE_URL?.trim();

  if (!secret) {
    console.warn(
      "[sync-vercel-env] skip CRM_WEBHOOK_SECRET (missing in CI) — leaving the live Vercel value untouched"
    );
    return;
  }
  if (!intakeUrl) {
    console.warn(
      "[sync-vercel-env] skip CRM_WEBHOOK_SECRET (no CRM_INTAKE_URL to verify against) — leaving the live value untouched"
    );
    return;
  }

  const result = await verifyCrmSecret(intakeUrl, secret);

  if (result === "rejected") {
    console.error(
      `[sync-vercel-env] CRM_WEBHOOK_SECRET is REJECTED by the CRM (${intakeUrl} -> HTTP 401/403).\n` +
        "Refusing to overwrite the live value with a bad secret — this would break site -> CRM lead intake.\n" +
        "Fix: set the GitHub secret CRM_WEBHOOK_SECRET to match the CRM's RECRUITMENT_WEBHOOK_SECRET, then re-run the deploy."
    );
    process.exit(1);
  }

  if (result === "unreachable") {
    console.warn(
      `[sync-vercel-env] could not reach CRM to verify CRM_WEBHOOK_SECRET (${intakeUrl}) — skipping sync to avoid clobbering the live value`
    );
    return;
  }

  for (const env of targets) setEnv("CRM_WEBHOOK_SECRET", secret, env);
  console.log("[sync-vercel-env] CRM_WEBHOOK_SECRET verified against CRM and synced");
}

async function main() {
  for (const key of CONFIG_KEYS) {
    const value = process.env[key]?.trim();
    if (!value) {
      console.warn(`[sync-vercel-env] skip ${key} (missing)`);
      continue;
    }
    for (const env of targets) setEnv(key, value, env);
  }

  await syncCrmWebhookSecret();

  console.log("[sync-vercel-env] done");
}

main().catch((err) => {
  console.error(`[sync-vercel-env] unexpected error: ${err?.message ?? err}`);
  process.exit(1);
});
