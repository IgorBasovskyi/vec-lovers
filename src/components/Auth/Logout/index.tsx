import { logoutAction } from "@/actions/auth/logout";
import { CustomButton } from "@/components/ui/custom/button";

const Logout = () => (
  <form action={logoutAction}>
    <CustomButton>Log Out</CustomButton>
  </form>
);

export default Logout;
