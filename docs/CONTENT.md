# Content & i18n guide

All user-facing copy lives in [`src/messages/`](../src/messages/). Components read via `next-intl` — **no hardcoded strings** in TSX for role content.

## File structure per role

Each locale file has `roles.{pickers|couriers|support|manager}`:

```json
{
  "hero": { "title", "subtitle", "highlights[]", "cta", "image" },
  "mission": { "label", "headline1", "headline2", "body", "perks[]" },
  "trust": { "label?", "subtitle?", "points[]" },
  "benefits": { "label?", "title", "subtitle?", "items[]" },
  "whyJoin": { "label?", "title", "subtitle?", "items[]" },
  "howItWorks": { "label?", "title", "subtitle?", "items[]" },
  "cta": { "title", "subtitle?", "button" }
}
```

Shared keys: `meta`, `nav`, `common`, `form`, `footer`, `landing`.

## Section → JSON mapping

| UI section | JSON path | Notes |
|------------|-----------|-------|
| Hero | `hero` | `highlights` = pill chips under subtitle |
| Mission headlines | `mission.headline1`, `mission.headline2` | Scroll-swap lines in `MissionSplit` |
| Mission body + perk cards | `mission.body`, `mission.perks` | 4 perks with sticker paths |
| Trust | `trust.points` | 6 points typical; shared title from `landing.trust` |
| Benefits grid | `benefits.items` | Icon per item |
| Features carousel | `whyJoin.items` | Image per item |
| How it works | `howItWorks.items` | Icon per item |
| CTA block | `cta` | Also feeds delayed CTA prompt |

## Uniqueness rules (enforced v0.2.0+)

When editing or adding copy:

1. **No repeated titles** across `hero.highlights`, `mission.perks`, `trust.points`, `benefits.items`, `whyJoin.items`, `howItWorks.items` for the same role.
2. **No repeated descriptions** across those sections (exact or near-duplicate).
3. Each section answers a different question:
   - **hero** — hook + quick teasers
   - **mission** — why this role at Yango Deli
   - **trust** — what people love about the job (social proof angle)
   - **benefits** — day-to-day work tasks
   - **whyJoin** — perks/compensation
   - **howItWorks** — hiring/onboarding path
4. **Exempt:** `common.apply`, form labels, CTA button text, footer.

## Editing workflow

1. Change **all three** files: `en.json`, `ru.json`, `he.json`
2. Keep JSON valid (no trailing commas)
3. Hebrew: mind RTL phrasing; some legacy EN strings may remain in `he.json` — translate when touching that block
4. Image paths: `/icons/...`, `/images/...` — must exist under `public/`

## Bulk expansion

```bash
node scripts/expand-role-content.mjs
```

Use when adding new perk/trust/benefit slots across roles — then manually de-duplicate per rules above.

## Validation snippet

From repo root, check cross-section title duplicates:

```bash
node -e "
const fs=require('fs');
const loc='src/messages/en.json';
const data=JSON.parse(fs.readFileSync(loc,'utf8'));
for (const role of Object.keys(data.roles)) {
  const r=data.roles[role];
  const map=new Map();
  const add=(sec,t)=>{if(!t)return;const k=t.toLowerCase();if(!map.has(k))map.set(k,[]);map.get(k).push(sec);};
  r.hero?.highlights?.forEach(h=>add('hero',h));
  ['perks','points','items'].forEach(f=>{
    for (const sec of ['mission','trust','benefits','whyJoin','howItWorks']) {
      r[sec]?.[f]?.forEach(x=>add(sec,x.title||x));
    }
  });
  for (const [t,locs] of map) {
    const s=[...new Set(locs)];
    if (s.length>1) console.log(role+':',t,'->',s.join(', '));
  }
}
"
```

Should print nothing for a clean role.
