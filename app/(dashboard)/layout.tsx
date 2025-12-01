import Link from 'next/link'
import { ReactNode } from 'react'
import {
  DashboardIcon,
  FileIcon,
  FileTextIcon,
  GearIcon,
  PersonIcon,
} from '@radix-ui/react-icons'

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <div className="p-12 flex flex-col fixed inset-0">
      <div className="border border-neutral-200 rounded-2xl relative z-0 flex-1 bg-white w-full max-w-screen-xl mx-auto overflow-y-scroll no-scrollbar shadow-lg">
        <div className="flex h-full">
          <nav className="w-248 shrink-0 py-12 px-24 flex flex-col overflow-y-scroll no-scrollbar h-full divide-y divide-neutral-200">
            <NavLink icon={<DashboardIcon />} href="/dashboard">
              Dashboard
            </NavLink>
            <NavLink icon={<FileTextIcon />} href="/invoices">
              Invoices
            </NavLink>
            <NavLink icon={<FileIcon />} href="/estimates">
              Estimates
            </NavLink>
            <NavLink icon={<PersonIcon />} href="/clients">
              Clients
            </NavLink>
            <NavLink icon={<GearIcon />} href="/account">
              Account
            </NavLink>
          </nav>
          <span className="py-24 shrink-0">
            <span className="block w-px h-full bg-neutral-200" />
          </span>
          <div className="flex-1 relative overflow-y-scroll no-scrollbar h-full p-24">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function NavLink({
  icon,
  href,
  children,
}: {
  icon: ReactNode
  href: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className="py-12 z-10 group flex items-center gap-12 text-neutral-800 hover:opacity-50"
    >
      {icon}
      <span className="text-18 leading-22 font-serif truncate pt-2">
        {children}
      </span>
    </Link>
  )
}
