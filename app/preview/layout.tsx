'use client'

import { SideMenu } from '@/components/SideMenu'
import { FileText, Settings } from 'lucide-react'

const sidebarItems = [
  {
    title: 'Documents',
    href: '/documents',
    icon: <FileText className="h-4 w-4" />
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: <Settings className="h-4 w-4" />
  }
]

export default function PreviewLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full">
      <aside className="hidden md:flex h-full w-[240px] flex-col bg-muted">
        <div className="flex h-[60px] items-center px-6">
          <span className="font-semibold">Note App</span>
        </div>
        <SideMenu items={sidebarItems} />
      </aside>
      <main className="flex-1 h-full overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
