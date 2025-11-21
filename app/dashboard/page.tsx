import Link from 'next/link'
import { ReactNode } from 'react'
import { FileTextIcon, GearIcon, PersonIcon } from '@radix-ui/react-icons'
import clsx from 'clsx'
import { getFakeInvoice } from '@/lib/invoices/utils'

export default async function Page() {
  const invoices = [...Array(50)].map(getFakeInvoice)

  return (
    <div className="w-screen min-h-screen flex">
      <aside className="flex flex-col gap-16 p-14">
        <SidebarItem icon={<FileTextIcon className="w-32 h-32" />}>
          Invoices
        </SidebarItem>
        <SidebarItem icon={<PersonIcon className="w-32 h-32" />}>
          Account
        </SidebarItem>
        <SidebarItem icon={<GearIcon className="w-32 h-32" />}>
          Settings
        </SidebarItem>
      </aside>
      <main className="flex-1 min-h-screen flex flex-col items-center">
        <div className="flex flex-col w-full max-w-840 bg-neutral-300">
          {invoices.map(invoice => (
            <p className="whitespace-pre" key={invoice.id}>
              {invoice.fromDescription}
            </p>
          ))}
        </div>
      </main>
    </div>
  )
}

function SidebarItem({
  children,
  icon,
}: {
  children: ReactNode
  icon: ReactNode
}) {
  return (
    <Link
      href="/"
      className="flex flex-col items-center justify-center gap-6 group"
    >
      <span className="block aspect-square p-4 bg-white rounded-full">
        <span
          className={clsx(
            'block aspect-square rounded-full p-4 transition-colors',
            'text-neutral-400 group-hover:text-white',
            'bg-transparent group-hover:bg-orange-400'
          )}
        >
          {icon}
        </span>
      </span>
      <span className="transition-colors font-semibold text-12 leading-16 text-neutral-400 group-hover:text-black">
        {children}
      </span>
    </Link>
  )
}
