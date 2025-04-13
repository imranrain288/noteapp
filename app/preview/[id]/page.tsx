import { notFound } from 'next/navigation'
import PreviewContent from './preview-content'

interface Props {
  params: {
    id: string
  }
}

async function getNote(noteId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/${noteId}`, {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      return null
    }

    return res.json()
  } catch (error) {
    console.error('Error fetching note:', error)
    return null
  }
}

export default async function PreviewPage({ params }: Props) {
  const note = await getNote(params.id)

  if (!note) {
    notFound()
  }

  return (
    <div className="flex-1 p-4 md:p-8">
      <PreviewContent initialNote={note} />
    </div>
  )
}