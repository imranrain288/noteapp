"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSupabase } from "@/components/providers/supabase-provider";
import { notesService } from "@/lib/notes";
import { Item } from "./Item";
import { cn } from "@/lib/utils";
import { FileIcon } from "lucide-react";

interface DocumentListProps {
  parentDocumentId?: string;
  level?: number;
}

export const DocumentList = ({
  parentDocumentId,
  level = 0,
}: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();
  const { user } = useSupabase();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocuments = async () => {
      if (!user) return;

      try {
        const docs = await notesService.getDocuments(user.id, parentDocumentId);
        setDocuments(docs);
      } catch (error) {
        console.error("Failed to load documents:", error);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [user, parentDocumentId]);

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  if (loading) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{
          paddingLeft: level ? `${level * 12 + 25}px` : undefined,
        }}
        className={cn(
          "hidden text-sm font-medium text-muted-foreground/80",
          level === 0 && "block",
        )}
      >
        {documents.length === 0 ? "No pages inside" : "Pages"}
      </p>
      {documents.map((document) => (
        <div key={document.id}>
          <Item
            id={document.id}
            onClick={() => onRedirect(document.id)}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.documentId === document.id}
            level={level}
          />
        </div>
      ))}
    </>
  );
};
