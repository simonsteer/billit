import {
  DashboardIcon,
  FaceIcon,
  FileIcon,
  FileTextIcon,
  PersonIcon,
} from '@radix-ui/react-icons'
import { DashboardNavLink, SessionPolice } from '@/lib/components'

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex flex-col fixed inset-0 bg-white">
      <SessionPolice />
      <div className="flex h-full">
        <nav className="w-248 shrink-0 py-12 px-24 flex flex-col overflow-y-scroll no-scrollbar h-full divide-y divide-neutral-200">
          <DashboardNavLink icon={<DashboardIcon />} href="/dashboard">
            Dashboard
          </DashboardNavLink>
          <DashboardNavLink icon={<FileTextIcon />} href="/invoices">
            Invoices
          </DashboardNavLink>
          <DashboardNavLink icon={<FileIcon />} href="/estimates">
            Estimates
          </DashboardNavLink>
          <DashboardNavLink icon={<PersonIcon />} href="/clients">
            Clients
          </DashboardNavLink>
          <DashboardNavLink icon={<FaceIcon />} href="/profile">
            Profile
          </DashboardNavLink>
        </nav>
        <span className="py-24 shrink-0">
          <span className="block w-px h-full bg-neutral-200" />
        </span>
        <main className="overflow-y-scroll no-scrollbar flex-1 flex flex-col">
          <div className="w-full min-h-full">{children}</div>
        </main>
      </div>
    </div>
  )
}
