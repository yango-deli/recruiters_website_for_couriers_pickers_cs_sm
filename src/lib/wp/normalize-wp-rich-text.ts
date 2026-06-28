/** Strip Yandex/LP constructor markup; return clean Elementor-style copy. */

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export function stripInlineHtml(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

export function sanitizeInlineHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\s+on\w+="[^"]*"/gi, "")
    .trim();
}

function wrapAsParagraph(inner: string): string {
  const trimmed = inner.trim();
  if (!trimmed) return "";
  if (/^<p[\s>]/i.test(trimmed)) return sanitizeInlineHtml(trimmed);
  if (/<(b|strong)[\s>]/i.test(trimmed)) {
    return sanitizeInlineHtml(`<p>${trimmed}</p>`);
  }
  return `<p><strong>${stripInlineHtml(trimmed)}</strong></p>`;
}

export function extractElementorWidgetInner(
  block: string,
  widgetNeedle: string
): string {
  const re = new RegExp(`<div[^>]*${widgetNeedle}[^>]*>`, "i");
  const match = re.exec(block);
  if (!match || match.index == null) return "";

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

export function normalizeWpRichText(raw: string): string {
  const input = raw.trim();
  if (!input) return "";

  if (input.includes("lc-styled-text") || input.includes("lc-text-block")) {
    const lcMatches = [
      ...input.matchAll(/lc-styled-text__text[^>]*>([\s\S]*?)<\/div>/gi),
    ];
    for (let i = lcMatches.length - 1; i >= 0; i -= 1) {
      const inner = lcMatches[i][1].trim();
      if (!inner || inner.includes("lc-borders")) continue;
      const plain = stripInlineHtml(inner);
      if (plain) return wrapAsParagraph(inner);
    }
  }

  const pMatch = input.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (pMatch) return sanitizeInlineHtml(pMatch[0]);

  const boldMatch = input.match(/<(b|strong)[^>]*>([\s\S]*?)<\/\1>/i);
  if (boldMatch) {
    return `<p><strong>${stripInlineHtml(boldMatch[2])}</strong></p>`;
  }

  const plain = stripInlineHtml(input);
  if (!plain || plain.length > 600) return "";
  return `<p><strong>${plain}</strong></p>`;
}

export function extractTextEditorHtml(block: string): string {
  const raw = extractElementorWidgetInner(block, "elementor-widget-text-editor");
  return normalizeWpRichText(raw);
}

export function extractTextEditorPlainText(block: string): string {
  return stripInlineHtml(extractTextEditorHtml(block));
}
