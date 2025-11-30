import { redirect } from 'next/navigation'
import { auth0 } from '@/lib/auth'
import { InvoicesTable } from '@/lib/components'
import { inferLocaleFromHeaders } from '@/lib/i18n/utils'

export default async function Page() {
  const session = await auth0.getSession()
  if (!session) redirect('/')

  const locale = await inferLocaleFromHeaders()

  return (
    <div className="flex flex-col gap-40">
      <InvoicesTable
        title="Recently Issued"
        locale={locale}
        params={{
          paid: null,
          ordering: ['date_due', 'desc'],
          page: 1,
          currency: null,
        }}
      />
      <InvoicesTable
        title="Settled"
        locale={locale}
        params={{
          paid: true,
          ordering: ['date_paid', 'desc'],
          page: 1,
          currency: null,
        }}
      />
      <InvoicesTable
        title="Outstanding & Most Valuable"
        locale={locale}
        params={{
          paid: false,
          ordering: ['total_usd', 'desc'],
          page: 1,
          currency: null,
        }}
      />
    </div>
  )
}
