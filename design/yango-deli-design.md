# Yango Deli — Design DNA

> Locked design brief for this project. Combines **UI UX Pro Max (UUPM)** intelligence + **Hallmark** anti-slop rules.  
> Generated for: careers landing, grocery delivery hiring, scroll storytelling.

**Note:** Live color tokens are in [`src/styles/tokens.css`](../src/styles/tokens.css) (`#0e0e0e` + `#ffcd57` warm surfaces). Some values below reflect an earlier purple palette — use `tokens.css` for implementation, this doc for structure, motion, and archetypes.

**Official creatives:** [Yandex Disk](https://disk.yandex.com/d/13x6l2pIMjLRow) → see [`brand-assets.md`](brand-assets.md)

## Macrostructure

**Hallmark #14 Narrative Workflow** + **#f2 Sticky Scroll Stack**

- Each section = one "chapter" (Hero → Benefits → Why Join → How it works → Form → CTA)
- Scroll pins content while narrative advances (GSAP ScrollTrigger + Lenis)
- Section nav dots + top progress bar
- NOT generic: Hero → 3 cards → CTA → footer

## UUPM Pattern

| Field | Value |
|-------|-------|
| Pattern | Scroll-Triggered Storytelling |
| Style | Parallax Storytelling + Exaggerated Minimalism |
| Conversion | Mini-CTA per chapter + final form CTA |
| Motion | GSAP scrub on desktop, simple reveal on mobile |
| Framework | Next.js 16 + Tailwind v4 + Framer Motion + GSAP |

## Brand Tokens (LOCKED — do not replace with UUPM palette)

```css
--brand-primary: #060097;
--brand-secondary: #c10fff;
--brand-accent: #ffcd57;
--brand-background: #f9f6fe;
--brand-surface: #ffffff;
--brand-text: #060097;
--brand-muted: rgba(6, 0, 151, 0.62);
```

Section theme shifts (Yango-only tints):

| Section | Background tint |
|---------|-----------------|
| hero | `#f9f6fe` |
| benefits | `#f4f0ff` |
| features | `#f9f6fe` |
| steps | `#efe8ff` |
| form | `#f9f6fe` |
| cta | gradient `#060097 → #c10fff` |

## Typography (LOCKED)

- Display: **Yango Headline** (`font-heading`)
- Body: **Yango Text** (`font-sans`)
- Do NOT use Inter, Roboto, Outfit, Poppins, or system defaults for display
- Fluid scale: `--text-hero`, `--text-section`, `--text-body` (clamp)
- No italic headers (Hallmark gate 38a)

## Hallmark Slop Gates — hard fails for this project

- No purple/cyan AI gradients (brand gradient only)
- No emoji icons (lucide-react + brand SVG only)
- No 3-equal-column icon-above-heading template
- No nested cards
- No `transition-all` or `hover:scale-105` everywhere
- No invented metrics/testimonials
- No gradient text except brand `--gradient-text`
- No Inter/Roboto as display font

## Component archetypes (Hallmark)

| Zone | Archetype |
|------|-----------|
| Hero | h2 split-diptych + scroll indicator |
| Nav | n5 floating pill + role segment control |
| Benefits | f1 bento grid (asymmetric, not 3 equal) |
| Features | f2 sticky scroll stack / horizontal pin |
| Steps | s1 left-margin numbered timeline |
| Form | glass panel, no nested chrome |
| CTA | ft5 statement block + footer inline |
| Footer | ft2 inline rule single line |

## Motion

- Lenis `lerp: 0.09` synced with GSAP ticker
- Pinned sections: Benefits, Features (desktop), How it works
- `prefers-reduced-motion`: static layout, no pin, instant scroll
- Film grain overlay on `body::after` (subtle, 3% opacity)

## UUPM Pre-delivery checklist

- [ ] Lucide/SVG icons only
- [ ] `cursor-pointer` on all clickables
- [ ] Hover 150–300ms, specific properties only
- [ ] Contrast ≥ 4.5:1
- [ ] Focus-visible rings on interactive elements
- [ ] Responsive: 375, 768, 1024, 1440px
- [ ] RTL `/he` verified

## UUPM search command (re-run when redesigning)

```bash
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "grocery delivery careers" --design-system -p "Yango Deli"
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "parallax storytelling" --domain style
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "scroll animation" --domain ux
```

## Hallmark verbs for this project

- `hallmark audit src/components/sections` — score AI slop
- `hallmark redesign LandingPage` — new structure, keep copy/i18n
- `hallmark study https://chicago-current.vercel.app` — extract scroll DNA

## References

- [chicago-current](https://github.com/ryancalacsan/chicago-current) — Lenis + GSAP pinned narrative
- [UUPM](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — design system search
- [Hallmark](https://github.com/nutlope/hallmark) — anti-slop + macrostructures
