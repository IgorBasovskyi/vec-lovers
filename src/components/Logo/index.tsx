import Link from "next/link";
import { VectorSquare } from "lucide-react";
import { ROUTE } from "@/types/general/client";
import { Button } from "../ui/button";

const Logo = () => (
  <Button variant="link" asChild className="hover:no-underline p-0 !px-0">
    <Link
      href={ROUTE.HOME}
      className="flex items-center gap-2 text-xl font-semibold text-foreground"
    >
      <VectorSquare />
      Vec Lovers
    </Link>
  </Button>
);

export default Logo;
