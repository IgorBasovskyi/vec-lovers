import Link from "next/link";
import { ROUTE } from "@/types/general/client";

const DontHaveAccount = () => (
  <div className="text-center text-sm text-muted-foreground mt-4">
    Don’t have an account?{" "}
    <Link
      href={ROUTE.REGISTER}
      className="text-primary font-medium hover:underline"
    >
      Register
    </Link>
  </div>
);

export default DontHaveAccount;
