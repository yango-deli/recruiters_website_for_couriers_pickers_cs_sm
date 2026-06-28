# Figma Landing Page — implementation spec

Source: [Figma Landing-Page](https://www.figma.com/design/3E7R9IbEFyg2VZzl0siqnt/Landing-Page)  
Reference implementation: synced Elementor HTML + [`src/styles/wp-isolation.css`](../src/styles/wp-isolation.css)

## Tokens (locked)

| Token | Value |
|-------|-------|
| `--figma-accent` | `#ffcc00` |
| `--figma-accent-hover` | `#e6b800` |
| `--figma-black` | `#000000` |
| `--figma-section-black` | `#111111` |
| `--figma-card-illus-bg` | `#ececec` |
| `--figma-container` | `71.25rem` (1140px) |
| `--figma-chrome-height` | `4.25rem` |
| `--figma-hero-height` | `clamp(300px, 36vw, 435px)` |
| `--figma-card-radius` | `1.25rem` |
| Font heading | Yango Headline |
| Font body | Yango Text |

## Section map (top → bottom)

| # | Figma / WP section | React component | i18n |
|---|-------------------|-----------------|------|
| 1 | Hero (yellow) | `FigmaHero` | `roles.{role}.hero` |
| 2 | מה מצפה לך? | `FigmaBenefits` | `roles.{role}.benefits` (first 3 items) |
| 3 | למה שווה לך להצטרף? | `FigmaWhyJoin` | `roles.{role}.whyJoin` |
| 4 | מה יש לנו שאין לאחרים | `FigmaUnique` | `roles.{role}.howItWorks` (first 4 items) |
| 5 | נרשמים וקדימה לדרך! | `FigmaRegistrationSteps` | `landing.registrationPath` |
| 6 | רוצים להתחיל לעבוד? + form | `FigmaFormSection` | `landing.formSectionTitle` + **LeadForm** |
| 7 | Footer | `FigmaFooter` | `footer.*` |

## Form boundary (do not change)

- `LeadForm`, `FormField`, schema, submit API — unchanged
- Only wrapper: `FigmaFormSection` provides layout + `#form-{role}` anchor

## Breakpoints

- Mobile: ≤767px — stacked cards, full-width
- Tablet: 768–1023px — 2-column grids where applicable
- Desktop: ≥1024px — match Figma 1140px container

## Assets

Reuse `public/wp-assets/uploads/2026/02/*`, `public/icons/*`, `public/images/*`.
