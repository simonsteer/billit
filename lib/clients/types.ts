import { createInsertSchema, createSelectSchema } from 'drizzle-arktype'
import { clients } from '@/lib/db/schema'

export const ClientSchema = createSelectSchema(clients)

export const ClientInsertSchema = createInsertSchema(clients)

export const ClientUpdateSchema = ClientSchema.omit(
  'id',
  'created_at',
  'updated_at'
)
  .partial()
  .omit('user_id')

export type ClientJson = typeof ClientSchema.infer
