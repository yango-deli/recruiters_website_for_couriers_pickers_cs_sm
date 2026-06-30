#!/usr/bin/env node
/**
 * Export mobile landing section PNGs from Figma (375px frames).
 * Nodes from design/figma-qa-checklist.md
 *
 * Usage: node scripts/export-figma-mobile.mjs [couriers|pickers|support|all]
 */
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const FILE_KEY = "3E7R9IbEFyg2VZzl0siqnt";

function loadToken() {
  for (const path of [
    join(homedir(), ".cursor", "figma.env"),
    join(ROOT, ".env.local"),
  ]) {
    if (!existsSync(path)) continue;
    const line = readFileSync(path, "utf8")
      .split("\n")
      .find((l) => /^(FIGMA_API_KEY|FIGMA_ACCESS_TOKEN|FIGMA_TOKEN)=/.test(l));
    if (line) return line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
  }
  return (
    process.env.FIGMA_ACCESS_TOKEN ||
    process.env.FIGMA_API_KEY ||
    process.env.FIGMA_TOKEN ||
    ""
  );
}

const TOKEN = loadToken();

/** @type {Record<string, { outDir: string; exports: { file: string; nodeId: string }[] }>} */
const ROLES = {
  couriers: {
    outDir: "public/careers/couriers",
    exports: [
      { file: "hero-mobile.png", nodeId: "2:25996" },
      { file: "benefits-section-mobile.png", nodeId: "2:26010" },
      { file: "unique-band-mobile.png", nodeId: "2:26234" },
      { file: "why-join-section-mobile.png", nodeId: "2:26298" },
      { file: "steps-section-mobile.png", nodeId: "2:26429" },
    ],
  },
  pickers: {
    outDir: "public/careers/pickers",
    exports: [
      { file: "hero-mobile.png", nodeId: "2:24229" },
      { file: "benefits-section-mobile.png", nodeId: "2:24243" },
      { file: "why-join-section-mobile.png", nodeId: "2:24754" },
      { file: "unique-band-mobile.png", nodeId: "2:24886" },
      { file: "steps-section-mobile.png", nodeId: "2:24924" },
    ],
  },
  support: {
    outDir: "public/careers/support",
    exports: [
      { file: "hero-mobile.png", nodeId: "2:3022" },
      { file: "benefits-section-mobile.png", nodeId: "2:3039" },
      { file: "why-join-section-mobile.png", nodeId: "2:3473" },
      { file: "unique-band-mobile.png", nodeId: "2:3623" },
      { file: "steps-section-mobile.png", nodeId: "2:3648" },
    ],
  },
};

async function figmaGet(path) {
  const res = await fetch(`https://api.figma.com/v1${path}`, {
    headers: { "X-Figma-Token": TOKEN },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.err || data.message || res.statusText);
  return data;
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
  console.log(`  ✓ ${dest} (${buf.length} bytes)`);
}

async function exportRole(role) {
  const cfg = ROLES[role];
  const out = join(ROOT, cfg.outDir);
  await mkdir(out, { recursive: true });
  console.log(`\n${role}:`);
  for (const item of cfg.exports) {
    await exportPng(item.nodeId, join(out, item.file));
  }
}

async function main() {
  if (!TOKEN) {
    console.error("Set FIGMA_ACCESS_TOKEN or add to ~/.cursor/figma.env");
    process.exit(1);
  }

  const arg = process.argv[2] ?? "all";
  const roles = arg === "all" ? Object.keys(ROLES) : [arg];
  for (const role of roles) {
    if (!ROLES[role]) {
      console.error(`Unknown role: ${role}`);
      process.exit(1);
    }
    await exportRole(role);
  }
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
