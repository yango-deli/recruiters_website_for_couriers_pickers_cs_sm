# Yango Deli — Brand Assets

**Source:** [Yandex Disk — Yango Deli_Logo_font_presentation](https://disk.yandex.com/d/13x6l2pIMjLRow)

Local mirror: `public/brand/` (sync via `scripts/sync-brand-from-yadisk.py`)

## Folders

| Folder | Contents | Use on site |
|--------|----------|-------------|
| `Basic Guidlines.pdf` | Official brand guidelines | Reference for colors, logo usage |
| `Fonts/` | Yango Text + Yango Headline (all weights) | `public/fonts/` |
| `Yango_Deli_Logo/` | Logotype SVG/PNG/EPS (1 row, 2 rows, black/white, yellow button) | `public/logos/official/` |
| `Illustration/` | Brand illustrations (white bg set) | Section decor, hero accents |
| `first_screen/` | First screen creatives (`without_RTE.png`) | Hero reference layout |
| `3d_bag/` | 3D delivery bag renders | Hero / Features imagery |
| `Yango_Deli_Photos/` | Photo shoots (PSD + exports) | Lifestyle hero, team photos |
| `Avatars/` | Character avatars | Optional UI accents |
| `Presentation/` | Brand deck | Reference only |

## Wired into site

| Asset | Path |
|-------|------|
| Logotype black SVG | `/logos/official/logotype-black.svg` |
| Logotype white SVG | `/logos/official/logotype-white.svg` |
| Yellow button logo | `/logos/official/logo-yellow-button.png` |
| Font files (web) | `/fonts/yango-text/`, `/fonts/yango-headline/` — run `bash scripts/copy-brand-fonts.sh` after brand sync |
| 3D bag render | `/images/brand/bag-3d.png` |
| Icons (careers) | `/icons/*.svg` (from WP, still valid) |

## Logo usage rules (from brand pack)

- Use **1 Row** logotype in header on light backgrounds (black variant)
- Use **White** variant on dark/gradient sections (CTA)
- Do not stretch, rotate, or recolor the logotype
- Minimum clear space per `Basic Guidlines.pdf`

## Re-sync from Yandex Disk

Large folders (`Yango_Deli_Photos/`, `Presentation/`, `Avatars/`, `*.psd`) are **not in git** (GitHub 100MB/file limit). Inventory of local files: `public/brand/local-assets-manifest.json`.

```bash
python3 scripts/sync-brand-from-yadisk.py
```
