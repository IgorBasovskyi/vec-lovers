import Link from "next/link";
import { Menu } from "lucide-react";
import { CustomButton } from "@/components/ui/custom/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { protectedLinks, publicLinks } from "./common";

const MobileNav = ({ authenticated }: { authenticated: boolean }) => {
  const links = authenticated ? protectedLinks : publicLinks;

  return (
    <div className="md:hidden flex items-center">
      <Sheet>
        <SheetTrigger asChild>
          <CustomButton variant="ghost" size="icon" aria-label="Open menu">
            <Menu />
          </CustomButton>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="bg-background flex flex-col items-center justify-center p-8 space-y-6"
        >
          {links.map((link) => (
            <CustomButton
              key={link.href}
              variant={link.variant}
              asChild
              className="w-full"
            >
              <Link href={link.href}>{link.title}</Link>
            </CustomButton>
          ))}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
