import { type } from 'arktype'
import { and, asc, count, desc, eq, isNotNull, isNull } from 'drizzle-orm'
import BigNumber from 'bignumber.js'
import { baseProcedure, createTRPCRouter } from '@/lib/trpc/init'
import { CurrencySchema } from '@/lib/currency/types'
import { getConversionRates } from '@/lib/currency/utils'
import { auth0 } from '@/lib/auth'
import { invoices } from '@/lib/db/schema'
import { db } from '@/lib/db/client'

export const trpcRouter = createTRPCRouter({
  getInvoices: baseProcedure
    .input(
      type({
        page: 'number',
        paid: 'boolean | null',
        ordering: type([
          "'created_at' | 'updated_at' | 'date_paid' | 'date_issued' | 'date_due' | 'invoice_number' | 'total'",
          '"asc" | "desc"',
        ]).or('null'),
        currency: CurrencySchema.or('null'),
      })
    )
    .query(async ({ input: { currency, ordering, page, paid } }) => {
      'use server'
      const session = await auth0.getSession()
      const userId = session?.user.sub
      if (!userId) return { invoices: [], currentPage: page, maxPage: page }

      let where = []
      if (paid === true) where.push(isNotNull(invoices.date_paid))
      if (paid === false) where.push(isNull(invoices.date_paid))
      if (currency) where.push(eq(invoices.currency, currency))

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
      const userId = session?.user.sub
      if (!userId) return null

      const conversion = await getConversionRates()

      const upcoming = await db()
        .select({
          total: invoices.total,
          currency: invoices.currency,
        })
        .from(invoices)
        .where(isNotNull(invoices.date_paid))

      const total = upcoming.reduce((acc, invoice) => {
        const rateA = conversion.data.rates[input.currency]
        const rateB = conversion.data.rates[invoice.currency]

        const converted = new BigNumber(invoice.total)
          .multipliedBy(new BigNumber(rateA).dividedBy(rateB))
          .decimalPlaces(2)
          .toNumber()

        return acc + converted
      }, 0)

      return { total, timestamp: conversion.data.timestamp }
    }),
})
