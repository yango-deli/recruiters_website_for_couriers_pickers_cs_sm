# CRM production cutover — careers website

**Site (prod):** https://yangodeli-couriers-carriers-website-sable.vercel.app  
**CRM (prod, target):** https://delicrm.com

The careers site is **pre-wired** for CRM. Until recruitment phase-2 is deployed on `delicrm.com`, leads go to **Telegram**. After CRM deploy, the same env vars start delivering to CRM automatically — no website code change required.

---

## 1. What is already on the website (Vercel production)

| Variable | Value |
|----------|-------|
| `TELEGRAM_BOT_TOKEN` | From GitHub Secret → synced on each deploy |
| `TELEGRAM_CHAT_ID` | From GitHub Secret → synced on each deploy |
| `CRM_API_URL` | `https://delicrm.com` |
| `CRM_INTAKE_URL` | `https://delicrm.com/api/recruitment/webhook` |
| `CRM_WEBHOOK_SECRET` | From GitHub Secret `CRM_WEBHOOK_SECRET` (same on both sides) |

CI job `Sync runtime env to Vercel` runs on every push to `main` (see `.github/workflows/ci.yml`).

### Generate shared webhook secret (one-time)

```bash
openssl rand -hex 32
```

1. Add to **website** repo GitHub Secret: `CRM_WEBHOOK_SECRET`
2. Add to **CRM** Vercel production: `RECRUITMENT_WEBHOOK_SECRET` (identical string)

---

## 2. What to set on CRM when you deploy

On `delicrm.com` Vercel project (`frontend/` root):

| Variable | Value |
|----------|-------|
| `RECRUITMENT_WEBHOOK_SECRET` | Same as website `CRM_WEBHOOK_SECRET` |
| `CAREERS_CORS_ORIGINS` | `https://yangodeli-couriers-carriers-website-sable.vercel.app` |

Deploy branch that includes:

- `POST /api/recruitment/webhook`
- `GET /api/public/hiring-targets?role=`
- Hiring campaigns schema + migrations

---

## 3. Verify after CRM deploy

```bash
# 1) Public hiring targets (forms dropdown)
curl -s "https://delicrm.com/api/public/hiring-targets?role=pickers" | jq .

# 2) Website proxy (server-side, no CORS)
curl -s "https://yangodeli-couriers-carriers-website-sable.vercel.app/api/hiring-targets?role=pickers" | jq .

# 3) Webhook (replace SECRET)
curl -s -X POST "https://delicrm.com/api/recruitment/webhook" \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: SECRET" \
  -d '{"role":"pickers","firstName":"Test","lastName":"Lead","phone":"0501234567","city":"Tel Aviv","locale":"he"}'

# 4) End-to-end: submit on site → check CRM pipeline + Telegram notification
```

Expected webhook response: `201` with `imported: 1` (or `duplicates` if phone already exists).

---

## 4. Behaviour by phase

| Phase | Telegram | CRM webhook | User sees |
|-------|----------|-------------|-----------|
| **Now** (CRM not on prod) | ✅ delivers | ⚠️ logged as `crmPending` | Success if Telegram OK |
| **After CRM deploy** | ✅ delivers | ✅ delivers | Success, both channels |
| CRM only, no Telegram | — | ✅ | Success when CRM OK |
| Neither configured | — | — | 503 |

---

## 5. Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Form error on prod | `TELEGRAM_*` missing on Vercel | Re-run deploy on `main` or `node scripts/sync-vercel-env.mjs` locally with secrets |
| CRM never receives leads | Secret mismatch | Align `CRM_WEBHOOK_SECRET` ↔ `RECRUITMENT_WEBHOOK_SECRET` |
| Dropdown shows only “Any branches” | `GET /api/public/hiring-targets` 404 on CRM | Deploy CRM + create active hiring campaigns |
| Webhook 401 | Wrong secret | Re-sync secret on both projects |
| Webhook 500 | DB migration / intake user | Run `prisma migrate deploy` on CRM prod |

---

## 6. Local E2E (both repos)

```bash
# CRM
cd yango-internal-platform/frontend && npm run dev

# Website
cd recruiters_website_for_couriers_pickers_cs_sm
# .env.local:
#   TELEGRAM_BOT_TOKEN=...
#   TELEGRAM_CHAT_ID=...
#   CRM_API_URL=http://localhost:3000
#   CRM_INTAKE_URL=http://localhost:3000/api/recruitment/webhook
#   CRM_WEBHOOK_SECRET=dev-local-webhook-secret-change-me
npm run dev -- -p 3001
```

See also: `docs/HIRING-CAMPAIGNS-E2E.md`, CRM `docs/HANDOFF-Hiring-Campaigns-Website.md`.
