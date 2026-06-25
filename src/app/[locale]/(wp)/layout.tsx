import type { ReactNode } from "react";
import { WpSiteChrome } from "@/components/wp/WpSiteChrome";

export default function WpLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <WpSiteChrome />
      {children}
    </>
  );
}
