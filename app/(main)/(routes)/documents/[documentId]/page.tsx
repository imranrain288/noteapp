"use client";

import dynamic from "next/dynamic";
import { useMemo, useEffect, useState } from "react";
import { Cover } from "@/components/cover";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { getDocument, updateDocument } from "@/lib/documents";

interface DocumentIdPageProps {
  params: {
    documentId: string;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDocument = async () => {
    try {
      const doc = await getDocument(params.documentId);
      setDocument(doc);
    } catch (error) {
      console.error("Error fetching document:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDocument();
  }, [params.documentId]);

  // Refresh document data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDocument();
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [params.documentId]);

  const onChange = async (content: string) => {
    try {
      await updateDocument(params.documentId, { content });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  if (loading) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="mx-auto mt-10 md:max-w-3xl lg:max-w-4xl">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-1/2" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!document) {
    return <div>Not found</div>;
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
        <Toolbar initialData={document} />
        <Editor onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
