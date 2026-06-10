# Yango Deli Careers Website

Сайт карьеры [Yango Deli](https://yango-deli.co.il) — набор персонала в Израиле: сборщики заказов, курьеры, служба поддержки, менеджеры смен.

**GitHub:** [yango-deli/recruiters_website_for_couriers_pickers_cs_sm](https://github.com/yango-deli/recruiters_website_for_couriers_pickers_cs_sm)  
**Production:** https://yangodeli-couriers-carriers-website.vercel.app  
**Версия:** `0.2.0` — см. [`CHANGELOG.md`](CHANGELOG.md)

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
| `TELEGRAM_BOT_TOKEN` | Бот для заявок с сайта |
| `TELEGRAM_CHAT_ID` | Чат/канал для уведомлений |
| `WP_*` | Опционально: синхронизация ассетов с WordPress |

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

**https://yangodeli-couriers-carriers-website.vercel.app**

Обновляется автоматически после merge в `main`. Ручной `vercel --prod` — только аварийный обход.

### URL для демо коллегам

| Назначение | URL |
|------------|-----|
| Production (основной) | https://yangodeli-couriers-carriers-website.vercel.app |
| Иврит (по умолчанию) | https://yangodeli-couriers-carriers-website.vercel.app/he |
| English | https://yangodeli-couriers-carriers-website.vercel.app/en |
| Русский | https://yangodeli-couriers-carriers-website.vercel.app/ru |
| Пример (курьеры) | https://yangodeli-couriers-carriers-website.vercel.app/ru?role=couriers |

Дополнительный alias Vercel:
`https://yangodeli-couriers-carriers-websit-igoryangotaxi-bytes-projects.vercel.app`

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
