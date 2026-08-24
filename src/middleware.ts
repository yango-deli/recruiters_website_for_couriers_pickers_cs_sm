import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { resolveLocaleHomeRedirect } from "./lib/landing/default-route";
import { routing } from "./i18n/routing";
import { WP_LEGACY_REDIRECTS } from "./lib/wp/manifest";

const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";

  const legacyTarget = WP_LEGACY_REDIRECTS[pathname];
  if (legacyTarget) {
    return NextResponse.redirect(new URL(legacyTarget, request.url), 301);
  }

  const decodedPath = decodeURIComponent(pathname);
  if (decodedPath !== pathname) {
    const decodedTarget = WP_LEGACY_REDIRECTS[decodedPath];
    if (decodedTarget) {
      return NextResponse.redirect(new URL(decodedTarget, request.url), 301);
    }
  }

  if (pathname === "/he" || pathname === "/en" || pathname === "/ru") {
    const locale = pathname.slice(1);
    const role = request.nextUrl.searchParams.get("role");
    const target = resolveLocaleHomeRedirect(role, locale);
    const url = new URL(target, request.url);
    return NextResponse.redirect(url, 308);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
