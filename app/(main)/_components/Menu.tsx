"use client";

import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/providers/supabase-provider";
import { notesService } from "@/lib/notes";
import {
  MoreHorizontal,
  Trash
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface MenuProps {
  documentId: string;
}

export const Menu = ({
  documentId
}: MenuProps) => {
  const router = useRouter();
  const { user } = useSupabase();

  const onArchive = async () => {
    if (!user) return;

    try {
      await notesService.updateDocument(documentId, {
        is_archived: true
      });
      
      router.refresh();
      router.push("/documents");
    } catch (error) {
      console.error("Failed to archive document:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-60" 
        align="end" 
        alignOffset={8} 
        forceMount
      >
        <DropdownMenuItem onClick={onArchive}>
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="text-xs text-muted-foreground p-2">
          Last edited by: {user?.user_metadata?.full_name || user?.email}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-8 w-8" />;
};
