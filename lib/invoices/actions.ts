'use server'

import { auth0 } from '@/lib/auth'
import { Currency } from '@/lib/currency/types'
import { db } from '@/lib/db/client'
import { invoices } from '@/lib/db/schema'
import { and, asc, desc, eq, isNotNull } from 'drizzle-orm'

type InvoicesOrderingField =
  | 'created_at'
  | 'updated_at'
  | 'date_paid'
  | 'date_issued'
  | 'date_due'
  | 'invoice_number'
  | 'total'

export type GetInvoicesParams = {
  page: number
  paid: boolean | null
  ordering: [InvoicesOrderingField, 'asc' | 'desc'] | null
  currency: Currency | null
}

const GET_INVOICES_PAGE_SIZE = 50

export async function getInvoices({
  page,
  paid,
  currency,
  ordering,
}: GetInvoicesParams) {
  const session = await auth0.getSession()
  const userId = session?.user.sub
  if (!userId) return []

  let where = []
  if (paid) where.push(isNotNull(invoices.date_paid))
  if (currency) where.push(eq(invoices.currency, currency))

  let order = []
  if (ordering) {
    const [column, direction] = ordering
    if (direction === 'asc') order.push(asc(invoices[column]))
    else order.push(desc(invoices[column]))
  }

  return await db
    .select()
    .from(invoices)
    .offset(GET_INVOICES_PAGE_SIZE * (page - 1))
    .limit(GET_INVOICES_PAGE_SIZE)
    .where(and(...where))
    .orderBy(...order)
}
