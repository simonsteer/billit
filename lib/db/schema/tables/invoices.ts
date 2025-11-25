import {
  date,
  index,
  integer,
  jsonb,
  pgTable,
  uuid,
  text,
} from 'drizzle-orm/pg-core'
import { timestamps } from '@/lib/db/schema/mixins'
import { currenciesEnum } from '@/lib/db/schema/enums'

export const invoices = pgTable(
  'invoices',
  {
    ...timestamps,
    id: uuid().primaryKey().defaultRandom(),
    user_id: text().notNull(),
    from_description: text().notNull(),
    to_description: text().notNull(),
    payment_description: text().notNull(),
    invoice_number: integer().notNull(),
    date_issued: date().notNull(),
    date_due: date().notNull(),
    date_paid: date(),
    currency: currenciesEnum().notNull(),
    line_items: jsonb()
      .$type<
        {
          id: string
          description: string
          quantity: number
          price: number
        }[]
      >()
      .notNull(),
    tax_items: jsonb()
      .$type<
        {
          id: string
          text: string
          label: string | null
          amount: number
          cost: number
        }[]
      >()
      .notNull(),
    subtotal: integer().notNull(),
    total: integer().notNull(),
  },
  table => [index('user_id_idx').on(table.user_id)]
)
