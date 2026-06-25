import { WpElementorStyles } from "@/components/wp/WpElementorStyles";
import { WpBodyInit } from "@/components/wp/WpBodyInit";
import { WpFormMounter } from "@/components/wp/WpFormMounter";
import { WpPageBody } from "@/components/wp/WpPageBody";
import { prepareCareersHtml } from "@/lib/wp/content";
import { getElementorPostId } from "@/lib/wp/manifest";
import type { Role } from "@/types/role";

export type WpPageMode = "role" | "hub" | "manager" | "support";

type WpCareersPageProps = {
  wpSlug: string;
  role?: Role;
  locale: string;
  pageMode?: WpPageMode;
};

export function WpCareersPage({
  wpSlug,
  role,
  locale,
  pageMode = "role",
}: WpCareersPageProps) {
  const html = prepareCareersHtml(wpSlug, role, locale);
  const postId = getElementorPostId(wpSlug);

  if (!html) {
    return (
      <div className="wp-page-shell p-8 text-center">
        <p>Page content not found. Run: npm run sync:wp</p>
      </div>
    );
  }

  return (
    <>
      <WpBodyInit postId={postId} pageMode={pageMode} locale={locale} />
      <WpPageBody postId={postId} pageMode={pageMode} />
      <WpElementorStyles postId={postId} locale={locale} />
      <div className="wp-page-shell">
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <WpFormMounter role={role} />
      </div>
    </>
  );
}
