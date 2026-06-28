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

| # | Figma / WP section | React component | Content source |
|---|-------------------|-----------------|---------------|
| 1 | Hero (yellow) | `FigmaHero` | WP HTML (`parseWpRolePage`) |
| 2 | Benefits / ההחלטה שלך / מה מצפה לך? | `FigmaBenefits` | WP HTML |
| 3 | מה יש לנו שאין לאחרים | `FigmaUnique` | WP HTML |
| 4 | למה שווה לך להצטרף? | `FigmaWhyJoin` | WP HTML |
| 5 | נרשמים וקדימה לדרך! | `FigmaRegistrationSteps` | WP HTML |
| 6 | Form heading + form | `FigmaFormSection` | WP title + **LeadForm** (unchanged) |
| 7 | Footer | `FigmaCareersFooter` | i18n labels; links `/terms-of-use`, `/privacy-policy`; apply CTA → `#form-{role}` |

Section order follows each role's synced WP HTML (couriers: benefits → unique → whyJoin; pickers: benefits → whyJoin → unique).

## Couriers appendix (Figma 1:1)

Reference export: [`design/reference/HE-New-2-wheels-Landing-page.svg`](reference/HE-New-2-wheels-Landing-page.svg) (1366×4200)

| Area | Notes |
|------|-------|
| Body class | `figma-careers-site--couriers` on `<main>` when role is couriers |
| Tokens | `--figma-accent: #fede47`, hero `566px` @ 1366, illus `#f5f5f5` |
| Hero | Full-bleed; image ~44.4% + yellow copy ~55.6%; composite `RBCO_Yango_082-1.png`; CTA `303×63` `rx=9`; rounded junction on copy panel |
| Benefits | Template A; `orig-1` = coins/arrow on card 1 (not hero overlay); middle panel `#111111` |
| Unique | 5 columns at ≥1024px when section has 5 items; yellow band |
| Why join | `variant: courier` — horizontal 50/50 grey copy + yellow media rows |
| Steps | `figma-steps--couriers` — **yellow** full-width band, 3 grey cards (`#f5f5f5`, `rx≈18`) |
| Footer | `figma-careers-footer--couriers` — light `#f5f5f5`, dark logo |
| Floating | `FigmaFloatingActions` — scroll-top; WhatsApp when `floatingActions.whatsappUrl` is set |

## Form boundary (do not change)

- `LeadForm`, `FormField`, schema, submit API — unchanged
- Only wrapper: `FigmaFormSection` provides layout + `#form-{role}` anchor

## Breakpoints

- Mobile: ≤767px — stacked cards, full-width
- Tablet: 768–1023px — 2-column grids where applicable
- Desktop: ≥1024px — match Figma 1140px container

## Assets

Reuse `public/wp-assets/uploads/2026/02/*`, `public/icons/*`, `public/images/*`.

## Elementor panel ID maps (parse-role-page.ts)

Text panel colors are resolved from Elementor `data-id` attributes in synced HTML:

| Set | IDs | `panelVariant` |
|-----|-----|----------------|
| Black text panels | `545ce30f`, `00467b6`, `f726be4`, `41bb519f`, `44085d1`, `47b80a35`, `a68d1d7`, `c00ec80`, `14c27c1`, `a14168b`, `3153fab`, `6acf198`, `be741f6`, `6e735a8` | `black` |
| Grey text panels (couriers why-join) | `662cd53b`, `6e4879c2`, `7ad5410f`, `9a07a99`, `3c7020e`, `0256ad8` | `grey` |
| Default | — | `yellow` |

Reference CSS: [`src/styles/wp-isolation.css`](../src/styles/wp-isolation.css) lines ~1082–1196.
