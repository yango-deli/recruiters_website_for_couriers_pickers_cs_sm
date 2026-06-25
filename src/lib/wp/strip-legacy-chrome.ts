/** Elementor role/lang nav replaced by WpSiteChrome — strip at HTML prep time (no FOUC). */
const WP_LEGACY_NAV_CONTAINER_IDS = [
  "3616595",
  "962bfd2",
  "dcfc0bb",
  "a811d4c",
  "f0722a9",
  "4a9b298",
  "208aa68",
  "1eba5b6",
] as const;

function findClosingDiv(html: string, openIdx: number): number {
  const tagRe = /<\/?div\b[^>]*>/gi;
  tagRe.lastIndex = openIdx;
  let depth = 0;
  let match: RegExpExecArray | null;

  while ((match = tagRe.exec(html)) !== null) {
    if (match[0].startsWith("</")) {
      depth -= 1;
      if (depth === 0) {
        return match.index + match[0].length;
      }
    } else {
      depth += 1;
    }
  }

  return -1;
}

function removeElementorContainerByDataId(html: string, dataId: string): string {
  const needle = `data-id="${dataId}"`;
  let searchFrom = 0;

  while (true) {
    const dataIdx = html.indexOf(needle, searchFrom);
    if (dataIdx === -1) {
      return html;
    }

    const divOpen = html.lastIndexOf("<div", dataIdx);
    if (divOpen === -1) {
      return html;
    }

    const endIdx = findClosingDiv(html, divOpen);
    if (endIdx === -1) {
      return html;
    }

    html = html.slice(0, divOpen) + html.slice(endIdx);
    searchFrom = divOpen;
  }
}

/** Hub careers pages: tab titles replaced by site chrome role links. */
function stripHubTabHeading(html: string): string {
  return html.replace(/<div class="e-n-tabs-heading"[\s\S]*?<\/div>\s*/g, "");
}

/** Remove inline Zoho widget scripts left in synced HTML. */
function stripInlineScripts(html: string): string {
  return html.replace(/<script[\s\S]*?<\/script>/gi, "");
}

export function stripWpLegacyChrome(html: string): string {
  let out = stripInlineScripts(html);

  for (const id of WP_LEGACY_NAV_CONTAINER_IDS) {
    out = removeElementorContainerByDataId(out, id);
  }

  out = stripHubTabHeading(out);

  return out.trim();
}
