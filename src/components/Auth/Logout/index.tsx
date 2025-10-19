import { logoutAction } from "@/actions/auth/logout/logout";

const Logout = () => (
  <form action={logoutAction}>
    <button type="submit" className="w-full text-left">
      Log Out
    </button>
  </form>
);

export default Logout;
