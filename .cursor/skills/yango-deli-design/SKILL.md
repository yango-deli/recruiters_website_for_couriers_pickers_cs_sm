---
name: yango-deli-design
description: >-
  Yango Deli project design orchestrator. Combines UI UX Pro Max (UUPM) design
  intelligence with Hallmark anti-slop rules. Use for any UI/UX/design work on
  this careers landing — redesign, audit, new sections, motion, tokens.
---

# Yango Deli Design Orchestrator

This project uses **two design skills** plus a locked brief.

## Skills in this repo

| Skill | Path | Role |
|-------|------|------|
| **UUPM** | `.cursor/skills/ui-ux-pro-max/` | Patterns, palettes, typography DB, UX checklist, `--design-system` search |
| **Hallmark** | `.cursor/skills/hallmark/` | Anti-AI-slop, macrostructures, slop-test gates, structural variety |
| **Brief** | `design/yango-deli-design.md` | Locked Yango brand tokens, macrostructure, archetypes |

## Workflow (always follow)

1. **Read** `design/yango-deli-design.md` — brand tokens and macrostructure are LOCKED.
2. **Run UUPM search** before major design changes:
   ```bash
   python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "<query>" --design-system -p "Yango Deli"
   ```
3. **Apply Hallmark** — run slop-test mentally; pick macrostructure from brief; no generic template.
4. **Preserve** — `src/messages/*.json`, i18n, forms, 4 roles, Yango fonts/assets.
5. **Override UUPM colors/fonts** when search returns generic palettes — always use Yango tokens from brief.

## Hallmark verbs

- Default build → follow `design/yango-deli-design.md`
- `hallmark audit <path>` → punch list only
- `hallmark redesign <target>` → visual layer only, keep copy/IA
- `hallmark study <url>` → extract DNA, don't clone pixels

## Stack context

- Next.js 16, Tailwind v4, shadcn/ui, Framer Motion, GSAP ScrollTrigger, Lenis
- Locales: `/he` (RTL), `/en`, `/ru`
- Motion reference: `chicago-current` patterns in `.reference/chicago-current/`

## Hard constraints

- Colors: follow `src/styles/tokens.css` — primary `#0e0e0e`, accent `#ffcd57`, warm `#fff9ed` / `#fff4d6` (do not swap in generic AI palettes)
- Icons: lucide-react + `public/icons/*` — no emoji
- No deleting routes/components without user confirmation
