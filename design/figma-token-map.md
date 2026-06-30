# Figma → CSS token map

Sources: [Brand Overview](https://www.figma.com/design/2b8KFACkq68FfHewV9tbT5/Brand-Overview), [Landing Page](https://www.figma.com/design/3E7R9IbEFyg2VZzl0siqnt/Landing-Page?node-id=2-25196)

## Colors

| Figma / Brand | CSS variable | Value | Usage |
|---------------|--------------|-------|-------|
| Primary yellow | `--brand-accent` / `--figma-accent` | `#ffcc00` | CTAs, unique band, step card bottoms |
| Couriers yellow | `--figma-accent` (couriers scope) | `#fede47` | `.figma-careers-site--couriers` |
| Accent hover | `--brand-accent-dark` / `--figma-accent-hover` | `#e6b800` | Button hover |
| Black | `--brand-primary` / `--figma-black` | `#000000` | Text, chrome, footer |
| Section black | `--figma-section-black` | `#111111` | Steps band, benefit panels |
| Card illus grey | `--figma-card-illus-bg` | `#ececec` / `#f5f5f5` (couriers) | Benefit card tops |
| White | — | `#ffffff` | Page bg, step illus tops |
| Error red | — | `#c41230` | Form validation |

## Typography

| Role | Font | Weight | CSS |
|------|------|--------|-----|
| Headings | Yango Headline | 900 | `font-family: "Yango Headline"` |
| Body | Yango Text | 400–700 | `font-family: "Yango Text"` |
| Section title | Headline | 900 | `.figma-section-title` |
| Hero title | Headline | 900 | `.figma-hero__title` |
| Chrome pills | Text | 700 | `.figma-chrome-pill` |

Font files: `public/fonts/yango-text/`, `public/fonts/yango-headline/` (from brand pack).

## Layout

| Token | Value | Usage |
|-------|-------|-------|
| `--figma-container` | `71.25rem` (1140px) | `.figma-container` |
| `--figma-chrome-height` | `4.25rem` | Sticky header |
| `--figma-chrome-gap` | `3.125rem` | Main padding-top |
| `--figma-hero-height` | `clamp(300px, 36vw, 435px)` | Default hero |
| Couriers hero | `clamp(20rem, 41.4vw, 35.375rem)` | 566px @ 1366 |
| `--figma-card-radius` | `1.25rem` | Cards, bands |
| `--figma-card-overlap` | `-2.5rem` / `-3.75rem` couriers | Benefit card overlap |

## Components

| Figma component | React | Key classes |
|-----------------|-------|-------------|
| Header | `CareersChrome` | `.careers-chrome`, `.careers-site--couriers .careers-chrome` |
| Hero | `HeroSection` | `.careers-hero`, `.careers-hero--couriers` |
| Benefits | `BenefitsSection` | `.careers-benefit-card` |
| Unique | `UniqueSection` | `.careers-unique` (yellow band) |
| Why join | `WhyJoinSection` | `.careers-why-join--courier` / `--standard` |
| Steps | `StepsSection` | `.careers-steps__band` |
| Form | `FormSection` + `LeadForm` | `.careers-form-section .wp-lead-form*` |
| Footer | `CareersFooter` | `.careers-footer` |

## Buttons

| Variant | Class | Style |
|---------|-------|-------|
| Hero CTA | `.figma-btn-primary` | Black bg, white text, `rx≈9px` couriers |
| Footer apply | `.figma-careers-footer__cta` | Yellow pill |
| Form submit | `.wp-lead-form-submit` | Yellow pill, full width |

## Breakpoints

| Name | Width | Grids |
|------|-------|-------|
| Mobile | ≤767px | 1 column |
| Tablet | 768–1023px | 2–3 columns |
| Desktop | ≥1024px | 3–5 columns, 1140px container |
