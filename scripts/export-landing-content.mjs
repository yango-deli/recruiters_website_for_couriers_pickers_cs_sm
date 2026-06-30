#!/usr/bin/env node
/**
 * Regenerate src/content/landing/he/*.json from synced WP HTML (one-time / maintenance).
 * Primary source for production content is Figma HE frames; run after Figma copy updates.
 */
import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";

mkdirSync("src/content/landing/he", { recursive: true });

const script = `
import { loadRolePageContent } from './src/lib/wp/load-role-content.ts';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
const roles = ['couriers','pickers','support'];
mkdirSync('src/content/landing/he', { recursive: true });
for (const role of roles) {
  const content = loadRolePageContent(role, 'he');
  writeFileSync(join('src/content/landing/he', role + '.json'), JSON.stringify(content, null, 2));
  console.log('exported', role);
}
`;

execSync(`npx tsx -e ${JSON.stringify(script)}`, { stdio: "inherit", cwd: process.cwd() });
