import { DashboardTab } from '@/lib/components/Invoice'

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <div className="p-12 flex flex-col fixed inset-0">
      <nav className="relative z-1 px-24 w-full max-w-screen-xl mx-auto">
        <div className="flex gap-6">
          <DashboardTab href="/dashboard" text="Dashboard" />
          <DashboardTab href="/invoices" text="Invoices" />
          <DashboardTab href="/account" text="Account" />
        </div>
      </nav>
      <main className="border rounded-lg relative z-0 flex-1 bg-white px-24 pb-48 w-full max-w-screen-xl mx-auto overflow-y-scroll no-scrollbar">
        <span className="bg-gradient-to-b from-white to-transparent z-999 sticky top-0 block h-24" />
        {children}
      </main>
    </div>
  )
}
