# Figma Landing Page — implementation spec

Source: [Figma Landing-Page](https://www.figma.com/design/3E7R9IbEFyg2VZzl0siqnt/Landing-Page)  
Brand: [Brand Overview](https://www.figma.com/design/2b8KFACkq68FfHewV9tbT5/Brand-Overview?node-id=0-1)

**Locale scope (current phase):** Hebrew only — pixel-perfect vs 6 Figma frames. EN/RU landing deferred; `/en` and `/ru` hub/role URLs redirect to `/he`.

## Architecture

| Layer | Path |
|-------|------|
| UI | `src/components/careers/*` |
| Styles | `src/styles/careers-landing.css` (scope `.careers-site`) |
| Content | `src/content/landing/he/{couriers,pickers,support}.json` |
| Loader | `src/lib/landing/load-content.ts` |
| Forms (frozen) | `LeadForm` via `FormSection` + `.careers-form-section .wp-lead-form*` |
| Legal only | WP HTML + `WpLegalPage` |

## Figma frames (HE)

| Role | Desktop | Mobile |
|------|---------|--------|
| Couriers | `2:25196` | `2:25980` |
| Pickers | `2:23029` | `2:24213` |
| Support | `2:28` | `2:3006` |

## Section map (top → bottom)

| # | Section | Component | Content |
|---|---------|-----------|---------|
| 1 | Chrome | `CareersChrome` | i18n nav |
| 2 | Hero | `HeroSection` | JSON `hero` |
| 3 | Benefits | `BenefitsSection` | JSON `sections[type=benefits]` |
| 4 | Unique | `UniqueSection` | JSON `sections[type=unique]` |
| 5 | Why join | `WhyJoinSection` | JSON `sections[type=whyJoin]` |
| 6 | Steps | `StepsSection` | JSON `sections[type=registration]` |
| 7 | Form | `FormSection` | JSON title + **LeadForm** |
| 8 | Footer | `CareersFooter` | i18n + `#form-{role}` |

Section order varies by role (see each JSON file).

## Role variants

| | Couriers | Pickers / Support |
|---|----------|-------------------|
| Accent | `#fede47` | `#ffcc00` |
| Chrome | Dark (`.careers-site--couriers .careers-chrome`) | Light |
| Hero | Full-bleed 44/56 | Contained yellow 50/50 |
| Unique cols | 5 | 4 / 3 |
| Why join | `variant: courier` horizontal | `variant: standard` grid |
| Steps band | Yellow + grey cards | Black band |
| Footer | Light `#f5f5f5` | Black |

## Tokens

See [`figma-token-map.md`](figma-token-map.md) and `--careers-*` aliases in [`tokens.css`](../src/styles/tokens.css).

## Form boundary (do not change)

- `LeadForm`, schema, submit API — unchanged
- Wrapper: `FormSection` + `#form-{role}` anchor

## QA

[`figma-qa-checklist.md`](figma-qa-checklist.md)

## Maintenance

Regenerate HE JSON from synced WP (fallback): `node scripts/export-landing-content.mjs`  
Prefer updating JSON from Figma MCP when copy changes.
