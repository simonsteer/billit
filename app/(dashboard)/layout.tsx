import {
  DashboardIcon,
  FileIcon,
  FileTextIcon,
  GearIcon,
  PersonIcon,
} from '@radix-ui/react-icons'
import { DashboardNavLink } from '@/lib/components'

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <div className="p-12 flex flex-col fixed inset-0">
      <div className="relative border border-neutral-200 rounded-2xl relative z-0 flex-1 bg-white w-full max-w-screen-xl mx-auto overflow-y-scroll no-scrollbar shadow-lg">
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
            <DashboardNavLink icon={<GearIcon />} href="/settings">
              Settings
            </DashboardNavLink>
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
