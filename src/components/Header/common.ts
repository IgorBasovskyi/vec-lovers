import { ROUTE } from "@/types/general/client";
import { AuthLink } from "./types";

export const publicLinks: AuthLink[] = [
  { title: "Log In", href: ROUTE.LOGIN, variant: "outline" },
  { title: "Sign Up", href: ROUTE.REGISTER, variant: "default" },
];

export const protectedLinks: AuthLink[] = [];
