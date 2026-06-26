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

function extractStrongText(block) {
  const matches = [...block.matchAll(/<strong>([^<]+)<\/strong>/gi)];
  if (matches.length > 0) {
    return matches[matches.length - 1][1].trim();
  }
  const plain = block.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain.length > 0 && plain.length < 500 ? plain : null;
}

function escapeHtml(text) {
  const decoded = text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
  return decoded.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function sanitizeTextEditors(html) {
  return html.replace(
    /(<div class="elementor-element elementor-element-[a-f0-9]+ elementor-widget elementor-widget-text-editor"[^>]*>)[\s\S]*?(<\/div>\s*\n\t\t\t\t<\/div>)/g,
    (full, open, close) => {
      if (!full.includes("lc-styled-text") && !full.includes("lc-text-block")) {
        return full;
      }
      const text = extractStrongText(full);
      if (!text) return full;
      return `${open}<p><strong>${escapeHtml(text)}</strong></p>${close}`;
    }
  );
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
    console.log(`[sanitize] ${file}`);
  }
}

console.log("[sanitize] done");
