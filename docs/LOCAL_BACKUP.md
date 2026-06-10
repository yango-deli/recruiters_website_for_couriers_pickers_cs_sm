# Что в git, что только локально

Цель: после `git clone` на новой машине ничего важного не потерять.

## В git (после последнего коммита)

| Путь | Содержимое |
|------|------------|
| `.cursor/skills/`, `.cursor/rules/` | Agent skills и правила дизайна |
| `.reference/` | Снимки референс-репо (~50MB без nested `.git/`) |
| `.hallmark/log.json` | Лог последней Hallmark-сборки |
| `vercel.project.json` | Vercel project/org ID (не секрет) |
| `docs/PROJECT_CONTEXT.md`, `docs/AGENT_ONBOARDING_PROMPT.md` | Онбординг агентов |
| `scripts/explore-zoho*`, `scripts/verify-*`, `scripts/zoho-*` | Артефакты исследования Zoho Forms |
| `public/brand/local-assets-manifest.json` | Инвентарь 140 локальных файлов бренда |

## Не в git (и почему)

| Путь | Почему | Как восстановить |
|------|--------|------------------|
| `.env.local` | Секреты (Telegram) | Скопировать из `.env.local.example`; значения в GitHub Secrets |
| `node_modules/`, `.next/` | Артефакты сборки | `npm install`, `npm run dev` |
| `.vercel/` | Локальная привязка CLI | `vercel link` или скопировать из `vercel.project.json` |
| `public/brand/Yango_Deli_Photos/` | ~13GB, PSD >100MB | `python3 scripts/sync-brand-from-yadisk.py` |
| `public/brand/Presentation/` | ~1.6GB | тот же скрипт |
| `public/brand/Avatars/` | 384KB | тот же скрипт |
| `*.psd` | GitHub лимит 100MB/файл | Yandex Disk (см. `design/brand-assets.md`) |

## GitHub Secrets (орг `yango-deli`)

- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` — лиды в Telegram
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` — CI deploy (проверь актуальность токена)

## Быстрый старт на новой машине

```bash
git clone https://github.com/yango-deli/recruiters_website_for_couriers_pickers_cs_sm.git
cd recruiters_website_for_couriers_pickers_cs_sm
npm install
cp .env.local.example .env.local   # заполни Telegram
python3 scripts/sync-brand-from-yadisk.py   # опционально, если нужны фото/PSD
npm run dev
```

Промпт для агента: [`docs/AGENT_ONBOARDING_PROMPT.md`](AGENT_ONBOARDING_PROMPT.md)
