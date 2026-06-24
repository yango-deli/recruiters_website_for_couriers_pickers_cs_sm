# Hiring campaigns — local & Vercel E2E

## Local stack (works now)

```bash
# Terminal 1 — CRM
cd yango-internal-platform/frontend
npm run db:local    # if Postgres not running
npm run dev         # :3000

# Terminal 2 — careers website
cd recruiters_website_for_couriers_pickers_cs_sm
# .env.local:
#   CRM_API_URL=http://localhost:3000
#   CRM_INTAKE_URL=http://localhost:3000/api/recruitment/webhook
#   CRM_WEBHOOK_SECRET=<same as RECRUITMENT_WEBHOOK_SECRET in CRM>
npm run dev -- -p 3001
```

Open http://localhost:3001/he?role=couriers (or pickers / support / manager).

Forms load locations from `GET /api/hiring-targets` (proxied to CRM).  
Create an **active** hiring campaign in CRM → Positions before testing.

## Vercel (preview / production)

Required env on the **website** Vercel project:

| Variable | Example |
|----------|---------|
| `CRM_API_URL` | `https://delicrm.com` |
| `CRM_INTAKE_URL` | `https://delicrm.com/api/recruitment/webhook` |
| `CRM_WEBHOOK_SECRET` | same as CRM `RECRUITMENT_WEBHOOK_SECRET` |

For **preview** deployments testing a CRM preview branch, set `CRM_API_URL` on the Preview environment to the CRM preview URL (e.g. `https://yango-internal-platform-xxx.vercel.app`).

CRM must expose `GET /api/public/hiring-targets` (hiring-campaigns feature deployed + DB migrated).

## Verify

```bash
curl "https://<CRM>/api/public/hiring-targets?role=couriers"
curl "https://<WEBSITE>/api/hiring-targets?role=couriers"
```

Both should return `targets` with `targetId` for active campaigns.
