import { and, eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { Invoice } from '@/lib/components'
import { db } from '@/lib/db/client'
import { invoices } from '@/lib/db/schema'
import { inferLocaleFromHeaders } from '@/lib/i18n/utils'
import { DEFAULT_LAYOUT } from '@/lib/layouts/vars'
import { auth0 } from '@/lib/auth'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth0.getSession()
  if (!session) redirect('/')

  const id = (await params).id
  const [invoice] = await db()
    .select()
    .from(invoices)
    .where(and(eq(invoices.id, id), eq(invoices.user_id, session.user.sub)))

  const locale = await inferLocaleFromHeaders()

  console.log(invoice)

  return (
    <Invoice
      mode="dom"
      locale={locale}
      invoice={invoice}
      layout={DEFAULT_LAYOUT}
    />
  )
}
