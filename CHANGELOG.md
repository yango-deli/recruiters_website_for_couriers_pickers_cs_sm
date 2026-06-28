# Changelog

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.1.0/). Версии совпадают с `package.json`.

## [Unreleased]

## [0.3.0] — 2026-06-28

### Added

- React Figma careers landing (`FigmaCareersPage`) — hub + all roles (pickers, couriers, support, manager).
- Section components: Hero, Benefits, Why Join, Unique, Registration Steps, Form wrapper.
- [`design/figma-landing-spec.md`](design/figma-landing-spec.md) and [`src/styles/figma-landing.css`](src/styles/figma-landing.css).

### Changed

- Careers routes render React sections instead of synced Elementor HTML; legal pages still use WP HTML.
- `LeadForm` and submit API unchanged — only outer form section layout updated.

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
