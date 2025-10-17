import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "./utils/auth/server";
import {
  COOKIE_NAME,
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
} from "./constants/general";
import { ROUTE } from "./types/general/client";

const middleware = async (req: NextRequest) => {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = PROTECTED_ROUTES.includes(path as ROUTE);
  const isPublicRoute = PUBLIC_ROUTES.includes(path as ROUTE);

  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  const session = await decrypt(cookie);

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL(ROUTE.LOGIN, req.nextUrl));
  }

  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith(ROUTE.DASHBOARD)
  ) {
    return NextResponse.redirect(new URL(ROUTE.DASHBOARD, req.nextUrl));
  }

  return NextResponse.next();
};

export default middleware;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
