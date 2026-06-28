/**
 * Validates parsed WP HTML content for all role × locale combinations.
 * Run: npx tsx scripts/validate-wp-content.ts
 */
import { loadRolePageContent } from "../src/lib/wp/load-role-content";
import type { Role } from "../src/types/role";

const ROLES: Role[] = ["couriers", "pickers", "support", "manager"];
const LOCALES = ["he", "en", "ru"] as const;

let failed = 0;

for (const locale of LOCALES) {
  for (const role of ROLES) {
    const label = `${role}/${locale}`;

    try {
      const content = loadRolePageContent(role, locale);

      if (!content.hero.titleHtml.trim()) {
        console.error(`[FAIL] ${label}: missing hero title`);
        failed += 1;
        continue;
      }

      const benefits = content.sections.find((s) => s.type === "benefits");
      if (!benefits || benefits.items.length < 3) {
        console.error(
          `[FAIL] ${label}: expected ≥3 benefit cards, got ${benefits?.items.length ?? 0}`
        );
        failed += 1;
        continue;
      }

      const whyJoin = content.sections.find((s) => s.type === "whyJoin");
      if (!whyJoin || whyJoin.items.length < 3) {
        console.error(
          `[FAIL] ${label}: expected ≥3 whyJoin items, got ${whyJoin?.items.length ?? 0}`
        );
        failed += 1;
        continue;
      }

      const registration = content.sections.find((s) => s.type === "registration");
      if (!registration || registration.steps.length < 4) {
        console.error(
          `[FAIL] ${label}: expected 4 registration steps, got ${registration?.steps.length ?? 0}`
        );
        failed += 1;
        continue;
      }

      const form = content.sections.find((s) => s.type === "form");
      if (!form?.title.trim()) {
        console.error(`[FAIL] ${label}: missing form title`);
        failed += 1;
        continue;
      }

      if (role !== "manager") {
        const unique = content.sections.find((s) => s.type === "unique");
        if (!unique || unique.items.length < 3) {
          console.error(
            `[FAIL] ${label}: expected ≥3 unique items, got ${unique?.items.length ?? 0}`
          );
          failed += 1;
          continue;
        }
      }

      let copyFailed = false;
      for (const section of content.sections) {
        if (section.type === "benefits" || section.type === "whyJoin" || section.type === "unique") {
          for (const item of section.items) {
            const plain = item.descriptionHtml.replace(/<[^>]+>/g, "").trim();
            if (!plain) {
              console.error(`[FAIL] ${label}: empty copy in ${section.type} "${item.title}"`);
              copyFailed = true;
            }
            if (
              item.descriptionHtml.includes("lc-styled-text") ||
              item.descriptionHtml.includes("lc-text-block")
            ) {
              console.error(
                `[FAIL] ${label}: LP garbage in ${section.type} "${item.title}"`
              );
              copyFailed = true;
            }
          }
        }
        if (section.type === "registration") {
          for (const step of section.steps) {
            const plain = step.textHtml.replace(/<[^>]+>/g, "").trim();
            if (!plain) {
              console.error(`[FAIL] ${label}: empty registration step ${step.number}`);
              copyFailed = true;
            }
            if (
              step.textHtml.includes("lc-styled-text") ||
              step.textHtml.includes("lc-text-block")
            ) {
              console.error(`[FAIL] ${label}: LP garbage in step ${step.number}`);
              copyFailed = true;
            }
          }
        }
      }

      if (copyFailed) {
        failed += 1;
        continue;
      }

      console.log(`[OK] ${label}`);
    } catch (error) {
      console.error(`[FAIL] ${label}:`, error instanceof Error ? error.message : error);
      failed += 1;
    }
  }
}

if (failed > 0) {
  console.error(`\n${failed} validation(s) failed.`);
  process.exit(1);
}

console.log("\nAll WP content validations passed.");
