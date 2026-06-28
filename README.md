# Yango Deli Careers Website

Сайт карьеры [Yango Deli](https://yango-deli.co.il) — набор персонала в Израиле: сборщики заказов, курьеры, служба поддержки, менеджеры смен.

**GitHub:** [yango-deli/recruiters_website_for_couriers_pickers_cs_sm](https://github.com/yango-deli/recruiters_website_for_couriers_pickers_cs_sm)  
**Production (актуальная WP-версия, как на localhost):** https://yangodeli-couriers-carriers-website-sable.vercel.app  
**Версия:** `0.3.0` — см. [`CHANGELOG.md`](CHANGELOG.md)

> ⚠️ **Не открывайте** `yangodeli-couriers-carriers-website.vercel.app` (без `-sable`) — это **старый** сайт на другом Vercel-проекте (LandingPage 2024). Для тестов и передачи проекта используйте только URL с `-sable`.

> Код и релизы ведутся **только через GitHub**. Push в `main` → CI → автодеплой на Vercel. Подробнее: [`docs/RELEASE.md`](docs/RELEASE.md).  
> Миграция с личного репозитория: [`docs/MIGRATION.md`](docs/MIGRATION.md).  
> **Для AI-агентов:** полный контекст проекта — [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md) (skills, бренд, архитектура, контент).

---

## Возможности

- **3 языка** — иврит (RTL), английский, русский
- **4 роли** — pickers, couriers, support, manager с отдельным контентом и изображениями
- **Deep links** — `?role=pickers|couriers|support|manager`
- **Анимации** — Framer Motion, GSAP ScrollTrigger, Lenis smooth scroll
- **Регистрация** — модальная форма, CTA-блок с формой, доставка лидов в Telegram (`/api/submit-lead`)
- **Адаптив** — mobile-first, safe-area, touch-friendly
- **Бренд** — токены Yango Deli, volumetric UI, официальные логотипы

## Языки и URL

| URL | Язык | Направление |
|-----|------|-------------|
| `/he` | Иврит | RTL |
| `/en` | English | LTR |
| `/ru` | Русский | LTR |

По умолчанию: **иврит** (`/he`).

Пример: `http://localhost:3000/ru?role=couriers`

## Стек

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** + shadcn/ui
- **next-intl** — локализация
- **Framer Motion, GSAP, Lenis** — анимации и скролл
- **React Hook Form + Zod** — формы

## Быстрый старт

```bash
git clone https://github.com/yango-deli/recruiters_website_for_couriers_pickers_cs_sm.git
cd recruiters_website_for_couriers_pickers_cs_sm
npm install
npm run dev
```

Откройте [http://localhost:3000/he](http://localhost:3000/he).

### Команды

```bash
npm run dev      # dev-сервер
npm run build    # production-сборка
npm run start    # запуск production
npm run lint     # ESLint
```

### Переменные окружения

```bash
cp .env.local.example .env.local
```

| Переменная | Назначение |
|------------|------------|
| `TELEGRAM_BOT_TOKEN` | Бот для заявок (**обязательно на проде**, пока CRM не выкатан) |
| `TELEGRAM_CHAT_ID` | Чат/канал для уведомлений |
| `CRM_API_URL` | `https://delicrm.com` — список филиалов для форм (заработает после выката CRM) |
| `CRM_INTAKE_URL` | `https://delicrm.com/api/recruitment/webhook` |
| `CRM_WEBHOOK_SECRET` | = `RECRUITMENT_WEBHOOK_SECRET` в CRM (см. [`docs/CRM-PROD-CUTOVER.md`](docs/CRM-PROD-CUTOVER.md)) |
| `WP_*` | Опционально: синхронизация ассетов с WordPress |

### Production checklist (перед релизом)

1. `npm run generate:en && npm run generate:ru` — актуальные EN/RU HTML из ивритского источника
2. `npm run lint && npm run build` — 79 SSG-страниц без ошибок
3. Vercel env: `TELEGRAM_*` + `CRM_*` (CI синхронизирует с GitHub Secrets на каждый deploy — см. [`docs/CRM-PROD-CUTOVER.md`](docs/CRM-PROD-CUTOVER.md))
4. Smoke: `/he`, `/en`, `/ru` (hub) + 4 роли × 3 локали — 200, форма монтируется, жёлтый hero = `#FFCC00`
5. Submit тест на staging: Telegram + запись в CRM

На Vercel те же переменные задаются в [Project → Settings → Environment Variables](https://vercel.com/igoryangotaxi-bytes-projects/yangodeli-couriers-carriers-website/settings/environment-variables). **Не коммитьте `.env.local`.**

### Бренд-ассеты

В репозитории — только файлы, нужные для сайта. Полный пакет (PSD, фото, презентации) скачивается локально:

```bash
python3 scripts/sync-brand-from-yadisk.py
```

Каталог: [`design/brand-assets.md`](design/brand-assets.md)

## Структура проекта

```
src/
├── app/[locale]/       # Маршруты he / en / ru
├── components/
│   ├── brand/          # Логотип Yango Deli
│   ├── forms/          # Форма заявки
│   ├── layout/         # Header, Footer, PromoBar
│   ├── modals/         # Модалка заявки, CTA-попап
│   ├── motion/         # Анимационные компоненты
│   ├── sections/       # Hero, Benefits, Features…
│   └── ui/             # shadcn/ui
├── i18n/               # next-intl
├── lib/                # Хуки, утилиты, ассеты
├── messages/           # he.json, en.json, ru.json
└── styles/             # Design tokens
public/
├── images/             # Изображения ролей и бренда
├── logos/              # Официальные логотипы
└── fonts/              # Шрифты Yango
```

## CI и релизы

Workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) (`CI / Release`):

| Событие | Jobs |
|---------|------|
| Pull Request в `main` | Lint & build |
| Push в `main` | Lint & build → **Deploy to Vercel (production)** |

Полный процесс: [`docs/RELEASE.md`](docs/RELEASE.md). История версий: [`CHANGELOG.md`](CHANGELOG.md).

```bash
git checkout -b feature/my-change
# ... правки ...
npm run lint && npm run build
git push -u origin feature/my-change
# → Pull Request → merge в main → автодеплой
```

Статус сборок: [GitHub Actions](https://github.com/yango-deli/recruiters_website_for_couriers_pickers_cs_sm/actions).

## Деплой (production)

**https://yangodeli-couriers-carriers-website-sable.vercel.app**

Vercel team: **Yango Deli Israel tests** (`vercel.project.json`).

> ⚠️ Старый alias `yangodeli-couriers-carriers-website.vercel.app` привязан к **другому** Vercel-проекту и показывает устаревший LandingPage. Новая WP-вёрстка — только на URL выше, пока старый проект не удалят или alias не перенесут.

Обновляется после merge в `main` (GitHub Actions) или вручную: `npx vercel deploy --prod`.

### URL для демо коллегам

| Назначение | URL |
|------------|-----|
| Production (актуальный) | https://yangodeli-couriers-carriers-website-sable.vercel.app |
| Иврит (мלקטים) | https://yangodeli-couriers-carriers-website-sable.vercel.app/he/pickers |
| English | https://yangodeli-couriers-carriers-website-sable.vercel.app/en/pickers |
| Русский | https://yangodeli-couriers-carriers-website-sable.vercel.app/ru/pickers |
| Курьеры | https://yangodeli-couriers-carriers-website-sable.vercel.app/he/couriers |

### DNS records

Проект **не использует кастомный домен**. DNS для `*.vercel.app` управляется Vercel автоматически — **настраивать записи у регистратора не нужно**.

Техническая справка (резолв `yangodeli-couriers-carriers-website.vercel.app`):

```
Host:  yangodeli-couriers-carriers-website.vercel.app
Type:  A
Value: 64.29.17.3
       216.198.79.3
TTL:   управляется Vercel
```

Эти IP — anycast-адреса Vercel. Добавлять их вручную не требуется.

**Не относится к этому деплою:**

- **yango-deli.co.il** — основной сайт на Cloudflare, отдельный ресурс
- **applitaxi.space** — кастомный домен в Vercel-аккаунте, привязан к другому проекту

В [`src/app/[locale]/layout.tsx`](src/app/[locale]/layout.tsx) в metadata указан `https://yango-deli.co.il` — это SEO/canonical для бренда Yango Deli, не DNS текущего Vercel-деплоя.

### Свой домен (если понадобится позже)

1. Добавить домен в [Vercel → Project → Domains](https://vercel.com/igoryangotaxi-bytes-projects/yangodeli-couriers-carriers-website/settings/domains)
2. В DNS (например Cloudflare для `yango-deli.co.il`):
   - **Поддомен** (`careers.yango-deli.co.il`): `CNAME` → `cname.vercel-dns.com`
   - **Корень домена**: `A` → `76.76.21.21`

Vercel покажет точные records после добавления домена в dashboard.

### Локальный production

```bash
npm run build
npm run start
```

См. также [`.vercelignore`](.vercelignore) и [`vercel.json`](vercel.json).

## Скрипты в репозитории

| Скрипт | Назначение |
|--------|------------|
| `scripts/expand-role-content.mjs` | Расширение контента ролей в `src/messages/*.json` |
| `scripts/sync-brand-from-yadisk.py` | Локальная синхронизация бренд-ассетов |

Черновые Zoho-скрипты и скриншоты в `scripts/` игнорируются git — не часть production-сайта.

## Лицензия

Приватный проект — © Yango Deli. All rights reserved.
