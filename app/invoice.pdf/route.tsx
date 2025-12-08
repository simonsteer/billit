import { renderToStream } from '@react-pdf/renderer'
import { Invoice } from '@/lib/components'
import { inferLocaleFromHeaders } from '@/lib/i18n/utils'
import { getAnonymousInvoice } from '@/lib/invoices/utils'
import { DEFAULT_LAYOUT } from '@/lib/layouts/vars'

export async function GET() {
  const invoice = getAnonymousInvoice()
  const locale = await inferLocaleFromHeaders()

  const stream = await renderToStream(
    <Invoice
      mode="yoga"
      invoice={invoice}
      locale={locale}
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
