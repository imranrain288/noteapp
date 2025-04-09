"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/useCoverImage";
import { useParams } from "next/navigation";
import { useFirebase } from "@/components/providers/firebase-provider";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { Skeleton } from "./ui/skeleton";
import { updateDocument } from "@/lib/documents";

interface CoverImageProps {
  url?: string;
  preview?: boolean;
}

export const Cover = ({ url, preview }: CoverImageProps) => {
  const { app } = useFirebase();
  const storage = getStorage(app);
  const params = useParams();
  const coverImage = useCoverImage();

  const onRemove = async () => {
    if (url) {
      try {
        // Delete file from Firebase Storage
        const storageRef = ref(storage, url);
        await deleteObject(storageRef);

        // Update document in MongoDB to remove cover image
        await updateDocument(params.documentId as string, {
          coverImage: null
        });
      } catch (error) {
        console.error("Error removing cover image:", error);
      }
    }
  };

  return (
    <div
      className={cn(
        "group relative h-[35vh] w-full",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {!!url && (
        <Image
          src={url}
          fill
          alt="cover"
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
      {url && !preview && (
        <div className="absolute bottom-5 right-5 flex items-center gap-x-2 opacity-0 group-hover:opacity-100">
          <Button
            onClick={() => coverImage.onReplace(url)}
            className="text-xs text-muted-foreground"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Change cover
          </Button>
          <Button
            onClick={onRemove}
            className="text-xs text-muted-foreground"
            variant="outline"
            size="sm"
          >
            <X className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="h-[12vh] w-full" />;
};
