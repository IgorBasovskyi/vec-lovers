import Link from "next/link";
import { VectorSquare } from "lucide-react";
import { ROUTE } from "@/types/general/client";

const Logo = () => {
  return (
    <Link
      href={ROUTE.HOME}
      className="flex items-center gap-2 text-xl font-semibold text-foreground"
    >
      <VectorSquare />
      Vec Lovers
    </Link>
  );
};

export default Logo;
