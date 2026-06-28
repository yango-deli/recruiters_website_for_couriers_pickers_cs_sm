import type { Role } from "@/types/role";
import { stripWpLegacyChrome } from "./strip-legacy-chrome";
import {
  extractTextEditorHtml,
  extractTextEditorPlainText,
  sanitizeInlineHtml,
  stripInlineHtml,
} from "./normalize-wp-rich-text";

export type WpHeroContent = {
  titleHtml: string;
  subtitle: string;
  cta: string;
  image: string;
};

export type WpCardItem = {
  title: string;
  descriptionHtml: string;
  image?: string;
  icon?: string;
  /** Benefit / why-join text panel color from Elementor */
  panelVariant?: "yellow" | "black" | "grey";
  /** Why-join courier rows: image panel before text panel in DOM */
  imageFirst?: boolean;
};

export type WpRegistrationStep = {
  number: string;
  textHtml: string;
  image: string;
};

export type WpLandingSection =
  | {
      type: "benefits";
      title: string;
      items: WpCardItem[];
    }
  | {
      type: "unique";
      title: string;
      items: WpCardItem[];
    }
  | {
      type: "whyJoin";
      title: string;
      variant: "courier" | "standard";
      items: WpCardItem[];
    }
  | {
      type: "registration";
      title: string;
      subtitle: string;
      steps: WpRegistrationStep[];
    }
  | {
      type: "form";
      title: string;
    };

export type WpRolePageContent = {
  hero: WpHeroContent;
  sections: WpLandingSection[];
};

function firstMatch(html: string, pattern: RegExp): string | null {
  const match = pattern.exec(html);
  return match?.[1] ?? null;
}

function allMatches(html: string, pattern: RegExp): RegExpExecArray[] {
  const results: RegExpExecArray[] = [];
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const re = new RegExp(pattern.source, flags);
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    results.push(match);
  }
  return results;
}

function extractImgSrc(block: string): string | undefined {
  const src = firstMatch(block, /src="([^"]+)"/);
  return src ?? undefined;
}

function removeFooterAndScripts(html: string): string {
  let out = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  const footerIdx = out.indexOf("Yango Deli Israel Ltd");
  if (footerIdx > 0) {
    out = out.slice(0, footerIdx);
  }
  return out;
}

function parseHero(html: string, _role: Role): { hero: WpHeroContent; rest: string } {
  const h1Match = html.match(
    /<h1 class="elementor-heading-title[^"]*">([\s\S]*?)<\/h1>/i
  );
  if (!h1Match) {
    throw new Error("WP role page: hero h1 not found");
  }

  const heroStart = h1Match.index ?? 0;
  const h1End = heroStart + h1Match[0].length;
  const afterH1 = html.slice(h1End);

  const h2Match = afterH1.match(
    /<h2 class="elementor-heading-title[^"]*">([\s\S]*?)<\/h2>/i
  );
  const subtitle = h2Match ? stripInlineHtml(h2Match[1]) : "";

  const heroChunkEnd = h1End + (h2Match?.[0].length ?? 0);
  const heroChunk = html.slice(heroStart, heroChunkEnd + 2000);
  const cta =
    stripInlineHtml(
      firstMatch(heroChunk, /<span class="elementor-button-text">([\s\S]*?)<\/span>/i) ??
        "להגשת מועמדות"
    ) || "להגשת מועמדות";

  const heroImageBlock = html.slice(heroStart);
  const heroImageMatch = heroImageBlock.match(
    /elementor-widget-image[\s\S]{0,1200}?src="([^"]+)"/i
  );
  const image =
    heroImageMatch?.[1] ?? "/wp-assets/uploads/2026/02/RBCO_Yango_082-1.png";

  const restMatch = html.slice(h1End).match(
    /<div class="elementor-element[^"]* e-con-full e-flex e-con e-parent"[\s\S]*?<h2 class="elementor-heading-title elementor-size-default">/i
  );
  const rest = restMatch?.index != null ? html.slice(h1End + restMatch.index) : html.slice(h1End);

  return {
    hero: {
      titleHtml: sanitizeInlineHtml(h1Match[1].trim()),
      subtitle,
      cta,
      image,
    },
    rest,
  };
}

function extractElementorDataId(block: string): string | null {
  return firstMatch(block, /data-id="([a-f0-9]+)"/i);
}

/** Elementor text-panel IDs → panel color (from wp-isolation.css) */
const BLACK_TEXT_PANEL_IDS = new Set([
  "545ce30f", "00467b6", "f726be4", "41bb519f", "44085d1",
  "47b80a35", "a68d1d7", "c00ec80", "14c27c1", "a14168b", "3153fab",
  "6acf198", "be741f6", "6e735a8", "f5afbaa",
]);

const GREY_TEXT_PANEL_IDS = new Set([
  "662cd53b", "6e4879c2", "7ad5410f", "9a07a99", "3c7020e", "0256ad8",
]);

function panelVariantFromBlock(block: string): "yellow" | "black" | "grey" {
  const id = extractElementorDataId(block);
  if (id && BLACK_TEXT_PANEL_IDS.has(id)) return "black";
  if (id && GREY_TEXT_PANEL_IDS.has(id)) return "grey";
  return "yellow";
}

const CLASSIC_BG_SPLIT =
  /(?=<div class="elementor-element elementor-element-[a-f0-9]+ e-con-full e-flex e-con e-child"[^>]*(?:data-has-classic-bg="1"|data-settings="[^"]*background_background[^"]*classic))/i;

function parseBenefitCards(block: string, _role: Role): WpCardItem[] {
  const cards: WpCardItem[] = [];
  const chunks = block.split(CLASSIC_BG_SPLIT);

  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    const hasImage = chunk.includes("elementor-widget-image");
    const hasText = chunk.includes("elementor-widget-text-editor");

    if (hasImage && !hasText) {
      const next = chunks[i + 1];
      if (!next?.includes("elementor-widget-text-editor")) continue;

      const title = stripInlineHtml(
        firstMatch(
          next,
          /<h2 class="elementor-heading-title[^"]*">([\s\S]*?)<\/h2>/i
        ) ?? ""
      );
      if (!title || /^\d{2}$/.test(title)) continue;

      const descriptionHtml = extractTextEditorHtml(next);
      const image = extractImgSrc(chunk);
      cards.push({
        title,
        descriptionHtml,
        image,
        panelVariant: panelVariantFromBlock(next),
      });
      continue;
    }

    if (hasImage && hasText) {
      const headings = allMatches(
        chunk,
        /<h2 class="elementor-heading-title[^"]*">([\s\S]*?)<\/h2>/gi
      );
      if (headings.length !== 1) continue;

      const title = stripInlineHtml(headings[0][1]);
      if (!title || /^\d{2}$/.test(title)) continue;

      const descriptionHtml = extractTextEditorHtml(chunk);
      cards.push({
        title,
        descriptionHtml,
        image: extractImgSrc(chunk),
        panelVariant: panelVariantFromBlock(chunk),
      });
    }
  }

  return cards;
}

function parseImageBoxes(block: string): WpCardItem[] {
  const items: WpCardItem[] = [];
  const boxPattern =
    /<div class="elementor-image-box-wrapper">([\s\S]*?)<\/div>\s*<\/div>/gi;

  for (const match of allMatches(block, boxPattern)) {
    const chunk = match[1];
    const icon = extractImgSrc(chunk);
    const title = stripInlineHtml(
      firstMatch(chunk, /<h3 class="elementor-image-box-title">([\s\S]*?)<\/h3>/i) ?? ""
    );
    const descriptionHtml = sanitizeInlineHtml(
      firstMatch(
        chunk,
        /<p class="elementor-image-box-description">([\s\S]*?)<\/p>/i
      ) ?? ""
    );
    if (title) {
      items.push({ title, descriptionHtml, icon });
    }
  }

  return items;
}

const SECTION_TITLE_NOISE =
  /למה שווה|מה מצפה|ההחלטה|מה יש לנו|נרשמים|רוצים להתחיל|Why join|Why it's worth|What awaits|What we have|Sign up|Want to start|Почему|Что вас|Что у нас|Регистра/i;

function isWhyJoinCardTitle(title: string): boolean {
  if (!title || /^\d{2}$/.test(title)) return false;
  return !SECTION_TITLE_NOISE.test(title);
}

function parseWhyJoinTextPanel(chunk: string): Pick<
  WpCardItem,
  "title" | "descriptionHtml" | "panelVariant"
> | null {
  if (!chunk.includes("elementor-widget-text-editor")) return null;

  const title = stripInlineHtml(
    firstMatch(chunk, /<h2 class="elementor-heading-title[^"]*">([\s\S]*?)<\/h2>/i) ?? ""
  );
  if (!isWhyJoinCardTitle(title)) return null;

  const descriptionHtml = extractTextEditorHtml(chunk);

  return {
    title,
    descriptionHtml,
    panelVariant: panelVariantFromBlock(chunk),
  };
}

function parseWhyJoinCards(block: string, variant: "courier" | "standard"): WpCardItem[] {
  const items: WpCardItem[] = [];
  const chunks = block.split(CLASSIC_BG_SPLIT);

  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    const hasImage = chunk.includes("elementor-widget-image");
    const hasText = chunk.includes("elementor-widget-text-editor");
    const imageIdx = chunk.indexOf("elementor-widget-image");
    const textIdx = chunk.indexOf("elementor-widget-text-editor");

    if (hasText && !hasImage) {
      const textPanel = parseWhyJoinTextPanel(chunk);
      if (!textPanel) continue;

      const next = chunks[i + 1];
      const image = next?.includes("elementor-widget-image")
        ? extractImgSrc(next)
        : undefined;

      items.push({
        ...textPanel,
        image,
        imageFirst: false,
      });
      continue;
    }

    if (hasImage && !hasText) {
      const prev = chunks[i - 1];
      if (prev?.includes("elementor-widget-text-editor")) continue;

      const next = chunks[i + 1];
      const textPanel = next ? parseWhyJoinTextPanel(next) : null;
      if (!textPanel) continue;

      items.push({
        ...textPanel,
        image: extractImgSrc(chunk),
        imageFirst: true,
      });
      i += 1;
      continue;
    }

    if (hasImage && hasText) {
      const textPanel = parseWhyJoinTextPanel(chunk);
      if (!textPanel) continue;

      items.push({
        ...textPanel,
        image: extractImgSrc(chunk),
        imageFirst: textIdx >= 0 && imageIdx >= 0 && imageIdx < textIdx,
      });
    }
  }

  if (variant === "standard" && items.length === 0) {
    for (const wrapper of extractWhyJoinColumnWrappers(block)) {
      const textMatch = wrapper.match(
        /<div class="elementor-element elementor-element-[a-f0-9]+ e-con-full e-flex e-con e-child"[^>]*>([\s\S]*?)<\/div>\s*<div class="elementor-element elementor-element-[a-f0-9]+ e-con-full e-flex e-con e-child"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i
      );
      if (!textMatch) continue;

      const textPanel = parseWhyJoinTextPanel(textMatch[1]);
      if (!textPanel) continue;

      items.push({
        ...textPanel,
        image: extractImgSrc(textMatch[2]),
        imageFirst: false,
      });
    }
  }

  return items.slice(0, 3);
}

function extractWhyJoinColumnWrappers(block: string): string[] {
  const wrappers: string[] = [];
  const pattern =
    /<div class="elementor-element elementor-element-[a-f0-9]+ e-con-full e-flex e-con e-child"[^>]*data-settings="[^"]*background_background[^"]*classic"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;

  for (const match of allMatches(block, pattern)) {
    const inner = match[0];
    const panelCount = (
      inner.match(
        /elementor-element-[a-f0-9]+ e-con-full e-flex e-con e-child"[^>]*data-settings="[^"]*background_background/gi
      ) ?? []
    ).length;
    if (panelCount >= 2) {
      wrappers.push(inner);
    }
  }

  return wrappers;
}

function parseRegistrationSteps(block: string): {
  subtitle: string;
  steps: WpRegistrationStep[];
} {
  const formIdx = block.indexOf('id="form"');
  const regBlock = formIdx > 0 ? block.slice(0, formIdx) : block;

  const firstStepIdx = regBlock.search(
    /<h2 class="elementor-heading-title[^"]*">\d{2}<\/h2>/i
  );
  const introBlock = firstStepIdx > 0 ? regBlock.slice(0, firstStepIdx) : regBlock;
  const subtitle = extractTextEditorPlainText(introBlock);

  const steps: WpRegistrationStep[] = [];
  const numberMatches = allMatches(
    regBlock,
    /<h2 class="elementor-heading-title[^"]*">(\d{2})<\/h2>/gi
  );

  for (let i = 0; i < numberMatches.length; i += 1) {
    const number = stripInlineHtml(numberMatches[i][1]);
    if (!/^\d{2}$/.test(number)) continue;

    const start = numberMatches[i].index ?? 0;
    const end =
      i + 1 < numberMatches.length
        ? (numberMatches[i + 1].index ?? regBlock.length)
        : regBlock.length;
    const chunk = regBlock.slice(start, end);

    let textHtml = extractTextEditorHtml(chunk);
    if (!textHtml) {
      textHtml = sanitizeInlineHtml(
        stripInlineHtml(chunk).replace(new RegExp(`^${number}\\s*`), "")
      );
    }

    const image =
      extractImgSrc(chunk) ?? "/wp-assets/uploads/2026/02/orig-6.png";

    steps.push({ number, textHtml, image });
  }

  steps.sort((a, b) => a.number.localeCompare(b.number));

  return { subtitle, steps };
}

function normalizeElementorSettings(html: string): string {
  return html
    .replace(
      /data-settings="\{&quot;background_background&quot;:&quot;classic&quot;\}"/gi,
      ' data-has-classic-bg="1"'
    )
    .replace(
      /data-settings="\{"background_background":"classic"\}"/gi,
      ' data-has-classic-bg="1"'
    );
}

const BENEFIT_SECTION_TITLE =
  /^מה מצפה|^ההחלטה|^What awaits|^Your choice|^Your decision|^Что вас|^Ваш выбор|^Что ожидает/i;

const WHY_JOIN_SECTION_TITLE =
  /^למה שווה|^Why join|^Why Join|Here'?s Why|^Почему/i;

const UNIQUE_SECTION_TITLE =
  /^מה יש לנו|^What we have|^What sets us apart|^Что отличает|^Что у нас|^Что есть у нас/i;

const REGISTRATION_SECTION_TITLE =
  /^נרשמים|^Sign up|^Simply sign up|^Sign up and get started|^Регистра|^Регистрируйтесь/i;

function normalizeSectionTitle(title: string): string {
  const text = stripInlineHtml(title).replace(/\s+/g, " ").trim();

  const whyJoinLead = text.match(/^\?\s*(Why Join Us)\s+(Here'?s Why)$/i);
  if (whyJoinLead) {
    return `${whyJoinLead[1]}? ${whyJoinLead[2]}`;
  }

  const whyJoinPlain = text.match(/^(Why Join Us)\s+(Here'?s Why)$/i);
  if (whyJoinPlain) {
    return `${whyJoinPlain[1]}? ${whyJoinPlain[2]}`;
  }

  return text.replace(/^\?\s*/, "").replace(/^[?!.\s]+/, "").trim();
}

const FORM_SECTION_TITLE =
  /^רוצים להתחיל|^Want to start|^Apply and start|^Ready to get started|^Хотите начать|^Подайте заявку|^Начн/i;

function classifySection(title: string, block: string): WpLandingSection["type"] {
  const normalized = normalizeSectionTitle(title);

  if (FORM_SECTION_TITLE.test(normalized)) {
    return "form";
  }
  if (REGISTRATION_SECTION_TITLE.test(normalized)) {
    return "registration";
  }
  if (UNIQUE_SECTION_TITLE.test(normalized)) {
    return "unique";
  }
  if (WHY_JOIN_SECTION_TITLE.test(normalized)) {
    return "whyJoin";
  }
  if (BENEFIT_SECTION_TITLE.test(normalized)) {
    return "benefits";
  }
  if (block.includes("elementor-image-box-wrapper")) {
    return "unique";
  }
  if (allMatches(block, /<h2 class="elementor-heading-title[^"]*">\d{2}<\/h2>/gi).length >= 2) {
    return "registration";
  }
  return "benefits";
}

function splitParentBlocks(html: string): string[] {
  return html
    .split(
      /(?=<div class="elementor-element[^"]*(?:e-con-full e-flex e-con e-parent|e-flex e-con-boxed e-con e-parent))/
    )
    .filter((chunk) => chunk.trim().length > 0);
}

function isTitleOnlyBlock(chunk: string): boolean {
  return (
    chunk.includes("elementor-heading-title") &&
    !chunk.includes("elementor-widget-image") &&
    !chunk.includes("elementor-image-box") &&
    !chunk.includes("elementor-widget-html") &&
    !/>\d{2}</.test(chunk)
  );
}

function mergeParentBlocks(chunks: string[]): string[] {
  const merged: string[] = [];

  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    if (isTitleOnlyBlock(chunk) && i + 1 < chunks.length) {
      merged.push(chunk + chunks[i + 1]);
      i += 1;
    } else {
      merged.push(chunk);
    }
  }

  return merged;
}

function isMajorSectionTitle(title: string): boolean {
  const normalized = normalizeSectionTitle(title);
  return (
    BENEFIT_SECTION_TITLE.test(normalized) ||
    WHY_JOIN_SECTION_TITLE.test(normalized) ||
    UNIQUE_SECTION_TITLE.test(normalized) ||
    REGISTRATION_SECTION_TITLE.test(normalized) ||
    FORM_SECTION_TITLE.test(normalized)
  );
}

function splitBySectionTitles(html: string): { title: string; block: string }[] {
  const re =
    /<h2 class="elementor-heading-title elementor-size-default">([\s\S]*?)<\/h2>/gi;
  const hits: { title: string; start: number }[] = [];

  for (const match of allMatches(html, re)) {
    const title = normalizeSectionTitle(match[1]);
    if (/^\d{2}$/.test(title)) continue;
    if (!isMajorSectionTitle(title)) continue;
    if (match.index == null) continue;
    hits.push({ title, start: match.index });
  }

  return hits.map((hit, index) => ({
    title: hit.title,
    block: html.slice(hit.start, hits[index + 1]?.start ?? html.length),
  }));
}

function buildSectionFromBlock(
  title: string,
  chunk: string,
  role: Role
): WpLandingSection | null {
  const normalizedTitle = normalizeSectionTitle(title);
  const type = classifySection(normalizedTitle, chunk);

  if (type === "form") {
    return { type: "form", title: normalizedTitle };
  }

  if (type === "registration") {
    const formIdx = chunk.indexOf('id="form"');
    const regBlock = formIdx > 0 ? chunk.slice(0, formIdx) : chunk;
    const { subtitle, steps } = parseRegistrationSteps(regBlock);
    if (steps.length > 0) {
      return { type: "registration", title: normalizedTitle, subtitle, steps };
    }
    return null;
  }

  if (type === "unique") {
    const items = parseImageBoxes(chunk);
    if (items.length > 0) {
      return { type: "unique", title: normalizedTitle, items };
    }
    return null;
  }

  if (type === "whyJoin") {
    const variant = role === "couriers" ? "courier" : "standard";
    const items = parseWhyJoinCards(chunk, variant);
    if (items.length > 0) {
      return { type: "whyJoin", title: normalizedTitle, variant, items };
    }
    return null;
  }

  const items = parseBenefitCards(chunk, role);
  if (items.length > 0) {
    return { type: "benefits", title: normalizedTitle, items };
  }

  return null;
}

function extractFormSectionFromBlock(block: string): WpLandingSection | null {
  const formIdx = block.indexOf('id="form"');
  if (formIdx < 0) return null;

  const formBlock = block.slice(formIdx);
  const rawTitle = firstMatch(
    formBlock,
    /<h2 class="elementor-heading-title[^"]*">([\s\S]*?)<\/h2>/i
  );
  if (!rawTitle) return null;

  const title = normalizeSectionTitle(rawTitle);
  if (!title) return null;

  return { type: "form", title };
}

function parseSections(html: string, role: Role): WpLandingSection[] {
  const sections: WpLandingSection[] = [];

  for (const { title, block } of splitBySectionTitles(html)) {
    const section = buildSectionFromBlock(title, block, role);
    if (section) sections.push(section);

    if (section?.type === "registration") {
      const formSection = extractFormSectionFromBlock(block);
      if (formSection) sections.push(formSection);
    }
  }

  if (sections.length > 0) {
    return dedupeSections(sections);
  }

  const parentChunks = mergeParentBlocks(splitParentBlocks(html));

  for (const chunk of parentChunks) {
    if (!chunk.includes("elementor-heading-title")) continue;
    if (chunk.includes('id="form"') && chunk.includes("elementor-widget-html")) {
      const title = stripInlineHtml(
        firstMatch(
          chunk,
          /<h2 class="elementor-heading-title elementor-size-default">([\s\S]*?)<\/h2>/i
        ) ?? ""
      );
      sections.push({ type: "form", title: title || "Form" });
      continue;
    }

    const title = stripInlineHtml(
      firstMatch(
        chunk,
        /<h2 class="elementor-heading-title elementor-size-default">([\s\S]*?)<\/h2>/i
      ) ?? ""
    );
    if (!title || /^\d{2}$/.test(title)) continue;

    const section = buildSectionFromBlock(title, chunk, role);
    if (section) sections.push(section);
  }

  return dedupeSections(sections);
}

function dedupeSections(sections: WpLandingSection[]): WpLandingSection[] {
  const seen = new Set<string>();
  const out: WpLandingSection[] = [];

  for (const section of sections) {
    const key = `${section.type}:${section.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(section);
  }

  return out;
}

export function extractManagerTabHtml(html: string): string {
  const markers = [
    'id="e-n-tab-content-1644713494"',
    "elementor-element-ff28f6d",
    "Untitled1/formperma",
  ];

  for (const marker of markers) {
    const idx = html.indexOf(marker);
    if (idx === -1) continue;

    const tabStart = html.lastIndexOf('<div id="e-n-tab-content', idx);
    const nextTab = html.indexOf('<div id="e-n-tab-content', idx + marker.length);
    if (tabStart >= 0) {
      return html.slice(tabStart, nextTab > tabStart ? nextTab : undefined);
    }

    return html.slice(idx);
  }

  return html;
}

export function parseWpRolePage(html: string, role: Role): WpRolePageContent {
  const cleaned = normalizeElementorSettings(
    removeFooterAndScripts(stripWpLegacyChrome(html))
  );
  const { hero, rest } = parseHero(cleaned, role);
  const sections = parseSections(rest, role);

  if (!sections.some((s) => s.type === "form")) {
    const formFromBlock = extractFormSectionFromBlock(cleaned);
    if (formFromBlock) {
      sections.push(formFromBlock);
    } else {
      const formTitle =
        normalizeSectionTitle(
          firstMatch(
            cleaned,
            /id="form"[\s\S]*?<h2 class="elementor-heading-title[^"]*">([\s\S]*?)<\/h2>/i
          ) ??
            firstMatch(
              cleaned,
              /<h2 class="elementor-heading-title[^"]*">(Ready to get started[\s\S]*?)<\/h2>/i
            ) ??
            firstMatch(
              cleaned,
              /<h2 class="elementor-heading-title[^"]*">(Apply and start[\s\S]*?)<\/h2>/i
            ) ??
            firstMatch(
              cleaned,
              /<h2 class="elementor-heading-title[^"]*">(Want to start[\s\S]*?)<\/h2>/i
            ) ??
            firstMatch(
              cleaned,
              /<h2 class="elementor-heading-title[^"]*">(רוצים[\s\S]*?)<\/h2>/i
            ) ??
            "Apply and start earning"
        ) || "Apply and start earning";
      sections.push({ type: "form", title: formTitle });
    }
  }

  return { hero, sections };
}
