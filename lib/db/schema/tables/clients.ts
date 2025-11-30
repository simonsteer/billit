import { relations } from 'drizzle-orm'
import { index, pgTable, text } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'
import { created_at_updated_at } from '@/lib/db/schema/mixins'
import { invoices } from './invoices'

export const clients = pgTable(
  'clients',
  {
    ...created_at_updated_at,
    id: text()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    user_id: text().notNull(),
    name: text().notNull(),
    contact_information: text().notNull(),
    notes: text(),
  },
  table => [index('index_clients_on_user_id').on(table.user_id)]
)

export const clients_relations = relations(clients, ({ many }) => ({
  invoices: many(invoices),
}))
