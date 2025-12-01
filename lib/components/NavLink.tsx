'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export function NavLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  const pathname = usePathname()
  const active = pathname === href

  return (
    <Link href={href} className="py-12 z-10 group flex items-center gap-12">
      <span className="text-18 leading-24 font-serif text-neutral-800 truncate">
        {children}
      </span>
      <ArrowRightIcon
        className={clsx(
          'transition-all',
          !active &&
            '-translate-x-12 group-hover:translate-x-0 opacity-0 group-hover:opacity-100'
        )}
      />
    </Link>
  )
}
