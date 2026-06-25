import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WpElementorStyles } from "@/components/wp/WpElementorStyles";

type LegalPageLayoutProps = {
  title: string;
  children: React.ReactNode;
  elementorPostId?: number | null;
};

export function LegalPageLayout({
  title,
  children,
  elementorPostId,
}: LegalPageLayoutProps) {
  return (
    <div className="wp-page-shell chrome-offset">
      <WpElementorStyles postId={elementorPostId} />
      <Header />
      <main className="mx-auto w-full max-w-4xl px-4 py-8 md:px-8">
        <h1 className="mb-6 font-heading text-3xl font-bold text-brand-primary md:text-4xl">
          {title}
        </h1>
        {children}
      </main>
      <Footer />
    </div>
  );
}
