"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useSupabase } from "@/components/providers/supabase-provider";
import { notesService } from "@/lib/notes";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { useCoverImage } from "@/hooks/use-cover-image";

export const CoverImageModal = () => {
  const params = useParams();
  const { user } = useSupabase();
  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();

  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    if (!user || !file) return;

    setIsSubmitting(true);
    setFile(file);

    try {
      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: coverImage.url
        }
      });

      await notesService.updateDocument(params.documentId as string, {
        coverImage: res.url
      });

      onClose();
    } catch (error) {
      console.error("Error uploading cover image:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">
            Cover Image
          </h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
};
