import type { ReactNode } from "react";

/** Careers use FigmaCareersPage chrome; legal pages use WpLegalPage chrome. */
export default function WpLayout({ children }: { children: ReactNode }) {
  return children;
}
