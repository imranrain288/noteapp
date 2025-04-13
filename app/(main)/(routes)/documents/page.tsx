"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/providers/supabase-provider";
import { notesService } from "@/lib/notes";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

const DocumentsPage = () => {
  const router = useRouter();
  const { user } = useSupabase();

  const onCreate = async () => {
    if (!user) return;

    try {
      const doc = await notesService.createDocument({
        title: "Untitled",
        userId: user.id,
        parentDocumentId: null,
        content: null,
        coverImage: null,
        icon: null,
        is_published: false,
        is_archived: false
      });
      
      router.push(`/documents/${doc.id}`);
    } catch (error) {
      console.error("Failed to create document:", error);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        height="300"
        width="300"
        alt="Empty"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        height="300"
        width="300"
        alt="Empty"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.user_metadata?.full_name || user?.email}&apos;s Noteapp
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
}

export default DocumentsPage;
