# Промпт для нового агента (скопируй целиком)

Вставь текст ниже в **новый чат Cursor** после клонирования репозитория.

---

```
Ты работаешь над проектом Yango Deli Careers — одностраничный лендинг вакансий (сборщики, курьеры, поддержка, менеджеры) для Израиля.

Репозиторий: https://github.com/yango-deli/recruiters_website_for_couriers_pickers_cs_sm
Продакшн: https://yangodeli-couriers-carriers-website.vercel.app
Версия: см. package.json (сейчас 0.2.0)

## Обязательный порядок изучения (не пропускай)

1. docs/PROJECT_CONTEXT.md — главная карта проекта для агентов
2. AGENTS.md — entrypoint + особенности Next.js 16
3. docs/CONTENT.md — правила i18n и уникальности контента по секциям
4. design/yango-deli-design.md — design DNA, macrostructure, Hallmark archetypes
5. design/brand-assets.md — бренд-пак, пути к ассетам
6. src/styles/tokens.css — живые токены (#0e0e0e, #ffcd57); код важнее старого purple в brief
7. src/components/LandingPage.tsx — архитектура страницы (8 секций)
8. src/messages/en.json, ru.json, he.json — весь пользовательский текст
9. .cursor/skills/yango-deli-design/SKILL.md — оркестратор дизайна (UUPM + Hallmark + бренд)
10. docs/RELEASE.md, docs/MIGRATION.md — CI/CD, секреты, миграция репо

## Стек

Next.js 16 App Router, React 19, TypeScript, Tailwind v4, next-intl (he/en/ru, RTL для he), GSAP + ScrollTrigger, Lenis, Framer Motion, React Hook Form + Zod.

## Критические правила

- Не дублировать копирайт между секциями одной роли (hero, mission, trust, benefits, whyJoin, howItWorks). Формы и CTA — исключение.
- Mission использует mission.headline1/headline2, не benefits.title / whyJoin.title.
- Любые UI-строки — только через src/messages/*.json, все 3 локали синхронно.
- Не использовать ScrollTrigger.scrollerProxy(document.documentElement) с Lenis — ломает экран.
- Для UI/редизайна: загрузи skill yango-deli-design и следуй design/yango-deli-design.md.
- Минимальный diff; не трогай несвязанный код.

## Секции страницы (SECTION_IDS)

hero → mission → trust → benefits → features → how-it-works → cta → footer

SectionTransition между секциями — только декор, без дублирующего текста.

## Лиды и формы

POST /api/submit-lead → Telegram. Схема: src/lib/forms/schema.ts. Секреты: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (GitHub Secrets + Vercel env, локально .env.local из .env.local.example).

## Большие ассеты (не в git)

public/brand/Yango_Deli_Photos/, Presentation/, Avatars/ (~15GB, PSD >100MB) — восстановить:
  python3 scripts/sync-brand-from-yadisk.py
Инвентарь: public/brand/local-assets-manifest.json

## Референсы в репо

.reference/ — снимки chicago-current, hallmark, uupm, ia-startup (см. .reference/README.md)
.cursor/skills/ — закреплённые skills для агентов

## После изменений

npm run lint && npm run build

## Твоя задача сейчас

[ОПИШИ ЗДЕСЬ КОНКРЕТНУЮ ЗАДАЧУ]

Перед кодом: кратко перескажи что понял из PROJECT_CONTEXT и какие файлы затронешь. Спроси, если что-то неясно.
```

---

## English version (copy-paste for agents)

```
You are working on Yango Deli Careers — a single-page recruitment landing (pickers, couriers, support, managers) for Israel.

Repo: https://github.com/yango-deli/recruiters_website_for_couriers_pickers_cs_sm
Production: https://yangodeli-couriers-carriers-website.vercel.app

Read in order: docs/PROJECT_CONTEXT.md → AGENTS.md → docs/CONTENT.md → design/yango-deli-design.md → src/styles/tokens.css → LandingPage.tsx → src/messages/*.json → .cursor/skills/yango-deli-design/SKILL.md

Rules: no duplicate copy across sections per role; i18n in all 3 locales; no scrollerProxy with Lenis; use yango-deli-design skill for UI; minimal diffs.

Large brand assets: sync with `python3 scripts/sync-brand-from-yadisk.py` (see public/brand/local-assets-manifest.json).

Your task: [DESCRIBE TASK HERE]

Before coding, summarize your understanding and which files you will touch.
```
