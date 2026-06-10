# Project context for AI agents

> **Start here** on a fresh clone. This file is the map of everything an agent needs to work on Yango Deli careers without prior chat history.

**Repository:** [yango-deli/recruiters_website_for_couriers_pickers_cs_sm](https://github.com/yango-deli/recruiters_website_for_couriers_pickers_cs_sm)  
**Production:** https://yangodeli-couriers-carriers-website.vercel.app  
**Version:** see `package.json` and [`CHANGELOG.md`](../CHANGELOG.md)

---

## What this project is

Single-page **careers landing** for [Yango Deli](https://yango-deli.co.il) (Israel grocery delivery). One URL per locale; four job roles share one page with tabbed navigation.

| Locale | Path | Direction |
|--------|------|-----------|
| Hebrew (default) | `/he` | RTL |
| English | `/en` | LTR |
| Russian | `/ru` | LTR |

| Role key | Audience |
|----------|----------|
| `pickers` | In-store order pickers |
| `couriers` | Delivery riders |
| `support` | Customer service (chat/phone, often remote) |
| `manager` | Shift managers |

Deep link: `?role=couriers` (see `LandingPageRoleSync`).

---

## Documentation index

| File | Purpose |
|------|---------|
| [`README.md`](../README.md) | Setup, commands, deploy URLs |
| [`CHANGELOG.md`](../CHANGELOG.md) | Version history |
| [`docs/RELEASE.md`](RELEASE.md) | CI/CD, GitHub secrets, Vercel |
| [`docs/MIGRATION.md`](MIGRATION.md) | Repo migration from personal GitHub to `yango-deli` org |
| [`docs/CONTENT.md`](CONTENT.md) | i18n structure, section copy rules, no duplicate content |
| [`docs/AGENT_ONBOARDING_PROMPT.md`](AGENT_ONBOARDING_PROMPT.md) | Copy-paste prompt for a new Cursor agent |
| [`docs/LOCAL_BACKUP.md`](LOCAL_BACKUP.md) | What is in git vs local-only, restore steps |
| [`design/yango-deli-design.md`](../design/yango-deli-design.md) | Design DNA, macrostructure, Hallmark archetypes |
| [`design/brand-assets.md`](../design/brand-assets.md) | Brand pack paths, logo rules, Yandex Disk sync |
| [`AGENTS.md`](../AGENTS.md) | Agent entrypoint + Next.js 16 notes |
| [`.cursor/rules/yango-deli-design.mdc`](../.cursor/rules/yango-deli-design.mdc) | Cursor rule for UI files |
| [`.cursor/skills/yango-deli-design/SKILL.md`](../.cursor/skills/yango-deli-design/SKILL.md) | Design orchestrator skill |

---

## Cursor skills (committed in repo)

These live under `.cursor/skills/` and are **versioned in git** so any machine gets the same agent tooling after clone.

| Skill | Path | Use when |
|-------|------|----------|
| **yango-deli-design** | `.cursor/skills/yango-deli-design/` | Any UI/UX on this project — orchestrates UUPM + Hallmark + brand brief |
| **ui-ux-pro-max (UUPM)** | `.cursor/skills/ui-ux-pro-max/` | Pattern search, typography/UX CSV databases |
| **hallmark** | `.cursor/skills/hallmark/` | Anti-AI-slop audits, macrostructures, component archetypes |

### UUPM search (from repo root)

```bash
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "grocery careers scroll" --design-system -p "Yango Deli"
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "parallax storytelling" --domain style
```

Requires Python 3. No extra pip install for basic search.

### Hallmark verbs

- `hallmark audit src/components/sections` — slop checklist
- `hallmark redesign LandingPage` — visual only, keep copy/i18n
- `hallmark study <url>` — extract layout DNA

---

## Brand & design (source of truth)

### Live tokens (code wins over old brief)

Implemented in [`src/styles/tokens.css`](../src/styles/tokens.css) and [`src/app/globals.css`](../src/app/globals.css):

- Primary text: `#0e0e0e`
- Accent: `#ffcd57`
- Warm surfaces: `#fff9ed`, `#fff4d6`
- Fonts: **Yango Headline** + **Yango Text** (`public/fonts/`, `public/brand/Fonts/`)

[`design/yango-deli-design.md`](../design/yango-deli-design.md) still references older purple (`#060097`) in places — **follow `tokens.css` for implementation**, brief for structure/motion/archetypes.

### Brand assets in repo

- PDF guidelines: `public/brand/Basic Guidlines.pdf`
- Logos: `public/logos/official/`
- Illustrations: `public/brand/Illustration/`
- 3D bag: `public/brand/3d_bag/`
- Full photo pack: sync via `python3 scripts/sync-brand-from-yadisk.py` (~15GB, not in git — see `public/brand/local-assets-manifest.json`)

### Motion stack

- **Lenis** smooth scroll — [`SmoothScrollProvider.tsx`](../src/components/providers/SmoothScrollProvider.tsx)
- **GSAP ScrollTrigger** — pinned/spread sections, text reveals
- **Framer Motion** — hero micro-interactions

**Known fix (v0.2.0):** do **not** use `ScrollTrigger.scrollerProxy(document.documentElement)` with Lenis — caused invisible/black screen. Lenis updates via `gsap.ticker` + `ScrollTrigger.update` only.

**Reference clones (in git):** `.reference/` — chicago-current, hallmark, uupm, ia-startup (see `.reference/README.md`). Primary motion reference: [chicago-current](https://github.com/ryancalacsan/chicago-current).

---

## Page architecture

Entry: [`src/app/[locale]/page.tsx`](../src/app/[locale]/page.tsx) → [`LandingPage.tsx`](../src/components/LandingPage.tsx)

### Section order (`SECTION_IDS`)

```
hero → mission → trust → benefits → features → how-it-works → cta → footer
```

| Section ID | Component | Content source (`src/messages/{locale}.json`) |
|------------|-----------|-----------------------------------------------|
| hero | `Hero` | `roles.{role}.hero` |
| mission | `MissionSplit` | `roles.{role}.mission` (+ `headline1`/`headline2`, `perks`) |
| trust | `TrustList` | `roles.{role}.trust.points` |
| benefits | `Benefits` | `roles.{role}.benefits` |
| features | `Features` / horizontal pin | `roles.{role}.whyJoin` |
| how-it-works | `HowItWorks` | `roles.{role}.howItWorks` |
| cta | `JourneyCta` | `roles.{role}.cta` |
| footer | `Footer` | `footer.*` |

`SectionTransition` blocks between sections are **decorative only** (no duplicate content cards).

### Content rules (critical)

- **No duplicate copy** across hero / mission / trust / benefits / whyJoin / howItWorks for the same role.
- Forms and CTA buttons are exempt.
- Mission headlines use `mission.headline1` + `mission.headline2` — **not** `benefits.title` / `whyJoin.title`.
- Edit all three locales together: `en.json`, `ru.json`, `he.json`.

See [`docs/CONTENT.md`](CONTENT.md).

---

## Forms & leads

- Modal: [`ApplyModal`](../src/components/modals/ApplyModal.tsx) + [`LeadForm`](../src/components/forms/LeadForm.tsx)
- API: `POST /api/submit-lead` → Telegram ([`src/lib/telegram.ts`](../src/lib/telegram.ts))
- Env: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (local `.env.local`, Vercel production, GitHub Secrets for future CI use)
- Honeypot field: `company`

Courier role adds vehicle + tax fields (see [`src/lib/forms/schema.ts`](../src/lib/forms/schema.ts)).

---

## i18n

- **next-intl** — [`src/i18n/routing.ts`](../src/i18n/routing.ts), middleware [`src/middleware.ts`](../src/middleware.ts)
- Messages: [`src/messages/`](../src/messages/)
- RTL: `dir="rtl"` when `locale === "he"` in layout

---

## CI / deploy

- Workflow: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)
- Push to `main` → lint + build → Vercel production deploy
- Required GitHub Secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- Also in secrets: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

Vercel project ID: `prj_RteDbZeITDPEc4VaTtIAbjM8njIk` (see [`docs/RELEASE.md`](RELEASE.md)).

---

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/expand-role-content.mjs` | Bulk-expand role sections in JSON |
| `scripts/sync-brand-from-yadisk.py` | Download full brand pack from Yandex Disk |
| `scripts/explore-zoho*.mjs`, `scripts/verify-*` | Zoho Forms integration research (committed) |

---

## Tech stack

- Next.js **16** App Router, TypeScript, React 19
- Tailwind CSS **v4**, shadcn/ui
- Framer Motion, GSAP + ScrollTrigger, Lenis
- React Hook Form + Zod
- Node **≥ 22**

Read Next.js 16 breaking changes in `node_modules/next/dist/docs/` before assuming older Next APIs ([`AGENTS.md`](../AGENTS.md)).

---

## What is NOT in git (by design)

See [`docs/LOCAL_BACKUP.md`](LOCAL_BACKUP.md) for full restore guide.

| Path | Why |
|------|-----|
| `.env.local` | Secrets — use GitHub Secrets + `.env.local.example` |
| `.vercel/` | Local Vercel CLI link — IDs in `vercel.project.json` |
| `public/brand/Yango_Deli_Photos/` etc. | ~15GB, files >100MB — sync via script + `local-assets-manifest.json` |
| `node_modules/`, `.next/` | Build artifacts |

**In git:** `.reference/`, `.hallmark/`, `.cursor/skills/`, Zoho exploration scripts, agent docs.

---

## Quick agent checklist

1. Read this file + [`docs/CONTENT.md`](CONTENT.md) for copy work
2. For UI: load **yango-deli-design** skill + `design/yango-deli-design.md`
3. Never hardcode user-facing strings — use `src/messages/*.json`
4. Run `npm run lint && npm run build` before PR
5. PR → `main` → auto-deploy (when Vercel token valid)
