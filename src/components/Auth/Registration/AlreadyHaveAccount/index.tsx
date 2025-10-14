import Link from "next/link";
import { ROUTE } from "@/types/general/client";

const AlreadyHaveAccount = () => (
  <div className="text-center text-sm text-muted-foreground mt-2">
    Already have an account?{" "}
    <Link
      href={ROUTE.LOGIN}
      className="text-primary font-medium hover:underline"
    >
      Log in
    </Link>
  </div>
);

export default AlreadyHaveAccount;
