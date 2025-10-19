import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTE } from "@/types/general/client";

const AuthLinks = () => (
  <div className="flex items-center gap-2">
    <Button variant="outline" asChild size="sm">
      <Link href={ROUTE.LOGIN}>Log In</Link>
    </Button>
    <Button variant="default" asChild size="sm">
      <Link href={ROUTE.REGISTER}>Register</Link>
    </Button>
  </div>
);

export default AuthLinks;
