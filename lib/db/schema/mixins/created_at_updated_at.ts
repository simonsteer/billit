import { sql } from 'drizzle-orm'
import { PgColumnBuilderBase, timestamp } from 'drizzle-orm/pg-core'

export const created_at_updated_at = {
  created_at: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp({ mode: 'string' }).$onUpdate(() => sql`now()`),
} satisfies Record<string, PgColumnBuilderBase>
