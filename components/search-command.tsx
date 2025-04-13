"use client";

import { useEffect, useState } from "react";
import { File } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/providers/supabase-provider";
import { notesService } from "@/lib/notes";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSearch } from "@/hooks/useSearch";

interface Document {
  id: string;
  title: string;
  icon?: string;
  is_archived: boolean;
}

export const SearchCommand = () => {
  const { user } = useSupabase();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [search, setSearch] = useState("");

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user) return;
      
      try {
        const docs = await notesService.getDocuments(user.id);
        setDocuments(docs.filter((doc: Document) => !doc.is_archived));
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, [user]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const onSelect = (id: string) => {
    router.push(`/documents/${id}`);
    onClose();
  };

  if (!isMounted) {
    return null;
  }

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput 
        placeholder={`Search ${user?.user_metadata?.full_name || user?.email}'s Noteapp..`}
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {filteredDocuments.map((document) => (
            <CommandItem
              key={document.id}
              onSelect={() => onSelect(document.id)}
              value={document.title}
            >
              {document.icon ? (
                <p className="mr-2 text-[1.125rem]">{document.icon}</p>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
