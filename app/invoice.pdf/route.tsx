import { headers } from 'next/headers'
import { renderToStream } from '@react-pdf/renderer'
import { Invoice } from '@/lib/components'
import { inferLocale } from '@/lib/i18n/utils'
import { getAnonymousInvoice } from '@/lib/invoices/utils'
import { DEFAULT_LAYOUT } from '@/lib/layouts/vars'

export async function GET() {
  const invoice = getAnonymousInvoice()
  const locale = inferLocale((await headers()).get('Accept-Language'))

  const stream = await renderToStream(
    <Invoice
      invoice={invoice}
      locale={locale}
      mode="yoga"
      layout={DEFAULT_LAYOUT}
    />
  )

  // undici doesn't accept NodeJS.ReadableStream as a valid type signature as part of BodyInit, but this works
  return new Response(stream as unknown as BodyInit, {
    headers: {
      ['Content-Type']: 'application/pdf',
      ['Content-Disposition']: 'attachment; filename="invoice.pdf"',
    },
  })
}
