"use client";

import { ReactNode } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { NavigationMenuLink } from "../navigation-menu";
import { cn } from "@/lib/utils";
import { ROUTE } from "@/types/general/client";

interface ICustomNavigationMenuLink {
  href: ROUTE;
  children: ReactNode;
}

const CustomNavigationMenuLink = ({
  href,
  ...props
}: ICustomNavigationMenuLink) => {
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <NavigationMenuLink asChild active={isActive}>
      <NextLink
        href={href}
        className={cn(isActive && "bg-muted text-foreground")}
        {...props}
      />
    </NavigationMenuLink>
  );
};

export default CustomNavigationMenuLink;
