import { relations } from 'drizzle-orm'
import { date, index, integer, jsonb, pgTable, text } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'
import { created_at_updated_at } from '@/lib/db/schema/mixins'
import { currenciesEnum } from '@/lib/db/schema/enums'
import { clients } from '@/lib/db/schema'
import { ClientJson } from '@/lib/clients/types'
import { BusinessProfileJson } from '@/lib/business_profiles/types'
import { LineItemJson, TaxItemJson } from '@/lib/invoices/types'

export const invoices = pgTable(
  'invoices',
  {
    ...created_at_updated_at,
    id: text()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    user_id: text().notNull(),
    client_id: text()
      .notNull()
      .references(() => clients.id),
    client_snapshot: jsonb().$type<ClientJson>().notNull(),
    business_profile_snapshot: jsonb().$type<BusinessProfileJson>().notNull(),
    from_description: text().notNull(),
    to_description: text().notNull(),
    payment_description: text().notNull(),
    invoice_number: integer().notNull(),
    date_issued: date().notNull(),
    date_due: date().notNull(),
    date_paid: date(),
    currency: currenciesEnum().notNull(),
    line_items: jsonb().$type<LineItemJson[]>().notNull(),
    tax_items: jsonb().$type<TaxItemJson[]>().notNull(),
    subtotal: integer().notNull(),
    total: integer().notNull(),
    total_usd: integer().notNull(),
  },
  table => [
    index('index_invoices_on_user_id').on(table.user_id),
    index('index_invoices_on_user_id_and_client_id').on(
      table.user_id,
      table.client_id
    ),
  ]
)

export const invoices_relations = relations(invoices, ({ one }) => ({
  client: one(clients, {
    fields: [invoices.client_id],
    references: [clients.id],
  }),
}))
