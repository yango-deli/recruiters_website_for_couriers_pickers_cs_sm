#!/usr/bin/env bash
# Copy Yango fonts from brand pack into public/fonts (used by tokens.css @font-face).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$ROOT/public/fonts/yango-text" "$ROOT/public/fonts/yango-headline"
cp "$ROOT/public/brand/Fonts/Yango_Text/"*.ttf "$ROOT/public/fonts/yango-text/"
cp "$ROOT/public/brand/Fonts/Yango Headline/"*.ttf "$ROOT/public/fonts/yango-headline/"
echo "Fonts copied to public/fonts/"
