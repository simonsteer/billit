'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function DashboardTab({ text, href }: { text: string; href: string }) {
  const pathname = usePathname()
  const active = pathname === href

  return (
    <Link
      href={href}
      className={clsx(
        'border-t border-x border-neutral-300 rounded-t-lg px-14 py-4 bg-white',
        'relative after:w-full after:h-1 after:absolute after:-bottom-1 after:left-0',
        active ? 'after:bg-white' : 'bg-neutral-100 after:bg-neutral-300'
      )}
    >
      <span
        className={clsx(
          'text-16 leading-20 font-serif',
          active
            ? 'text-neutral-800'
            : 'text-neutral-400 hover:text-neutral-800'
        )}
      >
        {text}
      </span>
    </Link>
  )
}
