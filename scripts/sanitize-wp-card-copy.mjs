#!/usr/bin/env node
/**
 * Replace Yandex/LP constructor garbage inside Elementor text-editor widgets
 * with clean <p><strong>…</strong></p> copy.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HTML_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "content", "wp", "html");

const COPY_FIXES = [
  ["שירות לקוחות סופררר", "שירות לקוחות מצוין"],
  [
    "אם שירות זה בדם שלך, אנחנו מחפשים בדיוק אותך",
    "אוהבים לעזור לאנשים? בדיוק בשביל זה אנחנו מחפשים אתכם",
  ],
  [
    "If service is in your blood, we're looking for someone like you",
    "Love helping people? Join our customer service team",
  ],
  ["Top-tier customer service", "Excellent customer service"],
];

function extractElementorWidgetInner(block, widgetNeedle) {
  const re = new RegExp(`<div[^>]*${widgetNeedle}[^>]*>`, "i");
  const match = re.exec(block);
  if (!match) return "";

  const start = match.index + match[0].length;
  let depth = 1;
  let i = start;

  while (i < block.length && depth > 0) {
    const nextOpen = block.indexOf("<div", i);
    const nextClose = block.indexOf("</div>", i);
    if (nextClose === -1) break;

    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      i = nextOpen + 4;
    } else {
      depth -= 1;
      if (depth === 0) return block.slice(start, nextClose).trim();
      i = nextClose + 6;
    }
  }

  return block.slice(start).trim();
}

function extractCopyText(block) {
  if (block.includes("lc-styled-text") || block.includes("lc-text-block")) {
    const lcMatches = [...block.matchAll(/lc-styled-text__text[^>]*>([\s\S]*?)<\/div>/gi)];
    for (let i = lcMatches.length - 1; i >= 0; i -= 1) {
      const inner = lcMatches[i][1].trim();
      if (!inner || inner.includes("lc-borders")) continue;
      const bold = inner.match(/<(b|strong)[^>]*>([\s\S]*?)<\/\1>/i);
      if (bold) return bold[2].replace(/&nbsp;/g, " ").trim();
      const plain = inner.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      if (plain) return plain;
    }
  }

  const strongMatches = [...block.matchAll(/<strong>([^<]+)<\/strong>/gi)];
  if (strongMatches.length > 0) {
    return strongMatches[strongMatches.length - 1][1].trim();
  }

  const pMatch = block.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (pMatch) {
    const plain = pMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (plain) return plain;
  }

  const plain = block.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain.length > 0 && plain.length < 600 ? plain : null;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sanitizeTextEditors(html) {
  const widgetRe =
    /<div class="elementor-element elementor-element-[a-f0-9]+[^"]*elementor-widget-text-editor"[^>]*>/gi;

  let out = html;
  const replacements = [];
  let match;

  while ((match = widgetRe.exec(html)) !== null) {
    const widgetStart = match.index;
    const slice = html.slice(widgetStart);
    const inner = extractElementorWidgetInner(slice, "elementor-widget-text-editor");
    if (!inner.includes("lc-styled-text") && !inner.includes("lc-text-block")) {
      continue;
    }

    const text = extractCopyText(inner);
    if (!text) continue;

    let depth = 1;
    let i = widgetStart + match[0].length;
    while (i < html.length && depth > 0) {
      const nextOpen = html.indexOf("<div", i);
      const nextClose = html.indexOf("</div>", i);
      if (nextClose === -1) break;
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth += 1;
        i = nextOpen + 4;
      } else {
        depth -= 1;
        if (depth === 0) {
          replacements.push({
            start: widgetStart,
            end: nextClose + 6,
            replacement: `${match[0]}<p><strong>${escapeHtml(text)}</strong></p>`,
          });
          break;
        }
        i = nextClose + 6;
      }
    }
  }

  for (let i = replacements.length - 1; i >= 0; i -= 1) {
    const { start, end, replacement } = replacements[i];
    out = out.slice(0, start) + replacement + out.slice(end);
  }

  return out;
}

function fixBrokenEntities(html) {
  return html
    .replace(/(<strong>[^<]*?)&amp;quot;([^<]*?<\/strong>)/g, '$1"$2')
    .replace(/(<strong>[^<]*?)&quot;([^<]*?<\/strong>)/g, '$1"$2');
}

function trimHeadingWhitespace(html) {
  return html.replace(
    /(<h[1-6][^>]*class="elementor-heading-title[^"]*"[^>]*>)([\s\S]*?)(<\/h[1-6]>)/gi,
    (_, open, body, close) => `${open}${body.replace(/\s+/g, " ").trim()}${close}`
  );
}

function applyCopyFixes(html) {
  let out = html;
  for (const [from, to] of COPY_FIXES) {
    out = out.split(from).join(to);
  }
  return out;
}

const skip = new Set(["privacy-policy.html", "terms-of-use.html"]);
let changedFiles = 0;

for (const file of readdirSync(HTML_DIR).filter((f) => f.endsWith(".html") && !skip.has(f))) {
  const path = join(HTML_DIR, file);
  let html = readFileSync(path, "utf8");
  const before = html;
  html = sanitizeTextEditors(html);
  html = trimHeadingWhitespace(html);
  html = applyCopyFixes(html);
  html = fixBrokenEntities(html);
  if (html !== before) {
    writeFileSync(path, html);
    changedFiles += 1;
    console.log(`[sanitize] ${file}`);
  }
}

console.log(`[sanitize] done (${changedFiles} files updated)`);
