#!/usr/bin/env node
/**
 * Push runtime env vars to the linked Vercel project (non-interactive).
 *
 * Used by CI on production deploy. Values come from process.env / GitHub Secrets.
 *
 * Required for live forms today:
 *   TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 *
 * Pre-wired for CRM cutover (works once delicrm.com ships recruitment webhook):
 *   CRM_API_URL, CRM_INTAKE_URL, CRM_WEBHOOK_SECRET
 */
import { spawnSync } from "node:child_process";

const KEYS = [
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_CHAT_ID",
  "CRM_API_URL",
  "CRM_INTAKE_URL",
  "CRM_WEBHOOK_SECRET",
];

const targets = ["production"];

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

for (const key of KEYS) {
  const value = process.env[key]?.trim();
  if (!value) {
    console.warn(`[sync-vercel-env] skip ${key} (missing)`);
    continue;
  }
  for (const env of targets) {
    setEnv(key, value, env);
  }
}

console.log("[sync-vercel-env] done");
