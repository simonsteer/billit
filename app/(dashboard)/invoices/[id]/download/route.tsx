import { NextRequest } from 'next/server'
import { and, eq } from 'drizzle-orm'
import { auth0 } from '@/lib/auth'
import { invoices } from '@/lib/db/schema'
import { db } from '@/lib/db/client'
import { renderToStream } from '@react-pdf/renderer'
import { Invoice } from '@/lib/components'
import { inferLocaleFromHeaders } from '@/lib/i18n/utils'
import { DEFAULT_LAYOUT } from '@/lib/layouts/vars'

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>
  }
) {
  const session = await auth0.getSession()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const id = (await params).id
  console.log({ id })
  const [invoice] = await db()
    .select()
    .from(invoices)
    .where(and(eq(invoices.id, id!), eq(invoices.user_id, session.user.sub)))

  if (!invoice) return new Response('Not found', { status: 404 })

  const locale = await inferLocaleFromHeaders()

  const stream = await renderToStream(
    <Invoice
      mode="yoga"
      locale={locale}
      invoice={invoice}
      layout={DEFAULT_LAYOUT}
    />
  )

  // undici doesn't accept NodeJS.ReadableStream as a valid type signature as part of BodyInit, but this works
  return new Response(stream as unknown as BodyInit, {
    headers: {
      ['Content-Type']: 'application/pdf',
      ['Content-Disposition']: `attachment; filename="invoice-${id}.pdf"`,
    },
  })
}
