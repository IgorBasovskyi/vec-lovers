import { ROUTE } from "@/types/general/client";

export const PROTECTED_ROUTES = [
  ROUTE.DASHBOARD,
  ROUTE.ADD_ICON,
  ROUTE.MY_COLLECTIONS,
];

export const PUBLIC_ROUTES = [ROUTE.HOME, ROUTE.LOGIN, ROUTE.REGISTER];

export const COOKIE_NAME = "session";

export const DEFAULT_LIMIT = 20;
export const DEFAULT_OFFSET = 0;
