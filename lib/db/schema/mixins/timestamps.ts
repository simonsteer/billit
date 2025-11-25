import { sql } from 'drizzle-orm'
import { PgColumnBuilderBase, timestamp } from 'drizzle-orm/pg-core'

export const timestamps = {
  created_at: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp({ mode: 'string' }).$onUpdate(() => sql`now()`),
} satisfies Record<string, PgColumnBuilderBase>
