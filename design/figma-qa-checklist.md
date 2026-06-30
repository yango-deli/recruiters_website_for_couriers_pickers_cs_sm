# Figma QA Checklist — HE landing (pixel-perfect)

**Scope:** Hebrew only · 3 roles · desktop 1366px + mobile 375px  
**Figma file:** `3E7R9IbEFyg2VZzl0siqnt` (Landing Page)

## Frames

| Role | Desktop node | Mobile node | Route |
|------|-------------|-------------|-------|
| Couriers | `2:25196` | `2:25980` | `/he/couriers` |
| Pickers | `2:23029` | `2:24213` | `/he/pickers` |
| Support | `2:28` | `2:3006` | `/he/support` |
| Hub | — | — | `/he` |

## Per-page sections (top → bottom)

- [ ] **Chrome** — lang bar, logo, role pills, apply CTA; couriers = dark chrome
- [ ] **Hero** — couriers full-bleed 44/56 split; pickers/support contained yellow 50/50
- [ ] **Benefits** — 3 cards, illus overlap, middle panel black (couriers)
- [ ] **Unique** — yellow band; 5 / 4 / 3 columns (couriers / pickers / support)
- [ ] **Why join** — courier horizontal rows vs standard grid
- [ ] **Steps** — 4 cards; couriers yellow band + grey cards
- [ ] **Form** — title, LeadForm embedded, 461px max-width, yellow submit
- [ ] **Footer** — black (light for couriers), CTA, legal links, logo

## Breakpoints

| Width | Check |
|-------|-------|
| 1366 | Desktop overlay vs Figma screenshot |
| 375 | Mobile frame layout (not stacked desktop) |
| 768–1023 | Tablet interpolation |

## States

- [ ] Chrome pill hover / active / focus-visible
- [ ] Primary CTA hover / focus
- [ ] Form validation errors
- [ ] Form submitting / disabled submit
- [ ] Success dialog after submit
- [ ] Scroll-top floating button

## Integrations (frozen)

- [ ] `GET /api/hiring-targets?role=`
- [ ] `POST /api/submit-lead` → Telegram + CRM
- [ ] Honeypot silent OK

## RTL (`/he/*`)

- [ ] Logical margins (`ms-*`, `text-start`)
- [ ] Hero copy alignment
- [ ] Grid direction

## Build

- [ ] `npm run build`
- [ ] `npm run lint`
