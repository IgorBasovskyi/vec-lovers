import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "./constants/general";
import { ROUTE } from "./types/general/client";

export const middleware = (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  const matchesRoute = (routeList: string[]) =>
    routeList.some((r) => path === r || path.startsWith(`${r}/`));

  const isPublic = matchesRoute(PUBLIC_ROUTES);
  const isProtected = matchesRoute(PROTECTED_ROUTES);

  if (!token && isProtected) {
    return NextResponse.redirect(new URL(ROUTE.LOGIN, req.url));
  }

  if (token && isPublic) {
    return NextResponse.redirect(new URL(ROUTE.DASHBOARD, req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*"],
};
