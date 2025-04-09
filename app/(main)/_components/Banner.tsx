"use client";

import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { restoreDocument, deleteDocument } from "@/lib/documents";

interface BannerProps {
  documentId: string;
}

export const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();

  const onRemove = async () => {
    try {
      await deleteDocument(documentId);
      router.push("/documents");
      toast.success("Note deleted!");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete note.");
    }
  };

  const onRestore = async () => {
    try {
      await restoreDocument(documentId);
      toast.success("Note restored!");
    } catch (error) {
      console.error("Error restoring document:", error);
      toast.error("Failed to restore note.");
    }
  };

  return (
    <div className="flex w-full items-center justify-center gap-x-2 bg-rose-500 p-2 text-center text-sm text-white">
      <p>
        This page is in the <span className="font-bold">Trash.</span>
      </p>
      <Button
        size="sm"
        onClick={onRestore}
        variant="outline"
        className="h-auto border-white bg-transparent p-1 px-2 font-normal text-white transition hover:bg-white hover:text-rose-500"
      >
        Restore page
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="h-auto border-white bg-transparent p-1 px-2 font-normal text-white transition hover:bg-white hover:text-rose-500"
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  );
};
