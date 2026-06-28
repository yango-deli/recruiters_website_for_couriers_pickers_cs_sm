import { WpElementorStyles } from "@/components/wp/WpElementorStyles";
import { WpPageBody } from "@/components/wp/WpPageBody";
import { WpSiteChrome } from "@/components/wp/WpSiteChrome";

type WpLegalPageProps = {
  html: string;
  locale: string;
  postId?: number | null;
};

/** Legal/promo pages — WP HTML with legacy site chrome. */
export function WpLegalPage({ html, locale, postId = null }: WpLegalPageProps) {
  return (
    <>
      <WpPageBody postId={postId} pageMode="role" />
      <WpSiteChrome />
      <WpElementorStyles postId={postId} locale={locale} />
      <div className="wp-page-shell wp-legal-page">
        <div className="wp-legal-content" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </>
  );
}
