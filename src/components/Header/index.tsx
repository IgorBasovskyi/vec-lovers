import Logo from "../Logo";
import ModeToggle from "../ModeToggle";
import Container from "../ui/custom/container";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import Logout from "../Auth/Logout";
import { isAuthenticated } from "@/utils/auth/server";

const Header = async () => {
  const authenticated = await isAuthenticated();

  return (
    <header className="border-b border-border fixed top-0 left-0 w-full z-50 py-4 backdrop-blur-md">
      <Container classes="flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <DesktopNav authenticated={authenticated} />
          <MobileNav authenticated={authenticated} />
          {authenticated && <Logout />}
          <ModeToggle />
        </div>
      </Container>
    </header>
  );
};

export default Header;
