import { navLinks } from "./common";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../ui/navigation-menu";
import CustomNavigationMenuLink from "../ui/custom/nav-link";

const DesktopNav = () => (
  <NavigationMenu className="hidden md:flex">
    <NavigationMenuList>
      {navLinks.map((link) => (
        <NavigationMenuItem key={link.href}>
          <CustomNavigationMenuLink href={link.href}>
            {link.title}
          </CustomNavigationMenuLink>
        </NavigationMenuItem>
      ))}
    </NavigationMenuList>
  </NavigationMenu>
);

export default DesktopNav;
