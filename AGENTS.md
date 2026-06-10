<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent guide — Yango Deli Careers

**Read first:** [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md) — full project map, architecture, skills, brand, CI, content rules.

## Quick links

| Task | Read |
|------|------|
| Onboarding / big picture | [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md) |
| Edit copy / i18n | [`docs/CONTENT.md`](docs/CONTENT.md) + `src/messages/*.json` |
| UI / design / motion | [`.cursor/skills/yango-deli-design/SKILL.md`](.cursor/skills/yango-deli-design/SKILL.md) + [`design/yango-deli-design.md`](design/yango-deli-design.md) |
| Brand assets | [`design/brand-assets.md`](design/brand-assets.md) |
| Release / deploy | [`docs/RELEASE.md`](docs/RELEASE.md) |
| Repo migration | [`docs/MIGRATION.md`](docs/MIGRATION.md) |

## Cursor skills (in repo)

- **yango-deli-design** — orchestrator for this project's UI
- **ui-ux-pro-max** — design system search (`python3 .cursor/skills/ui-ux-pro-max/scripts/search.py ...`)
- **hallmark** — anti-slop audits and macrostructures

Cursor rule for UI files: [`.cursor/rules/yango-deli-design.mdc`](.cursor/rules/yango-deli-design.mdc)

## Hard rules

1. User-facing text → `src/messages/{he,en,ru}.json` only
2. No duplicate content across page sections (see `docs/CONTENT.md`)
3. Brand tokens → `src/styles/tokens.css` (not generic Tailwind palettes)
4. `npm run lint && npm run build` before finishing
5. Do not commit `.env.local` or secrets

## Local setup

```bash
npm install
cp .env.local.example .env.local   # fill TELEGRAM_*
npm run dev                        # http://localhost:3000/he
```
