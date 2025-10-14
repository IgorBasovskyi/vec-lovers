import Link from "next/link";
import { CustomButton } from "@/components/ui/custom/button";
import { protectedLinks, publicLinks } from "./common";

const DesktopNav = ({ authenticated }: { authenticated: boolean }) => {
  const links = authenticated ? protectedLinks : publicLinks;

  return (
    <div className="hidden md:flex items-center space-x-2">
      {links.map((link) => (
        <CustomButton key={link.href} variant={link.variant} asChild>
          <Link href={link.href}>{link.title}</Link>
        </CustomButton>
      ))}
    </div>
  );
};

export default DesktopNav;
