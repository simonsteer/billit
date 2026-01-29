import { type } from 'arktype'
import {
  and,
  asc,
  count,
  desc,
  eq,
  isNotNull,
  isNull,
  sql,
  sum,
} from 'drizzle-orm'
import { renderToStream } from '@react-pdf/renderer'
import { baseProcedure, createTRPCRouter } from '@/lib/trpc/init'
import { CurrencySchema } from '@/lib/currency/types'
import { auth0 } from '@/lib/auth'
import { business_profiles, clients, invoices } from '@/lib/db/schema'
import { db } from '@/lib/db/client'
import {
  BusinessProfileInsertSchema,
  BusinessProfileUpdateSchema,
} from '@/lib/business_profiles/types'
import { ClientUpdateSchema } from '@/lib/clients/types'
import { Invoice } from '@/lib/components'
import { inferLocaleFromHeaders } from '@/lib/i18n/utils'
import { DEFAULT_LAYOUT } from '@/lib/layouts/vars'

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
  getInvoice: baseProcedure
    .input(type({ id: 'string' }))
    .query(async ({ input }) => {
      'use server'
      const session = await auth0.getSession()
      if (!session) return null

      const [invoice = null] = await db()
        .select()
        .from(invoices)
        .where(
          and(eq(invoices.id, input.id), eq(invoices.user_id, session.user.sub))
        )

      return invoice
    }),
  getInvoicePdf: baseProcedure
    .input(type({ id: 'string' }))
    .query(async ({ input }) => {
      'use server'
      const session = await auth0.getSession()
      if (!session) return null

      const [invoice = null] = await db()
        .select()
        .from(invoices)
        .where(
          and(eq(invoices.id, input.id), eq(invoices.user_id, session.user.sub))
        )
      if (!invoice) return null

      const locale = await inferLocaleFromHeaders()
      const stream = await renderToStream(
        <Invoice
          mode="yoga"
          invoice={invoice}
          locale={locale}
          layout={DEFAULT_LAYOUT}
        />
      )
      return stream
    }),
  getInvoices: baseProcedure
    .input(
      type({
        page: 'number',
        paid: 'boolean | null',
        ordering: type([
          "'created_at' | 'updated_at' | 'paid_at' | 'date_issued' | 'date_due' | 'invoice_number' | 'total_usd'",
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
      if (paid === true) where.push(isNotNull(invoices.paid_at))
      if (paid === false) where.push(isNull(invoices.paid_at))
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
  getLast12MonthsRevenue: baseProcedure.query(async () => {
    'use server'
    const session = await auth0.getSession()
    if (!session) return null

    const cte = db()
      .$with('months')
      .as(
        db().select({
          month: sql<string>`date_trunc('month', dd)::date`.as('month'),
        }).from(sql`generate_series(
                date_trunc('month', CURRENT_DATE - INTERVAL '11 months'),
                date_trunc('month', CURRENT_DATE),
                INTERVAL '1 month'
              ) as dd`)
      )

    return await db()
      .with(cte)
      .select({
        month: cte.month,
        total_usd: sum(invoices.total_usd).mapWith(Number),
      })
      .from(cte)
      .leftJoin(
        invoices,
        sql`date_trunc('month', ${invoices.paid_at}) = ${cte.month}`
      )
      .where(eq(invoices.user_id, session.user.sub))
      .groupBy(cte.month)
      .orderBy(cte.month)
  }),
  getBusinessProfile: baseProcedure.query(async () => {
    'use server'
    const session = await auth0.getSession()
    if (!session) return null

    const [profile = null] = await db()
      .select()
      .from(business_profiles)
      .where(and(eq(business_profiles.user_id, session.user.sub)))

    return profile
  }),
  createBusinessProfile: baseProcedure
    .input(BusinessProfileInsertSchema.omit('user_id'))
    .mutation(async ({ input }) => {
      'use server'
      const session = await auth0.getSession()
      if (!session) return null

      const [existing = null] = await db()
        .select()
        .from(business_profiles)
        .where(and(eq(business_profiles.user_id, session.user.sub)))
      if (existing) return null

      const [profile = null] = await db()
        .insert(business_profiles)
        .values({ ...input, user_id: session.user.sub })
        .returning()

      return profile
    }),
  updateBusinessProfile: baseProcedure
    .input(type({ id: 'string', updates: BusinessProfileUpdateSchema }))
    .mutation(async ({ input }) => {
      'use server'
      const session = await auth0.getSession()
      if (!session) return null

      const [profile = null] = await db()
        .update(business_profiles)
        .set(input.updates)
        .where(
          and(
            eq(business_profiles.user_id, session.user.sub),
            eq(business_profiles.id, input.id)
          )
        )
        .returning()

      return profile
    }),
  updateClient: baseProcedure
    .input(type({ id: 'string', updates: ClientUpdateSchema }))
    .mutation(async ({ input }) => {
      'use server'
      const session = await auth0.getSession()
      if (!session) return null

      const [client = null] = await db()
        .update(clients)
        .set(input.updates)
        .where(
          and(eq(clients.user_id, session.user.sub), eq(clients.id, input.id))
        )
        .returning()

      return client
    }),
  getOutstandingClientBalance: baseProcedure
    .input(type({ id: 'string ' }))
    .query(async ({ input }) => {
      'use server'
      const session = await auth0.getSession()
      if (!session) return null

      const [{ total_usd } = { total_usd: 0 }] = await db()
        .select({
          total_usd: sum(invoices.total_usd).mapWith(Number),
        })
        .from(invoices)
        .where(
          and(
            eq(invoices.user_id, session.user.sub),
            eq(invoices.client_id, input.id),
            isNull(invoices.paid_at)
          )
        )
      return total_usd
    }),
})
