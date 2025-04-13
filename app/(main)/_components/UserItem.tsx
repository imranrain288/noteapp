"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsLeftRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/providers/supabase-provider";

export const UserItem = () => {
  const { user, signOut } = useSupabase();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role="button"
          className="flex w-full items-center p-3 text-sm hover:bg-primary/5"
        >
          <div className="flex max-w-[150px] items-center gap-x-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
            </Avatar>
            <span className="line-clamp-1 text-start font-medium">
              {user?.user_metadata?.full_name || user?.email}
            </span>
          </div>
          <ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80"
        align="start"
        alignOffset={11}
        forceMount
      >
        <div className="flex items-center justify-start gap-x-2 p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm line-clamp-1">
              {user?.user_metadata?.full_name || user?.email}
            </p>
            <p className="text-xs font-medium text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="w-full cursor-pointer text-muted-foreground"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
