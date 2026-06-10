# Changelog

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/). Версии совпадают с `package.json`.

## [Unreleased]

### Added

- [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md) — полный контекст для AI-агентов (архитектура, skills, бренд, CI).
- [`docs/CONTENT.md`](docs/CONTENT.md) — правила i18n и уникальности контента по секциям.
- `.cursor/skills/` и `.cursor/rules/` в git — UUPM, Hallmark, yango-deli-design доступны после clone.
- `.env.local.example` — шаблон переменных окружения.

### Changed

- Канонический репозиторий перенесён в [yango-deli/recruiters_website_for_couriers_pickers_cs_sm](https://github.com/yango-deli/recruiters_website_for_couriers_pickers_cs_sm). См. [`docs/MIGRATION.md`](docs/MIGRATION.md).
- `AGENTS.md` — точка входа для агентов со ссылками на всю документацию.

## [0.2.0] — 2026-06-09

### Changed

- Уникальный контент во всех секциях для каждой роли (pickers, couriers, support, manager) на he / en / ru — без повторов между hero, mission, trust, benefits, features и how-it-works.
- Отдельные заголовки mission (`headline1` / `headline2`) вместо дублирования заголовков benefits и whyJoin.
- Transition-блоки между секциями — только декор, без повторяющихся карточек контента.

### Fixed

- Чёрный / пустой экран на localhost: исправлена интеграция Lenis + GSAP ScrollTrigger.
- Анимации `TextReveal`, `SplitTextReveal` и `SectionScrollReveal` — контент не «застревает» невидимым после анимации.

## [0.1.0] — 2026-06-09

### Added

- Первый production-релиз careers-лендинга Yango Deli на Vercel.
- CI/CD через GitHub Actions: lint, build, deploy в production при merge в `main`.

[0.2.0]: https://github.com/yango-deli/recruiters_website_for_couriers_pickers_cs_sm/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/yango-deli/recruiters_website_for_couriers_pickers_cs_sm/releases/tag/v0.1.0
