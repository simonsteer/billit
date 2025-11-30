import { createInsertSchema, createSelectSchema } from 'drizzle-arktype'
import { clients } from '@/lib/db/schema'

export const ClientSchema = createSelectSchema(clients)

export const ClientInsertSchema = createInsertSchema(clients)

export const ClientUpdateSchema = ClientSchema.partial()

export type ClientJson = typeof ClientSchema.infer
