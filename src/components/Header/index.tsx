import Logo from "../Logo";
import Container from "../ui/custom/container";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import UserMenu from "../UserMenu";
import ModeToggle from "./ModeToggle";
import AuthButtons from "./AuthButtons";
import { verifySession } from "@/utils/auth/server";

const Header = async () => {
  const { isAuth } = await verifySession();

  return (
    <header className="border-b border-border fixed top-0 left-0 w-full z-50 py-4 backdrop-blur-md">
      <Container classes="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
          {isAuth && <DesktopNav />}
        </div>
        <div className="flex items-center gap-2">
          {isAuth && <MobileNav />}
          {isAuth && <UserMenu />}
          {!isAuth && <AuthButtons />}
          <ModeToggle />
        </div>
      </Container>
    </header>
  );
};

export default Header;
