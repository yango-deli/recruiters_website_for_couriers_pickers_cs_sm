# WordPress → Next.js migration

This site mirrors **yango-deli.co.il** (28 published WordPress pages) in Next.js while keeping **CRM-integrated `LeadForm`** instead of Zoho/WP forms.

## Sync from WordPress

```bash
node scripts/wp-audit.mjs          # inventory
node scripts/sync-from-wordpress.mjs   # HTML + uploads
npm run sync:wp
```

Requires network access to `https://yango-deli.co.il`. Optional `.env.local`:

```env
WP_URL=https://yango-deli.co.il
```

## URL map

| WordPress (legacy) | Next.js |
|--------------------|---------|
| `/careers` | `/he` |
| `/work-with-us-couriers-he` | `/he/couriers` |
| `/work-with-us-couriers-en` | `/en/couriers` |
| `/work-with-us-storekeepers-he` | `/he/pickers` |
| `/work-with-us-storekeepers-en` | `/en/pickers` |
| `/work-with-us-support-he` | `/he/support` |
| `/terms-of-use` | `/he/terms-of-use` |
| `/privacy-policy` | `/he/privacy-policy` |
| …all legal slugs | `/he/{slug}` |

**Manager** (`/he/manager`) — hub tab 4 content via `FigmaCareersPage` + `LeadForm`.

## Forms

- Zoho iframes from WP are **stripped** during sync.
- `<!-- LEAD_FORM_SLOT -->` is injected where the iframe was.
- [`LeadForm`](/src/components/forms/LeadForm.tsx) submits to `/api/submit-lead` + CRM hiring targets API.

## Assets

- HTML: `content/wp/html/{slug}.html`
- Images: `public/wp-assets/uploads/`
- Elementor CSS: `public/wp-assets/plugins/elementor/` + `public/wp-assets/uploads/elementor/css/post-*.css`

## Local dev

```bash
npm run dev -- -p 3001
# CRM on :3000 for hiring-targets dropdown
```
