import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Logout from "../Auth/Logout";
import { Button } from "../ui/button";
import { getUser } from "@/actions/user/getUser";
import { IServerError } from "@/types/general/server";
import { IUser } from "@/types/user/general";

const UserMenu = async () => {
  const response: IUser | IServerError = await getUser();
  const user = "username" in response ? response : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          title={user ? user.username : "Failed to load user"}
        >
          <Avatar className="w-full h-full">
            <AvatarFallback>
              {user ? user.username[0].toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled={!user} asChild className="cursor-pointer">
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Logout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
