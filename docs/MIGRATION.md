# Миграция репозитория (июнь 2026)

Канонический репозиторий проекта:

**https://github.com/yango-deli/recruiters_website_for_couriers_pickers_cs_sm**

Предыдущий репозиторий (архив, только для истории):

`https://github.com/Kuznetsovv15/yangodeli_couriers_carriers_website`

## Что перенесено

- Вся история коммитов ветки `main`
- Тег `v0.2.0` и GitHub Release
- CI workflow (`.github/workflows/ci.yml`)
- Код, ассеты, локали, скрипты — без изменений функциональности

## Клонирование и работа

```bash
git clone https://github.com/yango-deli/recruiters_website_for_couriers_pickers_cs_sm.git
cd recruiters_website_for_couriers_pickers_cs_sm
npm install
cp .env.local.example .env.local   # заполнить TELEGRAM_* и др.
npm run dev
```

## После миграции — обязательные шаги

### 1. GitHub Actions secrets (новый репозиторий)

[Settings → Secrets → Actions](https://github.com/yango-deli/recruiters_website_for_couriers_pickers_cs_sm/settings/secrets/actions):

| Secret | Значение |
|--------|----------|
| `VERCEL_TOKEN` | Токен Vercel (Account → Tokens) |
| `VERCEL_ORG_ID` | `team_g7rv4WZMHEpPS5kUUkYjl4Re` |
| `VERCEL_PROJECT_ID` | `prj_RteDbZeITDPEc4VaTtIAbjM8njIk` |

Без валидного `VERCEL_TOKEN` job **Deploy to Vercel** в Actions будет падать.

### 2. Vercel — привязать новый GitHub-репозиторий

Production URL не меняется: https://yangodeli-couriers-carriers-website.vercel.app

1. [Vercel → Project → Settings → Git](https://vercel.com/igoryangotaxi-bytes-projects/yangodeli-couriers-carriers-website/settings/git)
2. Disconnect старый репозиторий (если подключён)
3. Connect → организация **yango-deli** → `recruiters_website_for_couriers_pickers_cs_sm`
4. Production branch: `main`
5. Убедиться, что Environment Variables (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) на месте

Локальный `.vercel/project.json` уже указывает на тот же Vercel-проект — `vercel deploy --prod` продолжит работать.

### 3. Старый репозиторий (опционально)

В [Kuznetsovv15/yangodeli_couriers_carriers_website](https://github.com/Kuznetsovv15/yangodeli_couriers_carriers_website) можно:

- добавить в README ссылку на новый репозиторий;
- включить **Archive this repository**, чтобы не путать команду.

## Проверка после миграции

```bash
npm run lint && npm run build
```

- [ ] `main` в новом репозитории содержит все коммиты
- [ ] GitHub Actions: lint + build — green
- [ ] Production открывается: `/he`, `/en`, `/ru`
- [ ] Форма заявки отправляет лид в Telegram
