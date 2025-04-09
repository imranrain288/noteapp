"use client";

import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getTrashDocuments, restoreDocument, deleteDocument } from "@/lib/documents";
import { useFirebase } from "@/components/providers/firebase-provider";
import { useAuthState } from "react-firebase-hooks/auth";

export const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const { auth } = useFirebase();
  const [user] = useAuthState(auth);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTrash = async () => {
      if (!user) return;
      
      try {
        const docs = await getTrashDocuments(user.uid);
        setDocuments(docs);
      } catch (error) {
        console.error("Error fetching trash documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrash();
  }, [user]);

  const filteredDocuments = documents?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    documentId: string
  ) => {
    event.stopPropagation();
    
    try {
      await restoreDocument(documentId);
      setDocuments(documents.filter(doc => doc._id !== documentId));
      toast.success("Note restored!");
    } catch (error) {
      console.error("Error restoring document:", error);
      toast.error("Failed to restore note.");
    }
  };

  const onRemove = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
      setDocuments(documents.filter(doc => doc._id !== documentId));
      toast.success("Note deleted!");
      
      if (params.documentId === documentId) {
        router.push("/documents");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete note.");
    }
  };

  if (loading) {
    return (
      <div
        className="flex h-full items-center justify-center p-4"
        aria-busy="true"
        aria-label="loading"
      >
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <section className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 bg-secondary px-2 focus-visible:ring-transparent"
          placeholder="Filter by page title..."
          aria-label="Filter by page title"
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        {filteredDocuments?.length === 0 && (
          <p className="pb-2 text-center text-xs text-muted-foreground">
            No documents found.
          </p>
        )}
        {filteredDocuments?.map((document) => (
          <button
            key={document._id}
            onClick={() => onClick(document._id)}
            className="flex w-full items-center justify-between rounded-sm text-sm text-primary hover:bg-primary/5"
            aria-label="Document"
          >
            <span className="truncate pl-2">{document.title}</span>
            <div className="flex items-center">
              <button
                onClick={(e) => onRestore(e, document._id)}
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                aria-label="Restore Document"
              >
                <Undo className="h-4 w-4 text-muted-foreground " />
              </button>
              <ConfirmModal onConfirm={() => onRemove(document._id)}>
                <button
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                  aria-label="Delete Permanently"
                >
                  <Trash className="h-4 w-4 text-muted-foreground " />
                </button>
              </ConfirmModal>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
