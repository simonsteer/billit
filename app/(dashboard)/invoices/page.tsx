import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth0 } from '@/lib/auth'
import { InvoicesTable } from '@/lib/components'
import { inferLocale } from '@/lib/i18n/utils'

export default async function Page() {
  const session = await auth0.getSession()
  if (!session) redirect('/')

  const locale = inferLocale((await headers()).get('Accept-Language'))

  return (
    <div className="flex flex-col gap-40">
      <InvoicesTable
        locale={locale}
        params={{
          paid: true,
          ordering: ['total', 'desc'],
          page: 1,
          currency: null,
        }}
      />
      <InvoicesTable
        locale={locale}
        params={{
          paid: false,
          ordering: ['invoice_number', 'asc'],
          page: 1,
          currency: 'CAD',
        }}
      />
    </div>
  )
}
