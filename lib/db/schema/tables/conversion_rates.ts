import { jsonb, pgTable, text } from 'drizzle-orm/pg-core'
import { timestamps } from '@/lib/db/schema/mixins'
import { Currency } from '@/lib/currency/types'

export const conversion_rates = pgTable('conversion_rates', {
  updated_at: timestamps.updated_at,
  id: text().primaryKey().notNull().default('singleton'),
  data: jsonb()
    .$type<{
      disclaimer: string
      license: string
      timestamp: number
      base: 'USD'
      rates: {
        [C in Currency]: number
      }
    }>()
    .notNull(),
})
