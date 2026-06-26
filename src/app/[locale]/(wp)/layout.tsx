import type { ReactNode } from "react";
import { WpSiteChrome } from "@/components/wp/WpSiteChrome";
import { WpMotionEnhancements } from "@/components/wp/WpMotionEnhancements";

export default function WpLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <WpSiteChrome />
      <WpMotionEnhancements />
      {children}
    </>
  );
}
