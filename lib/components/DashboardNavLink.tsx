'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export function DashboardNavLink({
  icon,
  href,
  children,
}: {
  icon: ReactNode
  href: string
  children: ReactNode
}) {
  const isActive = usePathname() === href

  return (
    <Link
      href={href}
      className="py-12 z-10 group flex items-center gap-12 text-neutral-800 group"
    >
      {icon}
      <span
        className={clsx(
          'text-18 leading-22 font-serif truncate pt-2 group-hover:underline',
          isActive && 'underline'
        )}
      >
        {children}
      </span>
    </Link>
  )
}
