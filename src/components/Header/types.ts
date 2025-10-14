import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";
import { ROUTE } from "@/types/general/client";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

export interface AuthLink {
  title: string;
  href: ROUTE;
  variant: ButtonVariant;
}
