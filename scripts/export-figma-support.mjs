#!/usr/bin/env node
/**
 * Export Support landing assets from Figma (desktop frame 2:28).
 * Usage: FIGMA_ACCESS_TOKEN=... node scripts/export-figma-support.mjs
 *        node scripts/export-figma-support.mjs --discover  (list child nodes)
 */
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public/careers/support");
const FILE_KEY = "3E7R9IbEFyg2VZzl0siqnt";
const FRAME_ID = "2:28";

function loadTokenFromEnvFile(path) {
  if (!existsSync(path)) return "";
  const line = readFileSync(path, "utf8")
    .split("\n")
    .find((l) => /^(FIGMA_API_KEY|FIGMA_ACCESS_TOKEN|FIGMA_TOKEN)=/.test(l));
  if (!line) return "";
  return line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
}

const TOKEN =
  process.env.FIGMA_ACCESS_TOKEN ||
  process.env.FIGMA_API_KEY ||
  process.env.FIGMA_TOKEN ||
  loadTokenFromEnvFile(join(homedir(), ".cursor", "figma.env")) ||
  loadTokenFromEnvFile(join(ROOT, ".env.local"));

/** Figma node IDs (desktop frame 2:28) */
const EXPORTS = [
  { file: "hero-photo.png", nodeId: "2:59", label: "hero photo" },
  { file: "benefits-section.png", nodeId: "2:67", label: "benefits" },
  { file: "why-join-section.png", nodeId: "2:505", label: "why join" },
  { file: "unique-band.png", nodeId: "2:657", label: "unique" },
  { file: "steps-section.png", nodeId: "2:693", label: "steps" },
  { file: "footer-logo.png", nodeId: "2:1023", label: "footer logo" },
];

async function figmaGet(path) {
  const res = await fetch(`https://api.figma.com/v1${path}`, {
    headers: { "X-Figma-Token": TOKEN },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.err || data.message || res.statusText);
  }
  return data;
}

function walk(node, depth = 0, lines = []) {
  if (!node) return lines;
  const pad = "  ".repeat(depth);
  lines.push(`${pad}${node.id}  ${node.name}  (${node.type})`);
  for (const child of node.children ?? []) {
    walk(child, depth + 1, lines);
  }
  return lines;
}

async function discover() {
  const data = await figmaGet(`/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(FRAME_ID)}`);
  const doc = data.nodes[FRAME_ID]?.document;
  if (!doc) {
    console.error("Frame not found:", FRAME_ID);
    process.exit(1);
  }
  console.log(`Frame ${FRAME_ID}: ${doc.name}\n`);
  for (const line of walk(doc)) console.log(line);
}

async function exportPng(nodeId, dest) {
  const { images } = await figmaGet(
    `/images/${FILE_KEY}?ids=${encodeURIComponent(nodeId)}&format=png&scale=2`
  );
  const url = images[nodeId];
  if (!url) throw new Error(`No image URL for ${nodeId}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${nodeId}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  let dims = "";
  try {
    dims = execSync(`file -b "${dest}"`, { encoding: "utf8" }).trim();
  } catch {
    /* optional */
  }
  console.log(`Wrote ${dest} (${buf.length} bytes)${dims ? ` — ${dims}` : ""}`);
}

async function main() {
  if (!TOKEN) {
    console.error("Set FIGMA_ACCESS_TOKEN or FIGMA_API_KEY");
    process.exit(1);
  }

  if (process.argv.includes("--discover")) {
    await discover();
    return;
  }

  await mkdir(OUT, { recursive: true });

  for (const item of EXPORTS) {
    try {
      await exportPng(item.nodeId, join(OUT, item.file));
    } catch (err) {
      console.error(`Failed ${item.label} (${item.nodeId}):`, err.message);
      console.error("Run: node scripts/export-figma-support.mjs --discover");
      process.exit(1);
    }
  }

  console.log("Done:", OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
