"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSupabase } from "@/components/providers/supabase-provider";
import { notesService } from "@/lib/notes";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { useTheme } from "next-themes";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";

import { Cover } from "@/components/cover";
import { Toolbar } from "@/components/toolbar";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { user } = useSupabase();
  const params = useParams();
  const { resolvedTheme } = useTheme();

  const [blocks, setBlocks] = useState<PartialBlock[]>([]);

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
  });

  useEffect(() => {
    if (initialContent) {
      setBlocks(JSON.parse(initialContent));
    }
  }, [initialContent]);

  const save = async (content: string) => {
    if (!user) return;

    try {
      await notesService.updateDocument(params.documentId as string, {
        content
      });
    } catch (error) {
      console.error("Failed to save document:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-y-4 p-4">
      <Cover />
      <Toolbar initialData={blocks} />
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default Editor;
