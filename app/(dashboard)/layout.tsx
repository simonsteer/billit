import { NavLink } from '@/lib/components'
import clsx from 'clsx'

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <div className="p-12 flex flex-col fixed inset-0">
      <div className="border border-neutral-200 rounded-2xl relative z-0 flex-1 bg-white w-full max-w-screen-xl mx-auto overflow-y-scroll no-scrollbar shadow-lg">
        <div className="flex h-full">
          <nav className="w-248 shrink-0 py-12 px-24 flex flex-col overflow-y-scroll no-scrollbar h-full divide-y divide-neutral-200">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/invoices">Invoices</NavLink>
            <NavLink href="/clients">Clients</NavLink>
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
