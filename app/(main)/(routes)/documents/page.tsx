"use client";

import Image from "next/image";
import { useFirebase } from "@/components/providers/firebase-provider";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { Spinner } from "@/components/spinner";
import { createDocument } from "@/lib/documents";
import { toast } from "sonner";

const DocumentsPage = () => {
  const { auth } = useFirebase();
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const onCreate = async () => {
    if (!user) return;
    
    try {
      const response = await createDocument({
        title: "Untitled",
        userId: user.uid
      });
      router.push(`/documents/${response._id}`);
    } catch (error) {
      console.error("Error creating document:", error);
      toast.error("Failed to create note")
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
     
      <h2 className="text-lg font-medium">
        Welcome to {user?.displayName}&apos;s Noteapp
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
};

export default DocumentsPage;
