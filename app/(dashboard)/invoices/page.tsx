import { redirect } from 'next/navigation'
import { auth0 } from '@/lib/auth'
import { InvoicesTable } from '@/lib/components'
import { inferLocaleFromHeaders } from '@/lib/i18n/utils'

export default async function Page() {
  const session = await auth0.getSession()
  if (!session) redirect('/')

  const locale = await inferLocaleFromHeaders()

  return (
    <div className="p-24">
      <div className="w-full max-w-screen-md mx-auto">
        <h1 className="text-36 leading-48 font-serif text-neutral-800 mb-12">
          Invoices
        </h1>
        <p className="text-16 leading-24 font-sans text-neutral-800 w-full max-w-562 mb-40">
          View your invoices. Free plans have two standard tables: one for
          outstanding invoices, and one for paid invoices. Paid accounts can
          have unlimited tables with custom filtering and sorting rules.
        </p>
        <div className="flex flex-col gap-40">
          <InvoicesTable
            title="Outstanding"
            locale={locale}
            params={{
              paid: false,
              ordering: ['date_due', 'desc'],
              page: 1,
              currency: null,
              client_id: null,
            }}
          />
          <InvoicesTable
            title="Paid"
            locale={locale}
            params={{
              paid: true,
              ordering: ['date_paid', 'desc'],
              page: 1,
              currency: null,
              client_id: null,
            }}
          />
        </div>
      </div>
    </div>
  )
}
