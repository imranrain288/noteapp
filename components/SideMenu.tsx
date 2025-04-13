'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SideMenuProps {
  items: {
    title: string
    href: string
    icon?: React.ReactNode
  }[]
}

export function SideMenu({ items }: SideMenuProps) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-2 p-4">
      {items.map((item) => (
        <Button
          key={item.href}
          asChild
          variant={pathname === item.href ? 'default' : 'ghost'}
          className={cn(
            'w-full justify-start gap-2',
            pathname === item.href && 'bg-primary text-primary-foreground'
          )}
        >
          <Link href={item.href}>
            {item.icon}
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
