import { WpElementorStyles } from "@/components/wp/WpElementorStyles";
import { WpPageBody } from "@/components/wp/WpPageBody";

type WpLegalPageProps = {
  html: string;
  locale: string;
  postId?: number | null;
};

/** Legal/promo pages — WP HTML with site chrome from layout. */
export function WpLegalPage({ html, locale, postId = null }: WpLegalPageProps) {
  return (
    <>
      <WpPageBody postId={postId} pageMode="role" />
      <WpElementorStyles postId={postId} locale={locale} />
      <div className="wp-page-shell wp-legal-page">
        <div className="wp-legal-content" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </>
  );
}
