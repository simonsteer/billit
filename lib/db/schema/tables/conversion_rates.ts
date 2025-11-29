import { jsonb, pgTable, text } from 'drizzle-orm/pg-core'
import { created_at_updated_at } from '@/lib/db/schema/mixins'
import { Currency } from '@/lib/currency/types'

export const conversion_rates = pgTable('conversion_rates', {
  updated_at: created_at_updated_at.updated_at,
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
