import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_KEYS, ROUTES, USER_ROLES } from "./constants/routes";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(AUTH_COOKIE_KEYS.ACCESS_TOKEN)?.value;
  const role = request.cookies.get(AUTH_COOKIE_KEYS.ROLE)?.value;

  const isAuthPage =
    pathname.startsWith(ROUTES.LOGIN) ||
    pathname.startsWith(ROUTES.REGISTER) ||
    pathname.startsWith(ROUTES.FORGOT_PASSWORD);

  const isUserProtected =
    pathname.startsWith(ROUTES.USER_DASHBOARD) ||
    pathname.startsWith(ROUTES.USER_PROFILE);

  const isAdminProtected = pathname.startsWith(ROUTES.ADMIN_DASHBOARD);

  // 1. If user is logged in and visits auth pages (login/register), redirect to their dashboard
  if (isAuthPage && token) {
    const redirectUrl =
      role === USER_ROLES.ADMIN || role === USER_ROLES.SUPER_ADMIN
        ? new URL(ROUTES.ADMIN_DASHBOARD, request.url)
        : new URL(ROUTES.USER_DASHBOARD, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Protect User Dashboard & Profile
  if (isUserProtected && !token) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Protect Admin Dashboard
  if (isAdminProtected) {
    if (!token) {
      const loginUrl = new URL(ROUTES.LOGIN, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role !== USER_ROLES.ADMIN && role !== USER_ROLES.SUPER_ADMIN) {
      // Authenticated but lacks admin privilege -> bounce to user dashboard
      const userDashboardUrl = new URL(ROUTES.USER_DASHBOARD, request.url);
      userDashboardUrl.searchParams.set("error", "forbidden");
      return NextResponse.redirect(userDashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (svg, png, jpg, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
