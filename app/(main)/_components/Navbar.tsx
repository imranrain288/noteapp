"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { useFirebase } from "@/components/providers/firebase-provider";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDocument } from "@/lib/documents";
import { Title } from "./Title";
import { Banner } from "./Banner";
import { Menu } from "./Menu";
import { Publish } from "./Publish";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const { auth } = useFirebase();
  const [user] = useAuthState(auth);
  const params = useParams();
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!user || !params.documentId) return;
      
      try {
        const doc = await getDocument(params.documentId as string);
        setDocument(doc);
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [user, params.documentId]);

  if (loading) {
    return (
      <nav className="flex w-full items-center justify-between bg-background px-3 py-2 dark:bg-[#1F1F1F]">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2 ">
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }

  if (!document) {
    return null;
  }

  return (
    <>
      <nav className="flex w-full items-center gap-x-2 bg-background px-3 py-2 dark:bg-[#1F1F1F]">
        {isCollapsed && (
          <button aria-label="Menu">
            <MenuIcon
              onClick={onResetWidth}
              className="h-6 w-6 text-muted-foreground"
            />
          </button>
        )}
        <div className="flex w-full items-center justify-between">
          <Title initialData={document} />
          <div className="flex items-center gap-x-2">
            <Publish initialData={document} />
            <Menu documentId={document._id} />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document._id} />}
    </>
  );
};
