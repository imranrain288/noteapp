"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/useCoverImage";
import { SingleImageDropzone } from "@/components/single-image-dropzone";
import { useState } from "react";
import { useFirebase } from "@/components/providers/firebase-provider";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams } from "next/navigation";
import { updateDocument } from "@/lib/documents";

export const CoverImageModal = () => {
  const params = useParams();
  const { app } = useFirebase();
  const storage = getStorage(app);

  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const coverImage = useCoverImage();

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      try {
        // Upload file to Firebase Storage
        const storageRef = ref(storage, `covers/${params.documentId}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Update document in MongoDB
        await updateDocument(params.documentId as string, {
          coverImage: downloadURL
        });

        onClose();
      } catch (error) {
        console.error("Error uploading cover image:", error);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Cover Image
          </DialogTitle>
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
