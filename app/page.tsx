import { headers } from 'next/headers'
import { Invoice } from '@/lib/components/Invoice'
import { inferLocale } from '@/lib/i18n/utils'
import { getAnonymousInvoice } from '@/lib/invoices/utils'
import { DEFAULT_LAYOUT } from '@/lib/layouts/vars'

export default async function Page() {
  const invoice = getAnonymousInvoice()
  const locale = inferLocale((await headers()).get('Accept-Language'))

  return (
    <main className="w-screen min-h-screen p-24">
      <Invoice
        invoice={invoice}
        locale={locale}
        mode="dom"
        layout={DEFAULT_LAYOUT}
      />
    </main>
  )
}
