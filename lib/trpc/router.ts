import { type } from 'arktype'
import { and, asc, count, desc, eq, isNotNull, isNull } from 'drizzle-orm'
import BigNumber from 'bignumber.js'
import { baseProcedure, createTRPCRouter } from '@/lib/trpc/init'
import { CurrencySchema } from '@/lib/currency/types'
import { convertCurrency, getConversionRates } from '@/lib/currency/utils'
import { auth0 } from '@/lib/auth'
import { clients, invoices } from '@/lib/db/schema'
import { db } from '@/lib/db/client'

export const trpcRouter = createTRPCRouter({
  getClients: baseProcedure.query(async () => {
    'use server'
    const session = await auth0.getSession()
    if (!session) return []

    return await db()
      .select({
        id: clients.id,
        client_name: clients.client_name,
        invoices_count: count(invoices.id),
      })
      .from(clients)
      .leftJoin(invoices, eq(invoices.client_id, clients.id))
      .groupBy(clients.id, clients.client_name)
  }),
  getInvoices: baseProcedure
    .input(
      type({
        page: 'number',
        paid: 'boolean | null',
        ordering: type([
          "'created_at' | 'updated_at' | 'date_paid' | 'date_issued' | 'date_due' | 'invoice_number' | 'total_usd'",
          '"asc" | "desc"',
        ]).or('null'),
        currency: CurrencySchema.or('null'),
        client_id: 'string | null',
      })
    )
    .query(async ({ input: { currency, ordering, page, paid, client_id } }) => {
      'use server'
      const session = await auth0.getSession()
      if (!session) return { invoices: [], currentPage: page, maxPage: page }

      let where = [eq(invoices.user_id, session.user.sub)]
      if (paid === true) where.push(isNotNull(invoices.date_paid))
      if (paid === false) where.push(isNull(invoices.date_paid))
      if (currency) where.push(eq(invoices.currency, currency))
      if (client_id) where.push(eq(invoices.client_id, client_id))

      let order = []
      if (ordering) {
        const [column, direction] = ordering
        if (direction === 'asc') order.push(asc(invoices[column]))
        else order.push(desc(invoices[column]))
      }

      const [[{ total }], rows] = await Promise.all([
        db()
          .select({ total: count() })
          .from(invoices)
          .where(and(...where))
          .limit(1),
        db()
          .select()
          .from(invoices)
          .where(and(...where))
          .orderBy(...order)
          .offset(50 * (page - 1))
          .limit(50),
      ])

      return {
        invoices: rows,
        currentPage: page,
        maxPage: Math.ceil(total / 50),
      }
    }),
  getUpcomingDepositsTotal: baseProcedure
    .input(type({ currency: CurrencySchema }))
    .query(async ({ input }) => {
      'use server'

      const session = await auth0.getSession()
      if (!session) return null

      const fx = await getConversionRates()

      const upcoming = await db()
        .select({ total_usd: invoices.total_usd, currency: invoices.currency })
        .from(invoices)
        .where(
          and(
            isNotNull(invoices.date_paid),
            eq(invoices.user_id, session.user.sub)
          )
        )

      const sum = upcoming
        .reduce((acc, invoice) => acc.plus(invoice.total_usd), BigNumber(0))
        .toNumber()

      const total = BigNumber(convertCurrency(sum, 'USD', input.currency, fx))
        .shiftedBy(-2)
        .toNumber()

      return { total, timestamp: fx.data.timestamp }
    }),
})
