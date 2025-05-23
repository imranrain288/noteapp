import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Note Not Found</h2>
        <p className="text-gray-600 mb-4">Could not find the requested note.</p>
        <Link 
          href="/documents"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Return to Documents
        </Link>
      </div>
    </div>
  )
}
