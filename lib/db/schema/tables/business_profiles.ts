import { index, pgTable, text } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'
import { created_at_updated_at } from '@/lib/db/schema/mixins'

export const business_profiles = pgTable(
  'business_profiles',
  {
    ...created_at_updated_at,
    id: text()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    user_id: text().notNull(),
    business_name: text().notNull(),
    address_line_1: text(),
    address_line_2: text(),
    city: text(),
    zip_code: text(),
    state: text(),
    country: text(),
    email: text(),
  },
  table => [index('index_business_profiles_on_user_id').on(table.user_id)]
)
