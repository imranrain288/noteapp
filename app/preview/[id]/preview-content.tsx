'use client'

import { useEffect, useState } from 'react'
import { BlockNoteEditor } from '@blocknote/core'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/core/style.css'
import '@blocknote/mantine/style.css'

interface Note {
  _id: string
  title: string
  content: string
  tags?: string[]
  updatedAt: string
}

interface PreviewContentProps {
  initialNote: Note
}

export default function PreviewContent({ initialNote }: PreviewContentProps) {
  const [note, setNote] = useState<Note>(initialNote)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date(initialNote.updatedAt))

  const editor = useCreateBlockNote({
    initialContent: 
      initialNote.content 
        ? JSON.parse(initialNote.content)
        : undefined
  })

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const response = await fetch(`/api/documents/${initialNote._id}`)
        if (response.ok) {
          const data = await response.json()
          const updatedAt = new Date(data.updatedAt)
          if (updatedAt > lastUpdate) {
            setNote(data)
            try {
              const newContent = JSON.parse(data.content)
              editor.replaceBlocks(editor.topLevelBlocks, newContent)
            } catch (e) {
              console.error('Error parsing updated content:', e)
            }
            setLastUpdate(updatedAt)
          }
        }
      } catch (error) {
        console.error('Error checking for updates:', error)
      }
    }

    const interval = setInterval(checkForUpdates, 1000)
    return () => clearInterval(interval)
  }, [initialNote._id, lastUpdate, editor])

  if (!note) return null

  return (
    <article className="prose lg:prose-xl w-full">
      <h1 className="text-3xl font-bold mb-4">{note.title}</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <style jsx global>{`
          [data-content-type="paragraph"] {
            padding: 0.5rem;
            margin-bottom: 0.5rem;
            border-radius: 0.375rem;
            transition: background-color 0.2s ease;
          }
          [data-background-color="red"] {
            background-color: #fee2e2;
          }
          [data-background-color="blue"] {
            background-color: #dbeafe;
          }
          [data-background-color="green"] {
            background-color: #dcfce7;
          }
          [data-background-color="yellow"] {
            background-color: #fef9c3;
          }
          [data-background-color="default"] {
            background-color: transparent;
          }
        `}</style>
        <BlockNoteView editor={editor} editable={false} />
      </div>
      {note.tags && note.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {note.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="mt-4 text-sm text-gray-500">
        Last updated: {new Date(note.updatedAt).toLocaleString()}
      </div>
    </article>
  )
}
