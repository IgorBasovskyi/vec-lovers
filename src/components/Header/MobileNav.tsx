import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import CustomNavigationMenuLink from "@/components/ui/custom/nav-link";
import { navLinks } from "./common";
import { DrawerDescription, DrawerTitle } from "@/components/ui/drawer";

const MobileNav = () => (
  <div className="md:hidden flex items-center">
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="bg-background flex flex-col items-center justify-center p-8 space-y-6"
        aria-label="Navigation menu"
      >
        <div className="sr-only">
          <DrawerTitle>Navigation Menu</DrawerTitle>
          <DrawerDescription>
            Use this menu to navigate the site
          </DrawerDescription>
        </div>
        <NavigationMenu>
          <NavigationMenuList className="flex-col">
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <SheetClose asChild>
                  <CustomNavigationMenuLink href={link.href}>
                    {link.title}
                  </CustomNavigationMenuLink>
                </SheetClose>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </SheetContent>
    </Sheet>
  </div>
);

export default MobileNav;
