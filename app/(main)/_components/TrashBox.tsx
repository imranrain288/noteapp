"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/providers/supabase-provider";
import { notesService } from "@/lib/notes";
import { Spinner } from "@/components/spinner";
import { Search, Trash, Undo } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/modals/ConfirmModal";

export const TrashBox = () => {
  const router = useRouter();
  const { user } = useSupabase();
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocuments = async () => {
      if (!user) return;

      try {
        const docs = await notesService.getArchivedDocuments(user.id);
        setDocuments(docs);
      } catch (error) {
        console.error("Failed to load archived documents:", error);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [user]);

  const filteredDocuments = documents.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = async (documentId: string) => {
    try {
      await notesService.updateDocument(documentId, {
        is_archived: false
      });
      
      // Remove from local state
      setDocuments(documents.filter(doc => doc.id !== documentId));
      
      router.refresh();
    } catch (error) {
      console.error("Failed to restore document:", error);
    }
  };

  const onRemove = async (documentId: string) => {
    try {
      await notesService.deleteDocument(documentId);
      
      // Remove from local state
      setDocuments(documents.filter(doc => doc.id !== documentId));
      
      router.refresh();
    } catch (error) {
      console.error("Failed to delete document:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 bg-secondary px-2 focus-visible:ring-transparent"
          placeholder="Filter by page title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        {filteredDocuments.length === 0 && (
          <p className="pb-2 text-center text-xs text-muted-foreground">
            No documents found.
          </p>
        )}
        {filteredDocuments.map((document) => (
          <div
            key={document.id}
            role="button"
            onClick={() => onClick(document.id)}
            className="flex w-full items-center justify-between rounded-sm text-sm text-primary hover:bg-primary/5"
          >
            <span className="truncate pl-2">{document.title}</span>
            <div className="flex items-center">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onRestore(document.id);
                }}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemove(document.id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
